"""Global configuration for the Car Evaluation causal pruning study."""

import pathlib
import random

import numpy as np
import torch

# -- Reproducibility -------------------------------------------------------
SEEDS = [42, 123, 2024]   # multi-seed: the source papers use only seed=42;
                          # we report mean +/- std across 3 seeds for a
                          # genuine robustness claim they don't make.


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False


# -- Paths -------------------------------------------------------------------
ROOT     = pathlib.Path(__file__).parent.parent
RESULTS  = ROOT / "results"
MODELS   = RESULTS / "models"
RESULTS.mkdir(parents=True, exist_ok=True)
MODELS.mkdir(parents=True, exist_ok=True)

# -- Data ----------------------------------------------------------------------
DATASET_NAME = "car"          # OpenML: car (Car Evaluation)
TEST_SIZE    = 0.2

# -- Model / training ----------------------------------------------------------
HIDDEN_DIMS      = [64, 32]
BATCH_SIZE       = 64
EPOCHS_BASELINE  = 40
EPOCHS_FINETUNE  = 15
LEARNING_RATE    = 1e-3

# -- Importance weighting -------------------------------------------------------
ALPHA = 0.4   # weight magnitude
BETA  = 0.3   # activation strength
GAMMA = 0.3   # causal significance (ADF-filtered Granger, neuron -> output)

# -- Pruning ---------------------------------------------------------------------
PRUNE_PERCENTAGES = [10, 20, 30, 40, 50, 60, 70]
METHODS = ["causal", "magnitude", "random"]   # causal = ours, other two = baselines

# -- Causality -----------------------------------------------------------------
GRANGER_MAX_LAG   = 5      # kept lower than the source papers' L=14 deliberately:
                            # with only ~64-neuron hidden layers and a few hundred
                            # logged steps, lag=14 starves the regression of degrees
                            # of freedom (T - 2L - 1 shrinks fast). We report this
                            # as a documented deviation, not a silent one.
GRANGER_SAMPLE    = 400    # activation steps logged for causality analysis
ADF_ALPHA         = 0.05   # stationarity significance threshold
GRANGER_ALPHA     = 0.05   # causality significance threshold
