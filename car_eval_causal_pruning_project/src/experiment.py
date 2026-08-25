"""Runs the full comparison: causal vs magnitude vs random pruning,
across multiple seeds and pruning percentages, on Car Evaluation.

This is the actual research deliverable: a single combined_results.csv
with every (seed, method, prune_pct) combination, from which the
mean +/- std comparison plot and table are built.
"""

from __future__ import annotations

import copy

import numpy as np
import pandas as pd
import torch

from . import config as cfg
from .causality import compute_neuron_output_causality
from .data import get_car_loaders
from .evaluation import evaluate_full
from .model import MLP
from .pruning import (
    compute_causal_importance,
    compute_magnitude_importance,
    compute_random_importance,
    prune_model,
)
from .trainer import log_activations, train


def get_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def run_all(
    seeds: list[int] = cfg.SEEDS,
    prune_pcts: list[int] = cfg.PRUNE_PERCENTAGES,
    methods: list[str] = cfg.METHODS,
    epochs_baseline: int = cfg.EPOCHS_BASELINE,
    epochs_finetune: int = cfg.EPOCHS_FINETUNE,
) -> pd.DataFrame:
    device = get_device()
    all_rows: list[dict] = []
    causality_summaries: list[dict] = []

    for seed in seeds:
        print(f"\n{'='*70}\nSEED {seed}\n{'='*70}")
        cfg.set_seed(seed)

        train_loader, test_loader, input_dim, output_dim, meta = get_car_loaders()

        # -- baseline training ---------------------------------------------
        model = MLP(input_dim=input_dim, hidden_dims=cfg.HIDDEN_DIMS, output_dim=output_dim).to(device)
        history = train(model, train_loader, test_loader, epochs_baseline, device, verbose=True)

        baseline_row = evaluate_full(
            model, test_loader, device, label="baseline", method="baseline",
            seed=seed, prune_pct=0, train_loss=history["train_loss"][-1],
        )
        all_rows.append(baseline_row)
        print(f"  baseline: acc={baseline_row['accuracy']:.4f}  params={baseline_row['n_params']}")

        # -- activation logging + causality (once per seed, reused by the
        #    'causal' method across all prune_pcts) --------------------------
        act_csv = cfg.RESULTS / f"activations_seed{seed}.csv"
        log_activations(model, train_loader, device, cfg.GRANGER_SAMPLE, act_csv)

        causality_csv = cfg.RESULTS / f"causality_seed{seed}.csv"
        causality_df = compute_neuron_output_causality(
            act_csv, max_lag=cfg.GRANGER_MAX_LAG, save_path=causality_csv
        )
        n_causal = int(causality_df["is_causal"].sum())
        n_stationary = int(causality_df["stationary"].sum())
        n_total = len(causality_df)
        print(f"  causality: {n_stationary}/{n_total} neurons stationary, "
              f"{n_causal}/{n_total} Granger-cause the output (p<{cfg.GRANGER_ALPHA})")
        causality_summaries.append({
            "seed": seed, "n_neurons": n_total,
            "n_stationary": n_stationary, "n_causal": n_causal,
        })

        rng = np.random.default_rng(seed)

        # -- prune + fine-tune, per method, per pruning level -----------------
        for method in methods:
            for pct in prune_pcts:
                model_copy = copy.deepcopy(model)

                if method == "causal":
                    importance = compute_causal_importance(model_copy, act_csv, causality_df)
                elif method == "magnitude":
                    importance = compute_magnitude_importance(model_copy)
                elif method == "random":
                    importance = compute_random_importance(model_copy, rng)
                else:
                    raise ValueError(method)

                pruned_model, keep_idx = prune_model(model_copy, pct, importance)
                pruned_model.to(device)

                pruned_history = train(pruned_model, train_loader, test_loader, epochs_finetune, device)

                row = evaluate_full(
                    pruned_model, test_loader, device,
                    label=f"{method}_{pct}", method=method, seed=seed, prune_pct=pct,
                    train_loss=pruned_history["train_loss"][-1],
                )
                all_rows.append(row)
                print(f"  {method:10s} {pct:3d}%  acc={row['accuracy']:.4f}  "
                      f"params={row['n_params']:5d}  inf={row['inference_ms']:.2f}ms")

    results_df = pd.DataFrame(all_rows)
    results_df.to_csv(cfg.RESULTS / "combined_results.csv", index=False)

    pd.DataFrame(causality_summaries).to_csv(cfg.RESULTS / "causality_summary.csv", index=False)

    summary = (
        results_df[results_df["method"] != "baseline"]
        .groupby(["method", "prune_pct"])
        .agg(
            accuracy_mean=("accuracy", "mean"), accuracy_std=("accuracy", "std"),
            f1_mean=("f1_score", "mean"), f1_std=("f1_score", "std"),
            params_mean=("n_params", "mean"),
            inference_ms_mean=("inference_ms", "mean"),
        )
        .reset_index()
    )
    summary.to_csv(cfg.RESULTS / "summary_mean_std.csv", index=False)

    print(f"\nSaved: {cfg.RESULTS / 'combined_results.csv'}")
    print(f"Saved: {cfg.RESULTS / 'summary_mean_std.csv'}")
    return results_df
