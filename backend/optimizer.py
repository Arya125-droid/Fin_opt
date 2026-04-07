import numpy as np
import pandas as pd

# Using LOCAL CSV DATA instead of API
TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN"]


def fetch_csv_data(symbol):
    try:
        df = pd.read_csv(f"data/{symbol}.csv")
        df = df.sort_values("date")
        return df["close"]
    except:
        print(f"❌ Failed to load CSV: {symbol}")
        return None


def get_market_data():
    prices = []
    valid_tickers = []

    for ticker in TICKERS:
        series = fetch_csv_data(ticker)

        if series is None:
            continue

        prices.append(series.reset_index(drop=True))
        valid_tickers.append(ticker)

    # fallback if data missing
    if len(prices) < 2:
        return np.array([0.12, 0.10]), np.diag([0.2, 0.15]), ["AAPL", "MSFT"]

    df = pd.concat(prices, axis=1)
    df.columns = valid_tickers

    returns = df.pct_change().dropna()

    if returns.empty:
        return np.array([0.12, 0.10]), np.diag([0.2, 0.15]), valid_tickers

    mean_returns = returns.mean().values
    cov_matrix = returns.cov().values

    cov_matrix = np.where(cov_matrix == 0, 1e-6, cov_matrix)

    return mean_returns, cov_matrix, valid_tickers


def optimize_portfolio(data):
    income = data.income
    risk = data.risk

    mean_returns, cov_matrix, tickers = get_market_data()

    # Extract risk (variance)
    risk_levels = np.diag(cov_matrix)
    risk_levels = np.where(risk_levels == 0, 1e-6, risk_levels)

    # Normalize risk levels (0 → low risk, 1 → high risk)
    risk_norm = risk_levels / np.max(risk_levels)

    # Combine return + risk preference
    # Low risk user => prefer low volatility
    # High risk user => prefer high volatility
    weights = (1 - risk) * (1 - risk_norm) + risk * risk_norm

    # also consider returns
    weights = weights * mean_returns

    # normalize
    if np.sum(weights) == 0:
        weights = np.ones_like(weights)

    weights = weights / np.sum(weights)
    weights = np.nan_to_num(weights, nan=0.5)

    expected_return = float(np.dot(weights, mean_returns))

    allocation = {}
    for i in range(len(weights)):
        allocation[tickers[i]] = {
            "percentage": float(weights[i]),
            "amount": float(weights[i] * income)
        }

    return {
        "income": income,
        "risk": risk,
        "allocation": allocation,
        "expected_return": expected_return
    }
