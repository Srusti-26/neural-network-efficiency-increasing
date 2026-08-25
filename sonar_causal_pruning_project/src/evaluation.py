"""Evaluation: accuracy, F1, size, inference time."""

from __future__ import annotations

import os
import tempfile

import torch
import torch.nn as nn
from sklearn.metrics import f1_score

from .trainer import evaluate, measure_inference_time


def get_model_size_kb(model: nn.Module) -> float:
    with tempfile.NamedTemporaryFile(suffix=".pt", delete=False) as f:
        path = f.name
    torch.save(model.state_dict(), path)
    size_kb = os.path.getsize(path) / 1024
    os.unlink(path)
    return size_kb


def evaluate_full(model, test_loader, device, label, method, seed, prune_pct, train_loss=0.0) -> dict:
    criterion = nn.CrossEntropyLoss()
    test_loss, acc = evaluate(model, test_loader, criterion, device)

    model.eval()
    preds, labels = [], []
    with torch.no_grad():
        for x, y in test_loader:
            x, y = x.to(device), y.to(device)
            logits = model(x)
            preds.extend(logits.argmax(1).cpu().numpy())
            labels.extend(y.cpu().numpy())
    f1 = f1_score(labels, preds, average="macro")

    return {
        "label": label,
        "method": method,
        "seed": seed,
        "prune_pct": prune_pct,
        "train_loss": round(train_loss, 4),
        "test_loss": round(test_loss, 4),
        "accuracy": round(acc, 4),
        "f1_score": round(f1, 4),
        "n_params": sum(p.numel() for p in model.parameters() if p.requires_grad),
        "model_size_kb": round(get_model_size_kb(model), 2),
        "inference_ms": round(measure_inference_time(model, test_loader, device), 3),
    }
