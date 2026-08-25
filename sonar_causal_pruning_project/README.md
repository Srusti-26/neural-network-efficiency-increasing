# Causal Neuron Pruning on Sonar

A structural neuron-pruning study extending the ATCP (Activation Trajectory
Causal Pruning) line of research to the Sonar (Connectionist Bench: Mines
vs. Rocks) dataset, with the same three fixes used in the Car Evaluation
module of this project so the result is a genuine, defensible research
contribution rather than a rerun on a new dataset.

## Why Sonar

- 60 continuous, already-numeric features and 208 total rows -- small
  enough to train fast on a laptop or free Colab CPU, so it's a good
  dataset for whoever on the team is newest to this.
- Binary classification (Mine vs. Rock), unlike the multi-class Car
  Evaluation and 10-class MNIST modules already in this repo -- gives the
  team a genuinely different setting to report on, not just "same pipeline,
  different CSV".
- All-numeric input means no one-hot encoding step (unlike Car Evaluation)
  and no image/CNN machinery (unlike MNIST/Fashion-MNIST) -- the smallest
  amount of new code to review and defend in front of the guide.
- It's a well-known pruning benchmark in the literature, so there's
  something to compare your causal/magnitude/random numbers against if you
  want extra discussion points in the report.

## What this fixes vs. the base pipeline / source papers

1. **ADF stationarity testing is actually implemented.** Granger causality
   run on a non-stationary time series is a well-known spurious-regression
   risk. This version tests every neuron's activation trajectory
   (`causality.py`), differences non-stationary series once and re-tests
   (standard remedy), and excludes still-non-stationary neurons from the
   causal score rather than silently trusting an invalid test.

2. **Causality is measured neuron -> output, not neuron -> neuron.** This
   version tests whether each neuron's own activation history Granger-causes
   the network's output (true-class probability) -- the actual ATCP
   definition -- which is also O(N) instead of O(N^2) (`GRANGER_MAX_LAG` in
   `config.py`; default is 5, documented and configurable, not silent).

3. **Causal pruning is benchmarked against magnitude and random baselines,
   across multiple seeds.** This version runs causal / magnitude / random
   pruning across `SEEDS = [42, 123, 2024]` at pruning levels
   `[10, 20, 30, 40, 50, 60, 70]`, and reports mean +/- std accuracy per
   method -- so "our method is better" is a number you can show, not a
   claim you're asserting.

## Project structure

```
sonar-causal-pruning/
├── src/
│   ├── config.py          seeds, hyperparameters, pruning levels
│   ├── data.py             Sonar loader (OpenML, fallback to UCI mirror)
│   ├── model.py             MLP with structural (physical) pruning support
│   ├── trainer.py           training loop + activation/output logging
│   ├── causality.py         ADF stationarity + neuron->output Granger causality
│   ├── pruning.py           causal / magnitude / random importance + pruning
│   ├── evaluation.py         accuracy, F1, size, inference time
│   ├── experiment.py         full multi-seed x multi-method experiment runner
│   └── visualization.py      comparison plots
├── run_experiment.py       CLI entry point
├── requirements.txt
└── Sonar_Causal_Pruning.ipynb   self-contained Colab notebook
```

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run_experiment.py
```

For a faster smoke-test before the full run:
```bash
python run_experiment.py --seeds 42 --prune-pcts 20 50 --epochs-baseline 15 --epochs-finetune 5
```

## Run on Google Colab

Upload `Sonar_Causal_Pruning.ipynb` to Colab and run all cells top to
bottom. It's fully self-contained -- the notebook writes out every `src/`
file itself via `%%writefile`, so it does not require you to have pushed
this to GitHub or upload any other files first. No GPU needed; the model
is tiny (two hidden layers, ~32 and ~16 neurons).

## Push to GitHub

```bash
git init
git add .
git commit -m "Causal neuron pruning on Sonar: ADF + neuron->output Granger causality, benchmarked against magnitude/random baselines across 3 seeds"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Outputs (in `results/` after a run)

| File | What it is |
|---|---|
| `combined_results.csv` | every (seed, method, prune_pct) run -- the raw data |
| `summary_mean_std.csv` | accuracy/F1/params/inference mean +/- std per method x prune_pct |
| `causality_summary.csv` | how many neurons were stationary / Granger-causal per seed |
| `method_comparison.png` | causal vs magnitude vs random accuracy-vs-pruning, with error bars |
| `causality_summary.png` | stationarity + causality neuron counts per seed |
| `causality_seed<N>.csv` | full per-neuron ADF p-value, F-stat, Granger p-value |

## Interpreting the result for your presentation

If `causal` sits above `magnitude` and `random` in `method_comparison.png`
at most pruning levels, with error bars that don't overlap the random
baseline, that is a genuine, defensible claim: the Granger-causality signal
is adding real information beyond what weight magnitude or chance already
gives you. If it doesn't clearly separate from magnitude, that's still a
publishable, honest finding -- report it as "causal and magnitude pruning
perform comparably on Sonar, both clearly beating random" rather than
overstating the result. With only 208 rows total, run-to-run variance will
be higher than on Car Evaluation or MNIST -- that's expected and worth
naming explicitly in your report rather than hiding it.
