# Iris Causal Pruning

This folder contains the Iris dataset experiment uploaded by Nidhi for the
Neural Network Efficiency project. The experiment investigates whether hidden
neurons can be pruned using activation behaviour and Granger-causality-based
importance while retaining model performance.

## Contents

```text
iris_causal_pruning_project/
├── Iris_Causal_Pruning.ipynb  # Analysis notebook and experiment workflow
└── results/                   # Generated measurements and figures
```

Open `Iris_Causal_Pruning.ipynb` and run its cells from top to bottom to review
the data preparation, model training, causal analysis, pruning comparisons,
and visualisations. The checked-in result files preserve the outputs produced
for seeds `42`, `123`, and `2024`.

## Results

| File | Description |
| --- | --- |
| `combined_results.csv` | Per-seed results for each pruning method and pruning level |
| `summary_mean_std.csv` | Mean and standard deviation summary across seeds |
| `causality_summary.csv` | Causality analysis summary by seed |
| `causality_seed42.csv` | Per-neuron causality results for seed 42 |
| `causality_seed123.csv` | Per-neuron causality results for seed 123 |
| `causality_seed2024.csv` | Per-neuron causality results for seed 2024 |
| `activations_seed42.csv` | Logged neuron activations for seed 42 |
| `activations_seed123.csv` | Logged neuron activations for seed 123 |
| `activations_seed2024.csv` | Logged neuron activations for seed 2024 |
| `method_comparison.png` | Visual comparison of pruning methods |
| `causality_summary.png` | Visual summary of the causality analysis |

## Research workflow

```text
Prepare Iris data
	-> train baseline model
	-> record hidden activations
	-> calculate causality-based importance
	-> compare causal, magnitude, and random pruning
	-> evaluate performance and efficiency
```

Keeping the notebook beside its `results/` directory makes the Iris experiment
self-contained and keeps it separate from the Car Evaluation, Sonar, and MNIST
experiments in the parent repository.

## Relationship to the parent project

See the [main project README](../README.md) for the overall research goals and
the other dataset modules. The Car Evaluation documentation is available in
[`car_eval_causal_pruning_project/README.md`](../car_eval_causal_pruning_project/README.md).

## Provenance

The notebook and result files were uploaded by Nidhi and have been moved from
the repository root into this project folder so that the experiment and its
outputs remain together.
