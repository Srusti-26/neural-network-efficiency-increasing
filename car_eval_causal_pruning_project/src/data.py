"""Car Evaluation dataset loading."""

from __future__ import annotations

import numpy as np
import pandas as pd
import torch
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import DataLoader, TensorDataset

from .config import BATCH_SIZE, TEST_SIZE


def load_car_evaluation():
    """Fetch Car Evaluation from OpenML and one-hot encode features.

    Returns (X_train, X_test, y_train, y_test, feature_names, class_names).
    """
    car = fetch_openml(name="car", version=3, parser="auto")
    X_df = pd.get_dummies(car.data)
    feature_names = list(X_df.columns)

    X = X_df.values.astype(np.float32)
    le = LabelEncoder()
    y = le.fit_transform(car.target).astype(np.int64)
    class_names = list(le.classes_)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=42, stratify=y
    )
    return X_train, X_test, y_train, y_test, feature_names, class_names


def get_car_loaders(batch_size: int = BATCH_SIZE, num_workers: int = 0):
    """Return (train_loader, test_loader, input_dim, output_dim, meta)."""
    X_train, X_test, y_train, y_test, feature_names, class_names = load_car_evaluation()

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
