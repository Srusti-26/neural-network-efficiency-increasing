"""MLP with structural (physically shrinking) pruning support."""

from __future__ import annotations

from typing import Optional

import torch
import torch.nn as nn


class MLP(nn.Module):
    def __init__(self, input_dim: int, hidden_dims: list[int], output_dim: int) -> None:
        super().__init__()
        self.input_dim = input_dim
        self.hidden_dims = hidden_dims
        self.output_dim = output_dim

        dims = [input_dim] + hidden_dims + [output_dim]
        layers: list[nn.Module] = []
        for i in range(len(dims) - 1):
            layers.append(nn.Linear(dims[i], dims[i + 1]))
            if i < len(dims) - 2:
                layers.append(nn.ReLU())
        self.net = nn.Sequential(*layers)

        self._hidden_layers = [m for m in self.net if isinstance(m, nn.Linear)][:-1]

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x.view(x.size(0), -1))

    def count_parameters(self) -> int:
        return sum(p.numel() for p in self.parameters() if p.requires_grad)

    @classmethod
    def from_dims(cls, input_dim: int, hidden_dims: list[int], output_dim: int) -> "MLP":
        return cls(input_dim=input_dim, hidden_dims=hidden_dims, output_dim=output_dim)

    def copy_weights_from(self, source: "MLP", keep_indices: list[Optional[list[int]]]) -> None:
        """Copy surviving-neuron weights from a larger source model."""
        src_linears = [m for m in source.net if isinstance(m, nn.Linear)]
        dst_linears = [m for m in self.net if isinstance(m, nn.Linear)]
        assert len(keep_indices) == len(src_linears) - 1

        with torch.no_grad():
            for i in range(len(src_linears)):
                src, dst = src_linears[i], dst_linears[i]
                out_idx = keep_indices[i] if i < len(keep_indices) else None
                in_idx = keep_indices[i - 1] if i > 0 else None

                W, b = src.weight.data, src.bias.data
                if out_idx is not None:
                    W, b = W[out_idx, :], b[out_idx]
                if in_idx is not None:
                    W = W[:, in_idx]
                dst.weight.data.copy_(W)
                dst.bias.data.copy_(b)
