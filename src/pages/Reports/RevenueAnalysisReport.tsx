import React, { useState } from "react";
import { FaDollarSign, FaChartLine, FaArrowUp, FaArrowDown, FaDownload, FaPrint, FaCalendarAlt } from "react-icons/fa";

interface RevenueData {
  period: string;
  totalRevenue: number;
  grossRevenue: number;
  netRevenue: number;
  growthRate: number;
  averageOrderValue: number;
  totalOrders: number;
}

interface RevenueSource {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
  color: string;
}

interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrder: number;
}

interface RevenueForecast {
  period: string;
  projectedRevenue: number;
  confidence: number;
  factors: string[];
}

const RevenueAnalysisReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [viewMode, setViewMode] = useState("overview");

  // Hardcoded sample data
  const revenueData: RevenueData = {
    period: "January 2024",
    totalRevenue: 85425.75,
    grossRevenue: 91250.00,
    netRevenue: 85425.75,
    growthRate: 15.2,
    averageOrderValue: 68.61,
    totalOrders: 1245
  };

  const revenueSources: RevenueSource[] = [
    { source: "Dine-in", amount: 51255.45, percentage: 60.0, growth: 18.5, color: "bg-blue-500" },
    { source: "Takeaway", amount: 25627.73, percentage: 30.0, growth: 12.3, color: "bg-green-500" },
    { source: "Delivery", amount: 8542.58, percentage: 10.0, growth: 25.7, color: "bg-purple-500" }
  ];

  const timeSeriesData: TimeSeriesData[] = [
    { date: "2024-01-01", revenue: 2850.25, orders: 42, averageOrder: 67.86 },
    { date: "2024-01-02", revenue: 3120.50, orders: 45, averageOrder: 69.34 },
    { date: "2024-01-03", revenue: 2980.75, orders: 43, averageOrder: 69.32 },
    { date: "2024-01-04", revenue: 3250.00, orders: 48, averageOrder: 67.71 },
    { date: "2024-01-05", revenue: 3450.25, orders: 52, averageOrder: 66.35 },
    { date: "2024-01-06", revenue: 3800.50, orders: 55, averageOrder: 69.10 },
    { date: "2024-01-07", revenue: 3650.75, orders: 53, averageOrder: 68.88 },
    { date: "2024-01-08", revenue: 2980.25, orders: 44, averageOrder: 67.73 },
    { date: "2024-01-09", revenue: 3120.00, orders: 46, averageOrder: 67.83 },
    { date: "2024-01-10", revenue: 3250.50, orders: 48, averageOrder: 67.72 },
    { date: "2024-01-11", revenue: 3400.75, orders: 50, averageOrder: 68.02 },
    { date: "2024-01-12", revenue: 3550.25, orders: 52, averageOrder: 68.27 },
    { date: "2024-01-13", revenue: 3750.00, orders: 54, averageOrder: 69.44 },
    { date: "2024-01-14", revenue: 3650.50, orders: 53, averageOrder: 68.88 },
    { date: "2024-01-15", revenue: 2847.50, orders: 45, averageOrder: 63.28 }
  ];

  const revenueForecast: RevenueForecast[] = [
    { 
      period: "Next Week", 
      projectedRevenue: 22500.00, 
      confidence: 85,
      factors: ["Historical trends", "Seasonal patterns", "Current growth rate"]
    },
    { 
      period: "Next Month", 
      projectedRevenue: 95000.00, 
      confidence: 78,
      factors: ["Monthly growth", "Market conditions", "Promotional activities"]
    },
    { 
      period: "Next Quarter", 
      projectedRevenue: 285000.00, 
      confidence: 72,
      factors: ["Quarterly trends", "Economic indicators", "Competition analysis"]
    }
  ];

  const getMaxRevenue = () => {
    return Math.max(...timeSeriesData.map(d => d.revenue));
  };

  const getRevenuePercentage = (revenue: number) => {
    return (revenue / getMaxRevenue()) * 100;
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaDollarSign className="text-2xl text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Revenue Analysis</h1>
          </div>
          <p className="text-gray-600">Comprehensive revenue analysis and forecasting insights</p>
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
                  <option value="sources">Revenue Sources</option>
                  <option value="trends">Trends</option>
                  <option value="forecast">Forecast</option>
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
                <p className="text-2xl font-bold text-green-600">${revenueData.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(revenueData.growthRate)}
                  <span className={`text-sm ${getGrowthColor(revenueData.growthRate)}`}>
                    +{revenueData.growthRate}%
                  </span>
                </div>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gross Revenue</p>
                <p className="text-2xl font-bold text-blue-600">${revenueData.grossRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Before deductions</p>
              </div>
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order</p>
                <p className="text-2xl font-bold text-purple-600">${revenueData.averageOrderValue.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">{revenueData.totalOrders} orders</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Revenue</p>
                <p className="text-2xl font-bold text-green-600">${revenueData.netRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">After deductions</p>
              </div>
              <FaCalendarAlt className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Revenue Sources */}
        {viewMode === "sources" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue Sources</h3>
            <div className="space-y-4">
              {revenueSources.map((source, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color.replace('bg-', '') }}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{source.source}</h4>
                        <p className="text-sm text-gray-600">{source.percentage.toFixed(1)}% of total revenue</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${source.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          {getGrowthIcon(source.growth)}
                          <span className={`text-sm ${getGrowthColor(source.growth)}`}>
                            {source.growth > 0 ? '+' : ''}{source.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${source.color}`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Trends */}
        {viewMode === "trends" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily Revenue Trends</h3>
            <div className="space-y-4">
              {timeSeriesData.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">{day.date}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">${day.revenue.toFixed(2)}</span>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{day.orders} orders</span>
                        <span>${day.averageOrder.toFixed(2)} avg</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getRevenuePercentage(day.revenue)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Forecast */}
        {viewMode === "forecast" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {revenueForecast.map((forecast, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">{forecast.period}</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{forecast.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    ${forecast.projectedRevenue.toLocaleString()}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Key Factors:</p>
                    {forecast.factors.map((factor, factorIndex) => (
                      <div key={factorIndex} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Charts */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Sources Distribution</h3>
              <div className="space-y-3">
                {revenueSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color.replace('bg-', '') }}></div>
                      <span className="text-sm text-gray-600">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${source.color}`}
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{source.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Performance</h3>
              <div className="space-y-3">
                {timeSeriesData.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day.date}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${getRevenuePercentage(day.revenue)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">${day.revenue.toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Metrics Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Metric</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Current Period</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Previous Period</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-800">Total Revenue</td>
                  <td className="py-3 px-4 text-right text-gray-700">${revenueData.totalRevenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gray-700">$74,125.50</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getGrowthIcon(revenueData.growthRate)}
                      <span className={getGrowthColor(revenueData.growthRate)}>
                        +{revenueData.growthRate}%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-800">Average Order Value</td>
                  <td className="py-3 px-4 text-right text-gray-700">${revenueData.averageOrderValue.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-gray-700">$65.89</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <FaArrowUp className="text-green-500" />
                      <span className="text-green-600">+4.1%</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-800">Total Orders</td>
                  <td className="py-3 px-4 text-right text-gray-700">{revenueData.totalOrders.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gray-700">1,125</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <FaArrowUp className="text-green-500" />
                      <span className="text-green-600">+10.7%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalysisReport;
