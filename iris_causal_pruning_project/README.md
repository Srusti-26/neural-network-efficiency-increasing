# Iris causal pruning project

This directory contains the Iris dataset Colab notebook and the results produced by Nidhi.

Files moved from the repository root into this folder:

- Iris_Causal_Pruning.ipynb — the full Colab notebook that reproduces the experiments on the Iris dataset.

Results (moved into iris_causal_pruning_project/results/):
- activations_seed42.csv — logged hidden activations (seed 42)
- activations_seed123.csv — logged hidden activations (seed 123)
- activations_seed2024.csv — logged hidden activations (seed 2024)
- causality_seed42.csv — neuron -> output causality results (seed 42)
- causality_seed123.csv — neuron -> output causality results (seed 123)
- causality_seed2024.csv — neuron -> output causality results (seed 2024)
- causality_summary.csv — per-seed summary (stationary and causal neuron counts)
- combined_results.csv — per-run combined metrics (accuracy, f1, size, etc.)
- summary_mean_std.csv — aggregated mean/std summary used for plots
- causality_summary.png — visual summary (bar chart)
- method_comparison.png — accuracy comparison plot across pruning methods

These files were previously at the repository root and have been moved into this folder to mirror the other dataset project layouts (car_eval_causal_pruning_project/, sonar_causal_pruning_project/).

Moved by: @Srusti-26
