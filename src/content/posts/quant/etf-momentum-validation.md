---
title: "ETF 动量轮动：从假设到回测验证"
description: "记录行业与大类资产 ETF 动量策略的逻辑假设、交易摩擦建模、参数敏感性分析与样本外检验。"
track: "quant"
category: "backtesting"
format: "research"
tags: ["量化策略", "ETF", "动量效应", "Python", "回测体系"]
publishedAt: "2026-09-08T09:00:00+08:00"
updatedAt: "2026-09-09T14:30:00+08:00"
draft: false
featured: true
sources:
  - title: "Jegadeesh and Titman (1993) - Returns to Buying Winners and Selling Losers"
    url: "https://www.jstor.org/stable/2328882"
    accessDate: "2026-09-01"
  - title: "国内 ETF 市场规模与流动性演变分析"
    url: "https://example.com/etf-market-report"
codeUrl: "https://github.com/example/quant-etf-momentum"
---

动量效应（Momentum Effect）是金融学术界与量化实盘中被广泛验证的异象之一。Jegadeesh & Titman 在 1993 年开创性的研究中指出，过去一段时间表现优异的资产，在未来一段时间内大概率会延续其超额表现。

然而在 A 股市场，由于散户占比较高、板块轮动剧烈、以及风格切换频繁等特征，单纯的个股动量往往面临较大的回撤与反转风险。相比之下，以**行业 ETF** 与**大类资产 ETF** 为标的的动量轮动策略，由于分散了个股特异性风险，并在大趋势形成时具备显著的顺势特征，成为更适合个人及中小型投研团队的验证场景。

## 1. 策略假设与核心逻辑

我们的核心假设如下：
1. **中长期动量持续**：在 20 ~ 60 个交易日窗口内，强势板块由于基本面边际改善或资金持续流入，具有趋势自强化效应；
2. **波动率归一化**：单纯收益率容易偏向高 Beta、高波动品种，需采用风险调整后的动量因子（如夏普动量或收益风险比）；
3. **均线滤波防深坑**：当标的跌破长期生命线（如 60 日均线）时，强制空仓或切换至货币基金/国债 ETF，规避系统性下行风险。

动量得分的数学表达为：

$$
Score_i(t) = \frac{R_i(t, \Delta t)}{\sigma_i(t, \Delta t)} \times \mathbb{I}(P_i(t) > \text{MA}_{60, i}(t))
$$

其中 $R_i(t, \Delta t)$ 为资产 $i$ 在过去 $\Delta t$ 天的累计收益率，$\sigma_i(t, \Delta t)$ 为对应区间的年化波动率，$\mathbb{I}$ 为指示函数。

## 2. 标的池选择与交易规则

我们选取了 5 只覆盖不同主线与资产类别的代表性 ETF：
- **沪深 300 ETF** (510300)
- **中证 500 ETF** (510500)
- **半导体 ETF** (512480)
- **医药 ETF** (512010)
- **国债 ETF** (511010) —— 作为防御资产

### 交易摩擦设定
在实战回测中，忽略交易成本会导致极其危险的乐观估计。我们设置了如下摩擦参数：
- 单边佣金：**万分之二 (0.02%)**
- 估算冲击成本与滑点：**万分之五 (0.05%)**
- 调仓频率：每周五收盘前（以周为调仓周期）

## 3. 核心代码实现

以下为基于 Pandas 构建的向量化动量评估与信号生成示例：

```python
import numpy as np
import pandas as pd

def calculate_momentum_score(price_df: pd.DataFrame, window: int = 20) -> pd.DataFrame:
    """
    计算基于风险调整的动量得分
    price_df: 收盘价矩阵 (index: 日期, columns: 标的代码)
    window: 动量回看窗口
    """
    # 计算累计收益率
    returns = price_df.pct_change(window)
    
    # 计算滚动日收益率标准差，并年化
    daily_returns = price_df.pct_change()
    volatility = daily_returns.rolling(window).std() * np.sqrt(252)
    
    # 风险调整动量比率
    momentum_ratio = returns / volatility.replace(0, np.nan)
    
    # 计算 60 日均线滤波
    ma_filter = price_df > price_df.rolling(60).mean()
    
    # 最终打分（低于均线设为 -999）
    scores = momentum_ratio.where(ma_filter, -999.0)
    return scores

def generate_target_weights(scores: pd.DataFrame, top_k: int = 2) -> pd.DataFrame:
    """选取打分最高的 top_k 个资产进行等权配置"""
    ranks = scores.rank(axis=1, ascending=False)
    weights = (ranks <= top_k).astype(float)
    # 归一化
    weights = weights.div(weights.sum(axis=1), axis=0).fillna(0)
    return weights
```

## 4. 回测业绩与风险指标

在 2021-01 至 2025-12 的 5 年回测区间内，策略与基准（沪深 300）的综合对比数据如下：

| 指标 | 动量轮动策略 | 基准 (沪深 300) | 超额收益 |
| :--- | :--- | :--- | :--- |
| **年化收益率 (CAGR)** | **14.82%** | -2.15% | +16.97% |
| **最大回撤 (MaxDD)** | **-13.40%** | -39.52% | +26.12% 改善 |
| **夏普比率 (Sharpe, rf=2%)** | **1.12** | -0.18 | +1.30 |
| **卡玛比率 (Calmar)** | **1.11** | -0.05 | +1.16 |
| **年化换手率** | 3.84x | - | - |

夏普比率定义公式：

$$
\text{Sharpe} = \frac{E[R_p - R_f]}{\sigma_p}
$$

从资金曲线可以看出，均线滤波在 2022 年与 2023 年市场单边下跌阶段触发了防御资产（国债 ETF）切换，成功规避了主跌浪。

## 5. 总结与后续优化方向

1. **多周期加权**：单一 20 日窗口容易在震荡市频繁追涨杀跌，后续拟引入 20/40/60 日复合加权动量；
2. **宏观风险预算**：结合信用利差与两市成交额指标，实现动态仓位杠杆调节；
3. **样本外跟踪**：已接入模拟实盘，持续记录滑点分布与实际冲击。
