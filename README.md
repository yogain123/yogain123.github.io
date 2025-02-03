# 🇮🇳 India Tax Regime Calculator

A React-based web application that helps compare tax liabilities under India's New vs Old tax regimes with detailed breakdowns.

## Features

- 🆕 New Regime Calculator (2023 tax slabs)
- 🏛️ Old Regime Calculator (pre-2023 tax slabs)
- 📊 Side-by-side comparison of tax liabilities
- 💰 In-hand salary calculations
- 📈 Detailed breakdown of deductions and exemptions
- 🔄 Automatic PF contribution synchronization
- 📱 Responsive Material-UI design

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/india-tax-calculator.git
cd india-tax-calculator
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

## Usage

1. Choose between New/Old regime using the navigation bar
2. Enter your annual salary details
3. Provide PF contributions (employer + employee)
4. Add applicable deductions:
   - New Regime: Standard deduction (₹75k auto-applied)
   - Old Regime: HRA, Section 80C/D/EE, home loan interest, etc.
5. Click "Calculate" to see detailed breakdown:
   - Tax liability
   - Effective tax rate
   - Monthly/Annual in-hand salary
   - Total deductions
