# The HW-Frontier

**The HW-Frontier** is a full-stack quantitative finance application. It leverages **Modern Portfolio Theory (MPT)** and **Convex Optimization** to solve for the efficient frontier, helping users allocate capital across volatile assets based on historical risk-adjusted returns.

---

## The Mathematical Model

As math-focused developers, we moved away from simple heuristics and implemented a rigorous **Mean-Variance Optimization** engine.

### 1. Data Processing & Statistical Grounding
To maintain statistical integrity, we transform raw price data into **Log Returns**. This ensures time-additivity and better handles the compounding nature of financial assets:
$$r_t = \ln\left(\frac{P_t}{P_{t-1}}\right)$$

We then calculate the **Annualized Expected Return Vector** ($\mu$) and the **Annualized Covariance Matrix** ($\Sigma$) assuming $N=252$ trading days:
$$\mu_{ann} = E[r] \times 252$$
$$\Sigma_{ann} = \text{Cov}(r) \times 252$$

### 2. Quadratic Programming (QP)
The engine solves a Convex Optimization problem using the **CVXPY** library. Given a risk-aversion parameter $\gamma$ (mapped from the UI slider), we maximize the risk-adjusted return:

$$
\begin{aligned}
\text{maximize} \quad & w^T \mu - \gamma (w^T \Sigma w) \\
\text{subject to} \quad & \sum_{i=1}^{n} w_i = 1 \\
& w_i \ge 0.05 \\
& w_i \le 0.45
\end{aligned}
$$



### 3. Numerical Stability
To ensure the solver always finds a global minimum, we implemented **Tychonov Regularization**. By adding a small $\epsilon$ ($10^{-6}$) to the diagonal of $\Sigma$, we ensure the matrix is strictly positive definite:
$$\Sigma_{stable} = \Sigma + \epsilon I$$

---

## Tech Stack

### Frontend (Client)
* **React (Vite + TypeScript):** For a type-safe, high-performance user interface.
* **Tailwind CSS:** Modern, responsive design with a financial "Glassmorphism" aesthetic.
* **Recharts:** Dynamic SVG-based Donut charts for asset weight visualization.
* **Axios:** Asynchronous API communication with the Python backend.

### Backend (Server)
* **FastAPI:** High-speed ASGI web framework for serving the optimization logic.
* **CVXPY:** A specialized library for formulating and solving convex optimization problems.
* **Pandas & NumPy:** For heavy-duty data manipulation and linear algebra operations.
* **Uvicorn:** Lightning-fast ASGI server implementation.

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Arya125-droid/Fin_opt.git
cd Fin_opt
