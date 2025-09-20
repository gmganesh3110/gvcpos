import React, { useState } from "react";
import { FaChartBar, FaDollarSign, FaCalendarAlt, FaDownload, FaPrint, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface MonthlyData {
  month: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
  peakDay: string;
  peakSales: number;
}

interface WeeklyBreakdown {
  week: string;
  sales: number;
  orders: number;
  growth: number;
}

interface CategoryPerformance {
  category: string;
  sales: number;
  percentage: number;
  growth: number;
}

const MonthlySalesReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [viewMode, setViewMode] = useState("overview");

  // Hardcoded sample data
  const monthlyData: MonthlyData = {
    month: "January 2024",
    totalSales: 85425.75,
    totalOrders: 1245,
    averageOrderValue: 68.61,
    growthRate: 12.5,
    peakDay: "January 15",
    peakSales: 2847.50
  };

  const weeklyBreakdown: WeeklyBreakdown[] = [
    { week: "Week 1 (Jan 1-7)", sales: 19850.25, orders: 285, growth: 8.2 },
    { week: "Week 2 (Jan 8-14)", sales: 21560.50, orders: 312, growth: 12.5 },
    { week: "Week 3 (Jan 15-21)", sales: 22450.75, orders: 328, growth: 15.8 },
    { week: "Week 4 (Jan 22-28)", sales: 21564.25, orders: 320, growth: 11.2 }
  ];

  const categoryPerformance: CategoryPerformance[] = [
    { category: "Main Course", sales: 34250.25, percentage: 40.1, growth: 15.2 },
    { category: "Beverages", sales: 18750.50, percentage: 21.9, growth: 8.5 },
    { category: "Appetizers", sales: 12850.75, percentage: 15.0, growth: 12.3 },
    { category: "Desserts", sales: 9850.25, percentage: 11.5, growth: 18.7 },
    { category: "Salads", sales: 9724.00, percentage: 11.4, growth: 6.8 }
  ];

  const topDays = [
    { date: "Jan 15", sales: 2847.50, orders: 45 },
    { date: "Jan 20", sales: 2750.25, orders: 42 },
    { date: "Jan 8", sales: 2650.75, orders: 38 },
    { date: "Jan 12", sales: 2580.50, orders: 40 },
    { date: "Jan 25", sales: 2520.25, orders: 36 }
  ];

  const getMaxSales = () => {
    return Math.max(...weeklyBreakdown.map(w => w.sales));
  };

  const getSalesPercentage = (sales: number) => {
    return (sales / getMaxSales()) * 100;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaChartBar className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Monthly Sales Report</h1>
          </div>
          <p className="text-gray-600">Comprehensive monthly sales analysis and performance metrics</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="overview">Overview</option>
                  <option value="weekly">Weekly Breakdown</option>
                  <option value="categories">Category Analysis</option>
                  <option value="topdays">Top Days</option>
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
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">${monthlyData.totalSales.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <FaArrowUp className="text-green-500 text-sm" />
                  <span className="text-sm text-green-600">+{monthlyData.growthRate}%</span>
                </div>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{monthlyData.totalOrders.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <FaArrowUp className="text-green-500 text-sm" />
                  <span className="text-sm text-green-600">+8.3%</span>
                </div>
              </div>
              <FaChartBar className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order</p>
                <p className="text-2xl font-bold text-purple-600">${monthlyData.averageOrderValue.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <FaArrowUp className="text-green-500 text-sm" />
                  <span className="text-sm text-green-600">+4.1%</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peak Day Sales</p>
                <p className="text-2xl font-bold text-orange-600">${monthlyData.peakSales.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">{monthlyData.peakDay}</p>
              </div>
              <FaCalendarAlt className="text-2xl text-orange-600" />
            </div>
          </div>
        </div>

        {/* Weekly Breakdown */}
        {viewMode === "weekly" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Performance</h3>
            <div className="space-y-4">
              {weeklyBreakdown.map((week, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-gray-600">{week.week}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">${week.sales.toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{week.orders} orders</span>
                        <div className="flex items-center gap-1">
                          {week.growth > 0 ? (
                            <FaArrowUp className="text-green-500 text-xs" />
                          ) : (
                            <FaArrowDown className="text-red-500 text-xs" />
                          )}
                          <span className={`text-xs ${week.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {week.growth > 0 ? '+' : ''}{week.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getSalesPercentage(week.sales)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Analysis */}
        {viewMode === "categories" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Category Performance</h3>
            <div className="space-y-4">
              {categoryPerformance.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">{category.percentage.toFixed(1)}%</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{category.category}</h4>
                      <p className="text-sm text-gray-600">${category.sales.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {category.growth > 0 ? (
                        <FaArrowUp className="text-green-500" />
                      ) : (
                        <FaArrowDown className="text-red-500" />
                      )}
                      <span className={`font-semibold ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.growth > 0 ? '+' : ''}{category.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Days */}
        {viewMode === "topdays" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Performing Days</h3>
            <div className="space-y-4">
              {topDays.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{day.date}</h4>
                      <p className="text-sm text-gray-600">{day.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${day.sales.toFixed(2)}</p>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales Trend</h3>
              <div className="space-y-3">
                {weeklyBreakdown.map((week, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{week.week}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${getSalesPercentage(week.sales)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">${week.sales.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
              <div className="space-y-3">
                {categoryPerformance.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{category.percentage.toFixed(1)}%</span>
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

export default MonthlySalesReport;
