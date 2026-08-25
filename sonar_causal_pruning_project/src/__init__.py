"""Sonar causal pruning study - src package."""

from . import config
from .config import set_seed
from .data import get_sonar_loaders
from .model import MLP
from .trainer import train, log_activations, measure_inference_time
from .causality import adf_stationarity, granger_f_test, compute_neuron_output_causality
from .pruning import (
    compute_causal_importance,
    compute_magnitude_importance,
    compute_random_importance,
    prune_model,
)
from .evaluation import evaluate_full
from .experiment import run_all, get_device
from .visualization import plot_method_comparison, plot_causality_summary

__all__ = [
    "config", "set_seed",
    "get_sonar_loaders",
    "MLP",
    "train", "log_activations", "measure_inference_time",
    "adf_stationarity", "granger_f_test", "compute_neuron_output_causality",
    "compute_causal_importance", "compute_magnitude_importance", "compute_random_importance", "prune_model",
    "evaluate_full",
    "run_all", "get_device",
    "plot_method_comparison", "plot_causality_summary",
]
