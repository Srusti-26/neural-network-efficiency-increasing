"""Training, evaluation, activation logging, inference timing."""

from __future__ import annotations

import time
from pathlib import Path
from typing import Optional

import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

from .config import LEARNING_RATE


def train_epoch(model, loader, optimizer, criterion, device):
    model.train()
    total_loss, correct, total = 0.0, 0, 0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        logits = model(x)
        loss = criterion(logits, y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * x.size(0)
        correct += logits.argmax(1).eq(y).sum().item()
        total += x.size(0)
    return total_loss / total, correct / total


def evaluate(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0
    with torch.no_grad():
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            logits = model(x)
            loss = criterion(logits, y)
            total_loss += loss.item() * x.size(0)
            correct += logits.argmax(1).eq(y).sum().item()
            total += x.size(0)
    return total_loss / total, correct / total


def train(model, train_loader, test_loader, epochs, device, lr=LEARNING_RATE, verbose=False):
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss()
    history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}

    for epoch in range(1, epochs + 1):
        tr_loss, tr_acc = train_epoch(model, train_loader, optimizer, criterion, device)
        va_loss, va_acc = evaluate(model, test_loader, criterion, device)
        history["train_loss"].append(tr_loss)
        history["train_acc"].append(tr_acc)
        history["val_loss"].append(va_loss)
        history["val_acc"].append(va_acc)
        if verbose and (epoch % 5 == 0 or epoch == epochs):
            print(f"  epoch {epoch:3d}/{epochs}  train_acc={tr_acc:.4f}  val_acc={va_acc:.4f}")

    return history


class ActivationLogger:
    """Logs per-step hidden activations AND the true-class output logit,
    which is what causality.py needs to test neuron -> output influence
    (rather than neuron -> neuron, which the source repo measured)."""

    def __init__(self):
        self._hooks = []
        self._activations: dict[str, list[float]] = {}

    def register_hooks(self, model: nn.Module) -> None:
        linears = [m for m in model.net if isinstance(m, nn.Linear)]
        for idx, layer in enumerate(linears[:-1]):
            name = f"hidden_{idx}"
            h = layer.register_forward_hook(self._make_hook(name))
            self._hooks.append(h)

    def _make_hook(self, name: str):
        def hook(module, inp, out):
            self._activations[name] = out.detach().mean(0).cpu().tolist()
        return hook

    def remove(self):
        for h in self._hooks:
            h.remove()


def log_activations(model, loader, device, max_steps, csv_path: Path) -> pd.DataFrame:
    """Run a pass over `loader`, log mean hidden activations per step plus
    the mean predicted-probability of the true class (the "output" series
    used for neuron -> output Granger causality)."""
    model.eval()
    logger = ActivationLogger()
    logger.register_hooks(model)

    rows = []
    softmax = nn.Softmax(dim=1)
    with torch.no_grad():
        for step, (x, y) in enumerate(loader):
            if step >= max_steps:
                break
            x, y = x.to(device), y.to(device)
            logits = model(x)
            probs = softmax(logits)
            true_class_prob = probs.gather(1, y.unsqueeze(1)).mean().item()

            row = {"step": step, "output_true_class_prob": true_class_prob}
            for name, acts in logger._activations.items():
                for i, v in enumerate(acts):
                    row[f"{name}_n{i}"] = v
            rows.append(row)

    logger.remove()
    df = pd.DataFrame(rows)
    df.to_csv(csv_path, index=False)
    return df


def measure_inference_time(model, loader, device, n_runs: int = 50) -> float:
    model.eval()
    batch = next(iter(loader))[0][:64].to(device)
    with torch.no_grad():
        for _ in range(5):
            model(batch)
    times = []
    with torch.no_grad():
        for _ in range(n_runs):
            t0 = time.perf_counter()
            model(batch)
            times.append((time.perf_counter() - t0) * 1000)
    return float(torch.tensor(times).mean().item())
