"""Stationarity testing (ADF) + Granger causality of each hidden neuron
against the network's OUTPUT signal.

This is the core research improvement over the base repo:

1. The base repo never checks stationarity before running Granger
   causality. Granger causality on a non-stationary series is a textbook
   spurious-regression risk (the F-test can find "significant" causality
   between two series that share nothing but a trend). The ATCP papers this
   project builds on DO check this with an ADF test -- the base repo
   silently skipped it. We add it back, matching the source papers'
   rigor, and difference any non-stationary series once before testing
   (a standard remedy) rather than either ignoring the problem or
   discarding those neurons outright.

2. The base repo computed an N x N matrix of neuron <-> neuron causality
   and used "mean influence received from other neurons" as the causal
   score. That is a different quantity from what the ATCP papers actually
   define: whether a neuron's own activation history Granger-causes the
   OUTPUT. We compute that directly (neuron -> output), which is O(N)
   instead of O(N^2), so it is also cheap enough to run at the full lag
   the papers use if you want to push GRANGER_MAX_LAG back up to 14 for a
   direct comparison.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import f as f_dist
from statsmodels.tsa.stattools import adfuller

from .config import ADF_ALPHA, GRANGER_ALPHA, GRANGER_MAX_LAG


def adf_stationarity(series: np.ndarray, alpha: float = ADF_ALPHA) -> tuple[bool, float, np.ndarray]:
    """Return (is_stationary, p_value, series_used).

    If the raw series is non-stationary, first-difference it once and
    re-test (standard remedy). If still non-stationary, flag it as such --
    the caller should down-weight/exclude that neuron's causal score
    rather than trusting a Granger test run on a non-stationary signal.
    """
    series = np.asarray(series, dtype=np.float64)
    if np.allclose(series, series[0]):
        # constant series (e.g. dead ReLU neuron) -- can't test, treat as
        # non-stationary/non-informative
        return False, 1.0, series

    try:
        _, pval, *_ = adfuller(series, autolag="AIC")
    except Exception:
        return False, 1.0, series

    if pval < alpha:
        return True, pval, series

    # try one differencing pass
    diff = np.diff(series)
    if len(diff) < 10 or np.allclose(diff, diff[0]):
        return False, pval, series
    try:
        _, pval_d, *_ = adfuller(diff, autolag="AIC")
    except Exception:
        return False, pval, series

    return (pval_d < alpha), pval_d, diff


def _ols_rss(y: np.ndarray, X: np.ndarray) -> float:
    coef, *_ = np.linalg.lstsq(X, y, rcond=None)
    resid = y - X @ coef
    return float(resid @ resid)


def granger_f_test(x: np.ndarray, y: np.ndarray, max_lag: int) -> tuple[float, float]:
    """Does x Granger-cause y? Returns (F, p_value)."""
    T = len(y)
    if T <= 2 * max_lag + 2:
        return 0.0, 1.0
    try:
        Y = y[max_lag:]
        n = len(Y)
        Xr = np.column_stack([np.ones(n)] + [y[max_lag - k: T - k] for k in range(1, max_lag + 1)])
        Xu = np.column_stack([Xr] + [x[max_lag - k: T - k] for k in range(1, max_lag + 1)])

        rss_r = _ols_rss(Y, Xr)
        rss_u = _ols_rss(Y, Xu)
        if rss_u < 1e-12:
            return 0.0, 1.0

        df1, df2 = max_lag, n - Xu.shape[1]
        if df2 <= 0:
            return 0.0, 1.0

        F = max(((rss_r - rss_u) / df1) / (rss_u / df2), 0.0)
        p = float(f_dist.sf(F, df1, df2))
        return float(F), p
    except Exception:
        return 0.0, 1.0


def compute_neuron_output_causality(
    activations_csv: Path,
    max_lag: int = GRANGER_MAX_LAG,
    p_threshold: float = GRANGER_ALPHA,
    save_path: Path | None = None,
) -> pd.DataFrame:
    """For every hidden neuron, test ADF stationarity then Granger-causality
    against the output (true-class probability) series.

    Returns a DataFrame indexed by neuron name with columns:
    stationary, adf_pvalue, f_stat, granger_pvalue, is_causal
    """
    df = pd.read_csv(activations_csv)
    neuron_cols = [c for c in df.columns if c.startswith("hidden_")]
    output_series = df["output_true_class_prob"].values.astype(np.float64)

    rows = []
    for col in neuron_cols:
        series = df[col].values.astype(np.float64)
        stationary, adf_p, series_used = adf_stationarity(series)

        if not stationary:
            # non-stationary neuron: cannot trust a raw Granger F-test on it.
            # score as non-causal (p=1.0) rather than silently including it.
            rows.append({
                "neuron": col, "stationary": False, "adf_pvalue": adf_p,
                "f_stat": 0.0, "granger_pvalue": 1.0, "is_causal": False,
            })
            continue

        # align output series length to the (possibly differenced) neuron series
        out = output_series[-len(series_used):] if len(series_used) < len(output_series) else output_series
        n = min(len(series_used), len(out))
        f_stat, p_val = granger_f_test(series_used[:n], out[:n], max_lag)

        rows.append({
            "neuron": col, "stationary": True, "adf_pvalue": adf_p,
            "f_stat": f_stat, "granger_pvalue": p_val,
            "is_causal": p_val < p_threshold,
        })

    result = pd.DataFrame(rows).set_index("neuron")
    if save_path is not None:
        result.to_csv(save_path)
    return result
