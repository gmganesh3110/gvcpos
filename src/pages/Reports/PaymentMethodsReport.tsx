import React, { useState } from "react";
import { FaCreditCard, FaDollarSign, FaChartPie, FaDownload, FaPrint, FaArrowUp, FaArrowDown, FaMobile } from "react-icons/fa";

interface PaymentMethodData {
  method: string;
  totalAmount: number;
  transactionCount: number;
  averageTransaction: number;
  percentage: number;
  growthRate: number;
  processingFee: number;
  netAmount: number;
  icon: string;
  color: string;
}

interface TransactionTrend {
  date: string;
  cash: number;
  card: number;
  digital: number;
  total: number;
}

interface PaymentMethodStats {
  method: string;
  peakHour: string;
  peakAmount: number;
  successRate: number;
  avgProcessingTime: number;
}

const PaymentMethodsReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [viewMode, setViewMode] = useState("overview");

  // Hardcoded sample data
  const paymentMethods: PaymentMethodData[] = [
    {
      method: "Cash",
      totalAmount: 25627.73,
      transactionCount: 485,
      averageTransaction: 52.84,
      percentage: 30.0,
      growthRate: 8.5,
      processingFee: 0,
      netAmount: 25627.73,
      icon: "💵",
      color: "bg-green-500"
    },
    {
      method: "Credit Card",
      totalAmount: 34170.30,
      transactionCount: 425,
      averageTransaction: 80.40,
      percentage: 40.0,
      growthRate: 12.3,
      processingFee: 1025.11,
      netAmount: 33145.19,
      icon: "💳",
      color: "bg-blue-500"
    },
    {
      method: "Debit Card",
      totalAmount: 17085.15,
      transactionCount: 285,
      averageTransaction: 59.95,
      percentage: 20.0,
      growthRate: 15.8,
      processingFee: 341.70,
      netAmount: 16743.45,
      icon: "💳",
      color: "bg-indigo-500"
    },
    {
      method: "Digital Wallet",
      totalAmount: 8542.58,
      transactionCount: 150,
      averageTransaction: 56.95,
      percentage: 10.0,
      growthRate: 25.7,
      processingFee: 85.43,
      netAmount: 8457.15,
      icon: "📱",
      color: "bg-purple-500"
    }
  ];

  const transactionTrends: TransactionTrend[] = [
    { date: "2024-01-01", cash: 850.25, card: 1200.50, digital: 200.75, total: 2251.50 },
    { date: "2024-01-02", cash: 920.75, card: 1350.25, digital: 180.50, total: 2451.50 },
    { date: "2024-01-03", cash: 780.50, card: 1100.75, digital: 220.25, total: 2101.50 },
    { date: "2024-01-04", cash: 950.00, card: 1400.00, digital: 250.00, total: 2600.00 },
    { date: "2024-01-05", cash: 1050.25, card: 1550.50, digital: 300.75, total: 2901.50 },
    { date: "2024-01-06", cash: 1200.75, card: 1800.25, digital: 350.50, total: 3351.50 },
    { date: "2024-01-07", cash: 1100.50, card: 1650.75, digital: 320.25, total: 3071.50 },
    { date: "2024-01-08", cash: 800.25, card: 1000.50, digital: 150.75, total: 1951.50 },
    { date: "2024-01-09", cash: 850.75, card: 1150.25, digital: 180.50, total: 2181.50 },
    { date: "2024-01-10", cash: 900.00, card: 1200.00, digital: 200.00, total: 2300.00 },
    { date: "2024-01-11", cash: 950.50, card: 1250.75, digital: 220.25, total: 2421.50 },
    { date: "2024-01-12", cash: 1000.25, card: 1300.50, digital: 240.75, total: 2541.50 },
    { date: "2024-01-13", cash: 1150.75, card: 1450.25, digital: 280.50, total: 2881.50 },
    { date: "2024-01-14", cash: 1100.50, card: 1400.75, digital: 260.25, total: 2761.50 },
    { date: "2024-01-15", cash: 1050.25, card: 1350.50, digital: 250.75, total: 2651.50 }
  ];

  const paymentStats: PaymentMethodStats[] = [
    { method: "Cash", peakHour: "12:00-13:00", peakAmount: 450.25, successRate: 100.0, avgProcessingTime: 0.5 },
    { method: "Credit Card", peakHour: "19:00-20:00", peakAmount: 650.75, successRate: 98.5, avgProcessingTime: 3.2 },
    { method: "Debit Card", peakHour: "18:00-19:00", peakAmount: 425.50, successRate: 99.2, avgProcessingTime: 2.8 },
    { method: "Digital Wallet", peakHour: "20:00-21:00", peakAmount: 180.25, successRate: 97.8, avgProcessingTime: 1.5 }
  ];

  const getMaxAmount = () => {
    return Math.max(...paymentMethods.map(p => p.totalAmount));
  };

  const getAmountPercentage = (amount: number) => {
    return (amount / getMaxAmount()) * 100;
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? "text-green-600" : "text-red-600";
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Cash": return <FaDollarSign className="text-green-600" />;
      case "Credit Card": return <FaCreditCard className="text-blue-600" />;
      case "Debit Card": return <FaCreditCard className="text-indigo-600" />;
      case "Digital Wallet": return <FaMobile className="text-purple-600" />;
      default: return <FaChartPie className="text-gray-600" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaCreditCard className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Payment Methods Report</h1>
          </div>
          <p className="text-gray-600">Analyze payment method performance and transaction trends</p>
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
                  <option value="week">This Week</option>
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
                  <option value="trends">Transaction Trends</option>
                  <option value="stats">Payment Stats</option>
                  <option value="fees">Processing Fees</option>
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
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {paymentMethods.reduce((sum, method) => sum + method.transactionCount, 0).toLocaleString()}
                </p>
              </div>
              <FaChartPie className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ${paymentMethods.reduce((sum, method) => sum + method.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing Fees</p>
                <p className="text-2xl font-bold text-red-600">
                  ${paymentMethods.reduce((sum, method) => sum + method.processingFee, 0).toFixed(2)}
                </p>
              </div>
              <FaCreditCard className="text-2xl text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${paymentMethods.reduce((sum, method) => sum + method.netAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Methods Performance</h3>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getMethodIcon(method.method)}
                  <div>
                    <h4 className="font-medium text-gray-800">{method.method}</h4>
                    <p className="text-sm text-gray-600">{method.transactionCount} transactions</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700">${method.totalAmount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{method.percentage.toFixed(1)}%</span>
                      <span className="text-sm text-gray-500">${method.averageTransaction.toFixed(2)} avg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getGrowthIcon(method.growthRate)}
                      <span className={`text-sm ${getGrowthColor(method.growthRate)}`}>
                        {method.growthRate > 0 ? '+' : ''}{method.growthRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${method.color}`}
                      style={{ width: `${getAmountPercentage(method.totalAmount)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Trends */}
        {viewMode === "trends" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily Transaction Trends</h3>
            <div className="space-y-4">
              {transactionTrends.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">{day.date}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">${day.total.toFixed(2)}</span>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Cash: ${day.cash.toFixed(2)}</span>
                        <span>Card: ${day.card.toFixed(2)}</span>
                        <span>Digital: ${day.digital.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500"
                          style={{ width: `${(day.cash / day.total) * 100}%` }}
                        ></div>
                        <div
                          className="bg-blue-500"
                          style={{ width: `${(day.card / day.total) * 100}%` }}
                        ></div>
                        <div
                          className="bg-purple-500"
                          style={{ width: `${(day.digital / day.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Stats */}
        {viewMode === "stats" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Method Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paymentStats.map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {getMethodIcon(stat.method)}
                    <h4 className="font-medium text-gray-800">{stat.method}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Hour</span>
                      <span className="font-medium">{stat.peakHour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Amount</span>
                      <span className="font-medium">${stat.peakAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium text-green-600">{stat.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Time</span>
                      <span className="font-medium">{stat.avgProcessingTime}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Fees */}
        {viewMode === "fees" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Processing Fees Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Method</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Total Amount</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Processing Fee</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Fee Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Net Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethods.map((method, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{method.method}</td>
                      <td className="py-3 px-4 text-right text-gray-700">${method.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-red-600">${method.processingFee.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {method.processingFee > 0 ? ((method.processingFee / method.totalAmount) * 100).toFixed(2) : 0}%
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">${method.netAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Charts */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method Distribution</h3>
              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color.replace('bg-', '') }}></div>
                      <span className="text-sm text-gray-600">{method.method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${method.color}`}
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{method.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Rates</h3>
              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{method.method}</span>
                    <div className="flex items-center gap-2">
                      {getGrowthIcon(method.growthRate)}
                      <span className={`text-sm font-medium ${getGrowthColor(method.growthRate)}`}>
                        {method.growthRate > 0 ? '+' : ''}{method.growthRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsReport;
