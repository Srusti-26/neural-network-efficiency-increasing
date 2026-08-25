"""Importance scoring and structural pruning for three methods:

  causal    -- our method (weight + activation + ADF-filtered Granger causality)
  magnitude -- classic weight-magnitude baseline (Hagiwara-style, used in the
               survey paper you're building on; also what the ATCP papers
               never actually benchmarked against)
  random    -- random baseline, the sanity-check floor: if causal doesn't
               clearly beat random, the causality signal isn't adding value.

Including magnitude + random directly answers the #1 limitation the ATCP
paper states about itself: "has not been directly compared with established
pruning techniques ... under identical experimental settings."
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn as nn

from .config import ALPHA, BETA, GAMMA
from .model import MLP


def _minmax(arr: np.ndarray) -> np.ndarray:
    lo, hi = arr.min(), arr.max()
    return (arr - lo) / (hi - lo + 1e-8)


def compute_causal_importance(
    model: MLP,
    activations_csv: Path,
    causality_df: pd.DataFrame,
    alpha: float = ALPHA,
    beta: float = BETA,
    gamma: float = GAMMA,
) -> dict[str, np.ndarray]:
    act_df = pd.read_csv(activations_csv)
    linears = [m for m in model.net if isinstance(m, nn.Linear)][:-1]

    importance: dict[str, np.ndarray] = {}
    for layer_idx, linear in enumerate(linears):
        name = f"hidden_{layer_idx}"

        W = linear.weight.data.cpu().numpy()
        w_mag = np.abs(W).mean(axis=1)

        act_cols = [c for c in act_df.columns if c.startswith(f"{name}_n")]
        act_mean = np.abs(act_df[act_cols].values).mean(axis=0)

        # causal score: -log10(p) for causal neurons (bigger = more
        # significant), 0 for non-causal / non-stationary neurons
        layer_neurons = [c for c in causality_df.index if c.startswith(f"{name}_n")]
        c_score = np.zeros(len(w_mag))
        for i, col in enumerate(layer_neurons):
            if i >= len(c_score):
                break
            row = causality_df.loc[col]
            if row["is_causal"]:
                c_score[i] = -np.log10(max(row["granger_pvalue"], 1e-12))

        n = min(len(w_mag), len(act_mean), len(c_score))
        w_mag, act_mean, c_score = w_mag[:n], act_mean[:n], c_score[:n]

        score = alpha * _minmax(w_mag) + beta * _minmax(act_mean) + gamma * _minmax(c_score)
        importance[name] = score

    return importance


def compute_magnitude_importance(model: MLP) -> dict[str, np.ndarray]:
    """Baseline: importance = mean |weight| only."""
    linears = [m for m in model.net if isinstance(m, nn.Linear)][:-1]
    importance = {}
    for layer_idx, linear in enumerate(linears):
        W = linear.weight.data.cpu().numpy()
        importance[f"hidden_{layer_idx}"] = np.abs(W).mean(axis=1)
    return importance


def compute_random_importance(model: MLP, rng: np.random.Generator) -> dict[str, np.ndarray]:
    """Baseline: random importance scores (sanity-check floor)."""
    linears = [m for m in model.net if isinstance(m, nn.Linear)][:-1]
    importance = {}
    for layer_idx, linear in enumerate(linears):
        importance[f"hidden_{layer_idx}"] = rng.random(linear.out_features)
    return importance


def prune_model(model: MLP, prune_pct: float, importance: dict[str, np.ndarray]) -> tuple[MLP, list[list[int]]]:
    """Structurally rebuild a smaller model keeping the top-scoring neurons."""
    if prune_pct == 0:
        keep_indices = [list(range(len(v))) for v in importance.values()]
        return model, keep_indices

    keep_indices: list[list[int]] = []
    for scores in importance.values():
        n_total = len(scores)
        n_remove = int(n_total * prune_pct / 100)
        n_keep = max(1, n_total - n_remove)
        ranked = np.argsort(scores)[::-1]
        keep_indices.append(sorted(ranked[:n_keep].tolist()))

    new_hidden_dims = [len(ki) for ki in keep_indices]
    new_model = MLP.from_dims(model.input_dim, new_hidden_dims, model.output_dim)
    new_model.copy_weights_from(model, keep_indices)
    return new_model, keep_indices
