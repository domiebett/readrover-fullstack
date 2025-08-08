#!/bin/sh
# Run all backend tests and flake8 checks
set -e

echo "Running pytest..."
pytest

echo "Running flake8..."
flake8

echo "All tests and flake8 checks passed."
