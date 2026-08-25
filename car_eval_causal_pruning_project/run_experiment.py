#!/usr/bin/env python3
"""
run_experiment.py - Car Evaluation causal pruning study.

Runs, for each seed in src.config.SEEDS: baseline training, ADF +
neuron-to-output Granger causality analysis, then structural pruning +
fine-tuning at every percentage in src.config.PRUNE_PERCENTAGES, for all
three methods (causal / magnitude / random).

Usage:
    python run_experiment.py
    python run_experiment.py --seeds 42 --prune-pcts 20 40 60 --epochs-baseline 20
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src import config as cfg
from src.experiment import run_all
from src.visualization import plot_causality_summary, plot_method_comparison


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--seeds", nargs="+", type=int, default=cfg.SEEDS)
    p.add_argument("--prune-pcts", nargs="+", type=int, default=cfg.PRUNE_PERCENTAGES)
    p.add_argument("--methods", nargs="+", type=str, default=cfg.METHODS)
    p.add_argument("--epochs-baseline", type=int, default=cfg.EPOCHS_BASELINE)
    p.add_argument("--epochs-finetune", type=int, default=cfg.EPOCHS_FINETUNE)
    return p.parse_args()


def main():
    args = parse_args()

    results_df = run_all(
        seeds=args.seeds,
        prune_pcts=args.prune_pcts,
        methods=args.methods,
        epochs_baseline=args.epochs_baseline,
        epochs_finetune=args.epochs_finetune,
    )

    baseline_acc = results_df[results_df["method"] == "baseline"]["accuracy"].mean()

    plot_method_comparison(
        cfg.RESULTS / "summary_mean_std.csv", baseline_acc,
        cfg.RESULTS / "method_comparison.png",
    )
    plot_causality_summary(
        cfg.RESULTS / "causality_summary.csv",
        cfg.RESULTS / "causality_summary.png",
    )

    print("\nDone. Key outputs in results/:")
    print("  combined_results.csv     - every (seed, method, prune_pct) run")
    print("  summary_mean_std.csv     - aggregated mean +/- std per method/prune_pct")
    print("  causality_summary.csv    - stationarity + causality neuron counts per seed")
    print("  method_comparison.png    - causal vs magnitude vs random accuracy chart")
    print("  causality_summary.png    - stationarity/causality bar chart")


if __name__ == "__main__":
    main()
