import React, { useState } from "react";
import { FaCalendarDay, FaDollarSign, FaChartLine, FaDownload, FaPrint, FaEye } from "react-icons/fa";

interface DailySalesData {
  date: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  cashSales: number;
  cardSales: number;
  digitalSales: number;
  taxCollected: number;
  discountsGiven: number;
  refunds: number;
  netSales: number;
}

interface HourlyData {
  hour: string;
  sales: number;
  orders: number;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

const DailySalesReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  const [viewMode, setViewMode] = useState("summary");

  // Hardcoded sample data
  const dailyData: DailySalesData = {
    date: "2024-01-15",
    totalSales: 2847.50,
    totalOrders: 45,
    averageOrderValue: 63.28,
    cashSales: 1250.75,
    cardSales: 1200.00,
    digitalSales: 396.75,
    taxCollected: 284.75,
    discountsGiven: 150.25,
    refunds: 45.00,
    netSales: 2652.25
  };

  const hourlyData: HourlyData[] = [
    { hour: "08:00", sales: 0, orders: 0 },
    { hour: "09:00", sales: 125.50, orders: 3 },
    { hour: "10:00", sales: 89.75, orders: 2 },
    { hour: "11:00", sales: 156.25, orders: 4 },
    { hour: "12:00", sales: 425.80, orders: 8 },
    { hour: "13:00", sales: 380.50, orders: 7 },
    { hour: "14:00", sales: 298.75, orders: 5 },
    { hour: "15:00", sales: 145.25, orders: 3 },
    { hour: "16:00", sales: 89.50, orders: 2 },
    { hour: "17:00", sales: 156.80, orders: 3 },
    { hour: "18:00", sales: 425.25, orders: 6 },
    { hour: "19:00", sales: 380.75, orders: 5 },
    { hour: "20:00", sales: 298.50, orders: 4 },
    { hour: "21:00", sales: 145.00, orders: 2 },
    { hour: "22:00", sales: 89.25, orders: 1 }
  ];

  const topItems: TopItem[] = [
    { name: "Grilled Chicken Breast", quantity: 12, revenue: 180.00, category: "Main Course" },
    { name: "Caesar Salad", quantity: 15, revenue: 150.00, category: "Salad" },
    { name: "Margherita Pizza", quantity: 8, revenue: 120.00, category: "Pizza" },
    { name: "Fish and Chips", quantity: 10, revenue: 140.00, category: "Main Course" },
    { name: "Chicken Burger", quantity: 6, revenue: 72.00, category: "Burger" }
  ];

  const getMaxSales = () => {
    return Math.max(...hourlyData.map(h => h.sales));
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
            <FaCalendarDay className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Daily Sales Report</h1>
          </div>
          <p className="text-gray-600">View detailed sales performance and analytics for each day</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
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
                  <option value="summary">Summary</option>
                  <option value="hourly">Hourly Breakdown</option>
                  <option value="items">Top Items</option>
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
                <p className="text-2xl font-bold text-green-600">${dailyData.totalSales.toFixed(2)}</p>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{dailyData.totalOrders}</p>
              </div>
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order</p>
                <p className="text-2xl font-bold text-purple-600">${dailyData.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Sales</p>
                <p className="text-2xl font-bold text-green-600">${dailyData.netSales.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-700">Cash</span>
                </div>
                <span className="font-semibold">${dailyData.cashSales.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-700">Card</span>
                </div>
                <span className="font-semibold">${dailyData.cardSales.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-gray-700">Digital</span>
                </div>
                <span className="font-semibold">${dailyData.digitalSales.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Tax Collected</span>
                <span className="font-semibold text-green-600">${dailyData.taxCollected.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Discounts Given</span>
                <span className="font-semibold text-red-600">-${dailyData.discountsGiven.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Refunds</span>
                <span className="font-semibold text-red-600">-${dailyData.refunds.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Net Sales</span>
                  <span className="font-bold text-green-600">${dailyData.netSales.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Sales Chart */}
        {viewMode === "hourly" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Hourly Sales Performance</h3>
            <div className="space-y-4">
              {hourlyData.map((hour) => (
                <div key={hour.hour} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600">{hour.hour}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">${hour.sales.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">{hour.orders} orders</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getSalesPercentage(hour.sales)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Items */}
        {viewMode === "items" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Selling Items</h3>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">Qty: {item.quantity}</p>
                    <p className="text-green-600 font-semibold">${item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySalesReport;
