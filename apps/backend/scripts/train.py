"""
scripts/train.py
────────────────
Trains the Random Forest model on fittrack_ai_dataset.csv
and saves it to model/calories_model.joblib.

Usage:
    python scripts/train.py
    python scripts/train.py --csv data/fittrack_ai_dataset.csv
"""

import argparse
import sys
from pathlib import Path

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import joblib

ROOT = Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv",    default=str(ROOT / "data" / "fittrack_ai_dataset.csv"))
    parser.add_argument("--output", default=str(ROOT / "model" / "calories_model.joblib"))
    args = parser.parse_args()

    csv_path = Path(args.csv)
    out_path = Path(args.output)

    if not csv_path.exists():
        print(f"\n[ERROR] CSV not found: {csv_path}")
        print("Place fittrack_ai_dataset.csv in the data/ folder.")
        sys.exit(1)

    out_path.parent.mkdir(parents=True, exist_ok=True)

    # ── Load ──────────────────────────────────────────────────────
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df):,} rows × {len(df.columns)} columns")

    # ── Drop leaky and non-trainable columns ──────────────────────
    DROP = [
        "session_date",            # timestamp string
        "muscles_trained",         # 252 unique multi-label strings
        "cumulative_load_7d_kcal", # DATA LEAKAGE — rolling sum of target
    ]
    df = df.drop(columns=DROP)
    print(f"Dropped: {DROP}")

    # ── Feature / target split ────────────────────────────────────
    TARGET = "calories_burned"
    X = df.drop(TARGET, axis=1)
    y = df[TARGET]

    # ── Encode ────────────────────────────────────────────────────
    X_enc = pd.get_dummies(X, drop_first=True)
    print(f"\nFeatures after encoding ({len(X_enc.columns)}):")
    for c in X_enc.columns:
        print(f"  {c}")

    # ── Split ─────────────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X_enc, y, test_size=0.2, random_state=42
    )
    print(f"\nTrain: {X_train.shape}  Test: {X_test.shape}")

    # ── Train ─────────────────────────────────────────────────────
    print("\nTraining Random Forest (200 trees)...")
    model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    # ── Evaluate ──────────────────────────────────────────────────
    y_pred = model.predict(X_test)
    mae  = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2   = r2_score(y_test, y_pred)
    cv   = cross_val_score(model, X_enc, y, cv=5, scoring="r2", n_jobs=-1)

    print(f"\n{'='*40}")
    print(f"  MAE      : {mae:.2f} kcal")
    print(f"  RMSE     : {rmse:.2f} kcal")
    print(f"  R²       : {r2:.4f}")
    print(f"  5-CV R²  : {cv.mean():.4f} ± {cv.std():.4f}")
    print(f"{'='*40}")

    # ── Save ──────────────────────────────────────────────────────
    joblib.dump(model, out_path)
    print(f"\nModel saved → {out_path}")
    print("Move this file to apps/backend/model/ if training outside the backend folder.")


if __name__ == "__main__":
    main()
