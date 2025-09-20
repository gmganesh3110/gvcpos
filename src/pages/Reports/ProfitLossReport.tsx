import React, { useState } from "react";
import { FaFileInvoiceDollar, FaDollarSign, FaChartLine, FaDownload, FaPrint, FaArrowUp, FaArrowDown, FaCalculator } from "react-icons/fa";

interface ProfitLossData {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  operatingMargin: number;
}

interface RevenueItem {
  category: string;
  amount: number;
  percentage: number;
  growth: number;
}

interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
  budget: number;
  variance: number;
}

interface MonthlyComparison {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
}

const ProfitLossReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [viewMode, setViewMode] = useState("overview");

  // Hardcoded sample data
  const profitLossData: ProfitLossData = {
    period: "January 2024",
    totalRevenue: 85425.75,
    totalExpenses: 51255.45,
    grossProfit: 34170.30,
    netProfit: 25627.73,
    profitMargin: 30.0,
    operatingMargin: 25.0
  };

  const revenueItems: RevenueItem[] = [
    { category: "Food Sales", amount: 68250.60, percentage: 79.9, growth: 15.2 },
    { category: "Beverage Sales", amount: 12850.75, percentage: 15.0, growth: 12.8 },
    { category: "Dessert Sales", amount: 4324.40, percentage: 5.1, growth: 18.5 }
  ];

  const expenseItems: ExpenseItem[] = [
    { category: "Food Costs", amount: 25627.73, percentage: 50.0, budget: 24000.00, variance: -1627.73 },
    { category: "Labor Costs", amount: 15376.64, percentage: 30.0, budget: 15000.00, variance: -376.64 },
    { category: "Rent & Utilities", amount: 5125.55, percentage: 10.0, budget: 5000.00, variance: -125.55 },
    { category: "Marketing", amount: 2562.77, percentage: 5.0, budget: 3000.00, variance: 437.23 },
    { category: "Other Expenses", amount: 2562.76, percentage: 5.0, budget: 2500.00, variance: -62.76 }
  ];

  const monthlyComparison: MonthlyComparison[] = [
    { month: "Oct 2023", revenue: 78250.00, expenses: 46950.00, profit: 31300.00, margin: 40.0 },
    { month: "Nov 2023", revenue: 81500.00, expenses: 48900.00, profit: 32600.00, margin: 40.0 },
    { month: "Dec 2023", revenue: 89500.00, expenses: 53700.00, profit: 35800.00, margin: 40.0 },
    { month: "Jan 2024", revenue: 85425.75, expenses: 51255.45, profit: 34170.30, margin: 40.0 }
  ];

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? "text-green-600" : "text-red-600";
  };

  const getVarianceColor = (variance: number) => {
    return variance < 0 ? "text-red-600" : "text-green-600";
  };

  const getVarianceIcon = (variance: number) => {
    return variance < 0 ? <FaArrowDown className="text-red-500" /> : <FaArrowUp className="text-green-500" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaFileInvoiceDollar className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Profit & Loss Report</h1>
          </div>
          <p className="text-gray-600">Comprehensive financial performance analysis</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="overview">Overview</option>
                  <option value="revenue">Revenue Breakdown</option>
                  <option value="expenses">Expense Analysis</option>
                  <option value="comparison">Monthly Comparison</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <FaDownload />
                Export
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <FaPrint />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${profitLossData.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <FaArrowUp className="text-green-500 text-sm" />
                  <span className="text-sm text-green-600">+15.2%</span>
                </div>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${profitLossData.totalExpenses.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <FaArrowUp className="text-red-500 text-sm" />
                  <span className="text-sm text-red-600">+8.5%</span>
                </div>
              </div>
              <FaCalculator className="text-2xl text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600">${profitLossData.netProfit.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <FaArrowUp className="text-green-500 text-sm" />
                  <span className="text-sm text-green-600">+22.1%</span>
                </div>
              </div>
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-600">{profitLossData.profitMargin.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">Operating: {profitLossData.operatingMargin.toFixed(1)}%</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        {viewMode === "revenue" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue Breakdown</h3>
            <div className="space-y-4">
              {revenueItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 text-sm text-gray-600 font-medium">{item.category}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">${item.amount.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getGrowthIcon(item.growth)}
                        <span className={`text-sm ${getGrowthColor(item.growth)}`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Analysis */}
        {viewMode === "expenses" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Expense Analysis</h3>
            <div className="space-y-4">
              {expenseItems.map((expense, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24 text-sm text-gray-600 font-medium">{expense.category}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">${expense.amount.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{expense.percentage.toFixed(1)}%</span>
                        <span className="text-sm text-gray-500">Budget: ${expense.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVarianceIcon(expense.variance)}
                        <span className={`text-sm ${getVarianceColor(expense.variance)}`}>
                          {expense.variance > 0 ? '+' : ''}${expense.variance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Comparison */}
        {viewMode === "comparison" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Month</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Expenses</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Profit</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyComparison.map((month, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{month.month}</td>
                      <td className="py-3 px-4 text-right text-green-600">${month.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-red-600">${month.expenses.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-blue-600">${month.profit.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{month.margin.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Charts */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Distribution</h3>
              <div className="space-y-3">
                {revenueItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Distribution</h3>
              <div className="space-y-3">
                {expenseItems.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{expense.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${expense.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{expense.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Gross Profit</p>
                  <p className="text-xl font-bold text-green-600">${profitLossData.grossProfit.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Margin</p>
                  <p className="text-lg font-semibold text-green-600">
                    {((profitLossData.grossProfit / profitLossData.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Operating Profit</p>
                  <p className="text-xl font-bold text-blue-600">${profitLossData.netProfit.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Margin</p>
                  <p className="text-lg font-semibold text-blue-600">{profitLossData.operatingMargin.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Key Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue Growth</span>
                    <span className="text-green-600 font-semibold">+15.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expense Growth</span>
                    <span className="text-red-600 font-semibold">+8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit Growth</span>
                    <span className="text-green-600 font-semibold">+22.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Ratio</span>
                    <span className="text-gray-700 font-semibold">
                      {((profitLossData.totalExpenses / profitLossData.totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;
