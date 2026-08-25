"""Comparison plots: causal vs magnitude vs random, with error bars from
the multi-seed runs -- the plot the ATCP papers don't have."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

METHOD_COLORS = {"causal": "#1D9E75", "magnitude": "#378ADD", "random": "#888780"}


def plot_method_comparison(summary_csv: Path, baseline_acc: float, save_path: Path) -> None:
    df = pd.read_csv(summary_csv)

    fig, ax = plt.subplots(figsize=(8, 5))
    for method in ["causal", "magnitude", "random"]:
        sub = df[df["method"] == method].sort_values("prune_pct")
        if sub.empty:
            continue
        ax.errorbar(
            sub["prune_pct"], sub["accuracy_mean"], yerr=sub["accuracy_std"],
            label=method, marker="o", capsize=3, color=METHOD_COLORS.get(method),
        )

    ax.axhline(baseline_acc, color="black", linestyle="--", linewidth=1, label="baseline (0% pruned)")
    ax.set_xlabel("Neurons pruned (%)")
    ax.set_ylabel("Test accuracy (mean +/- std across seeds)")
    ax.set_title("Car Evaluation: causal vs magnitude vs random pruning")
    ax.legend()
    ax.grid(alpha=0.3)
    fig.tight_layout()
    fig.savefig(save_path, dpi=150)
    plt.close(fig)


def plot_causality_summary(causality_summary_csv: Path, save_path: Path) -> None:
    df = pd.read_csv(causality_summary_csv)
    fig, ax = plt.subplots(figsize=(7, 4))
    x = range(len(df))
    ax.bar(x, df["n_stationary"], label="stationary neurons", color="#5DCAA5", alpha=0.8)
    ax.bar(x, df["n_causal"], label="Granger-causal neurons", color="#0F6E56")
    ax.set_xticks(list(x))
    ax.set_xticklabels([f"seed {s}" for s in df["seed"]])
    ax.set_ylabel("Neuron count")
    ax.set_title("ADF stationarity + Granger causality per seed")
    ax.legend()
    fig.tight_layout()
    fig.savefig(save_path, dpi=150)
    plt.close(fig)
