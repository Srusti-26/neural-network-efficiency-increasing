"""Sonar (Connectionist Bench: Mines vs. Rocks) dataset loading.

60 continuous sonar-return features, binary target (Mine / Rock), 208 rows.
Small, all-numeric, no categorical encoding needed -- a good complement to
the categorical Car Evaluation module and the image-based MNIST module.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import torch
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from torch.utils.data import DataLoader, TensorDataset

from .config import BATCH_SIZE, TEST_SIZE

_UCI_URL = (
    "https://archive.ics.uci.edu/ml/machine-learning-databases/"
    "undocumented/connectionist-bench/sonar/sonar.all-data"
)


def _load_from_openml():
    sonar = fetch_openml(data_id=40, parser="auto")  # OpenML id 40 == "sonar"
    X_df = sonar.data
    feature_names = [f"attr_{i}" for i in range(X_df.shape[1])]
    X = np.asarray(X_df, dtype=np.float32)
    y_raw = np.asarray(sonar.target)
    return X, y_raw, feature_names


def _load_from_uci():
    df = pd.read_csv(_UCI_URL, header=None)
    X = df.iloc[:, :-1].values.astype(np.float32)
    y_raw = df.iloc[:, -1].values
    feature_names = [f"attr_{i}" for i in range(X.shape[1])]
    return X, y_raw, feature_names


def load_sonar():
    """Fetch Sonar (OpenML, falling back to the UCI mirror) and scale features.

    Returns (X_train, X_test, y_train, y_test, feature_names, class_names).
    """
    try:
        X, y_raw, feature_names = _load_from_openml()
    except Exception:
        X, y_raw, feature_names = _load_from_uci()

    le = LabelEncoder()
    y = le.fit_transform(y_raw).astype(np.int64)
    class_names = list(le.classes_)  # ['M', 'R'] (Mine / Rock)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=42, stratify=y
    )

    # Sonar features are all continuous and on similar scales already, but
    # standardizing helps the small MLP train stably given only ~166 rows.
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train).astype(np.float32)
    X_test = scaler.transform(X_test).astype(np.float32)

    return X_train, X_test, y_train, y_test, feature_names, class_names


def get_sonar_loaders(batch_size: int = BATCH_SIZE, num_workers: int = 0):
    """Return (train_loader, test_loader, input_dim, output_dim, meta)."""
    X_train, X_test, y_train, y_test, feature_names, class_names = load_sonar()

    train_ds = TensorDataset(torch.tensor(X_train), torch.tensor(y_train))
    test_ds = TensorDataset(torch.tensor(X_test), torch.tensor(y_test))

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers)

    meta = {
        "feature_names": feature_names,
        "class_names": class_names,
        "n_train": len(train_ds),
        "n_test": len(test_ds),
    }
    return train_loader, test_loader, X_train.shape[1], len(class_names), meta
