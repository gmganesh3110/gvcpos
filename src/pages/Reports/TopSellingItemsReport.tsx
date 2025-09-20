import React, { useState } from "react";
import { FaStar, FaDollarSign, FaChartLine, FaDownload, FaPrint, FaArrowUp, FaArrowDown, FaEye } from "react-icons/fa";

interface TopItem {
  rank: number;
  name: string;
  category: string;
  totalSales: number;
  quantitySold: number;
  averagePrice: number;
  revenue: number;
  growthRate: number;
  profitMargin: number;
  lastSold: string;
}

interface ItemPerformance {
  period: string;
  sales: number;
  quantity: number;
  growth: number;
}

interface CategoryRanking {
  category: string;
  topItem: string;
  totalSales: number;
  itemsCount: number;
}

const TopSellingItemsReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [sortBy, setSortBy] = useState("revenue");
  const [viewMode, setViewMode] = useState("all");

  // Hardcoded sample data
  const topItems: TopItem[] = [
    {
      rank: 1,
      name: "Grilled Chicken Breast",
      category: "Main Course",
      totalSales: 2850.00,
      quantitySold: 190,
      averagePrice: 15.00,
      revenue: 2850.00,
      growthRate: 18.5,
      profitMargin: 65.2,
      lastSold: "2024-01-15"
    },
    {
      rank: 2,
      name: "Caesar Salad",
      category: "Salad",
      totalSales: 2250.00,
      quantitySold: 150,
      averagePrice: 15.00,
      revenue: 2250.00,
      growthRate: 12.3,
      profitMargin: 58.7,
      lastSold: "2024-01-15"
    },
    {
      rank: 3,
      name: "Fish and Chips",
      category: "Main Course",
      totalSales: 1950.00,
      quantitySold: 130,
      averagePrice: 15.00,
      revenue: 1950.00,
      growthRate: 15.8,
      profitMargin: 62.1,
      lastSold: "2024-01-15"
    },
    {
      rank: 4,
      name: "Chicken Wings",
      category: "Appetizer",
      totalSales: 1850.00,
      quantitySold: 185,
      averagePrice: 10.00,
      revenue: 1850.00,
      growthRate: 22.1,
      profitMargin: 55.3,
      lastSold: "2024-01-15"
    },
    {
      rank: 5,
      name: "Margherita Pizza",
      category: "Pizza",
      totalSales: 1750.00,
      quantitySold: 70,
      averagePrice: 25.00,
      revenue: 1750.00,
      growthRate: 8.9,
      profitMargin: 68.4,
      lastSold: "2024-01-15"
    },
    {
      rank: 6,
      name: "Fresh Orange Juice",
      category: "Beverage",
      totalSales: 1250.00,
      quantitySold: 250,
      averagePrice: 5.00,
      revenue: 1250.00,
      growthRate: 14.7,
      profitMargin: 45.2,
      lastSold: "2024-01-15"
    },
    {
      rank: 7,
      name: "Chocolate Cake",
      category: "Dessert",
      totalSales: 1250.00,
      quantitySold: 125,
      averagePrice: 10.00,
      revenue: 1250.00,
      growthRate: 19.3,
      profitMargin: 72.8,
      lastSold: "2024-01-15"
    },
    {
      rank: 8,
      name: "Beef Steak",
      category: "Main Course",
      totalSales: 1200.00,
      quantitySold: 80,
      averagePrice: 15.00,
      revenue: 1200.00,
      growthRate: 6.2,
      profitMargin: 58.9,
      lastSold: "2024-01-15"
    },
    {
      rank: 9,
      name: "Mozzarella Sticks",
      category: "Appetizer",
      totalSales: 1200.00,
      quantitySold: 120,
      averagePrice: 10.00,
      revenue: 1200.00,
      growthRate: 11.4,
      profitMargin: 52.1,
      lastSold: "2024-01-15"
    },
    {
      rank: 10,
      name: "Coffee",
      category: "Beverage",
      totalSales: 950.00,
      quantitySold: 190,
      averagePrice: 5.00,
      revenue: 950.00,
      growthRate: 9.8,
      profitMargin: 48.6,
      lastSold: "2024-01-15"
    }
  ];

  const itemPerformance: ItemPerformance[] = [
    { period: "This Week", sales: 21560.50, quantity: 1580, growth: 12.5 },
    { period: "Last Week", sales: 19150.25, quantity: 1420, growth: 8.2 },
    { period: "This Month", sales: 85425.75, quantity: 6250, growth: 15.2 },
    { period: "Last Month", sales: 74125.50, quantity: 5420, growth: 6.8 }
  ];

  const categoryRankings: CategoryRanking[] = [
    { category: "Main Course", topItem: "Grilled Chicken Breast", totalSales: 6000.00, itemsCount: 8 },
    { category: "Appetizer", topItem: "Chicken Wings", totalSales: 3050.00, itemsCount: 5 },
    { category: "Beverage", topItem: "Fresh Orange Juice", totalSales: 2200.00, itemsCount: 6 },
    { category: "Salad", topItem: "Caesar Salad", totalSales: 2250.00, itemsCount: 4 },
    { category: "Dessert", topItem: "Chocolate Cake", totalSales: 1250.00, itemsCount: 3 },
    { category: "Pizza", topItem: "Margherita Pizza", totalSales: 1750.00, itemsCount: 2 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
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
            <FaStar className="text-2xl text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">Top Selling Items</h1>
          </div>
          <p className="text-gray-600">Discover your most popular and profitable menu items</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="revenue">Revenue</option>
                  <option value="quantity">Quantity Sold</option>
                  <option value="growth">Growth Rate</option>
                  <option value="profit">Profit Margin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Items</option>
                  <option value="top10">Top 10</option>
                  <option value="top5">Top 5</option>
                  <option value="categories">By Category</option>
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
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-600">{topItems.length}</p>
              </div>
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${topItems.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </p>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Item</p>
                <p className="text-lg font-bold text-yellow-600">{topItems[0].name}</p>
                <p className="text-sm text-gray-500">${topItems[0].revenue.toFixed(2)}</p>
              </div>
              <FaStar className="text-2xl text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Growth</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(topItems.reduce((sum, item) => sum + item.growthRate, 0) / topItems.length).toFixed(1)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {itemPerformance.map((period, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">{period.period}</div>
                <div className="text-xl font-bold text-gray-800 mb-1">${period.sales.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mb-2">{period.quantity.toLocaleString()} items</div>
                <div className="flex items-center gap-1">
                  {getGrowthIcon(period.growth)}
                  <span className={`text-xs ${getGrowthColor(period.growth)}`}>
                    {period.growth > 0 ? '+' : ''}{period.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Items List */}
        {viewMode !== "categories" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              {viewMode === "top5" ? "Top 5 Items" : viewMode === "top10" ? "Top 10 Items" : "All Items Ranking"}
            </h3>
            <div className="space-y-4">
              {topItems
                .slice(0, viewMode === "top5" ? 5 : viewMode === "top10" ? 10 : topItems.length)
                .map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-lg">{getRankIcon(item.rank)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${item.revenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{item.quantitySold} sold</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Price: ${item.averagePrice.toFixed(2)}</span>
                      <span className="text-gray-600">Margin: {item.profitMargin.toFixed(1)}%</span>
                      <div className="flex items-center gap-1">
                        {getGrowthIcon(item.growthRate)}
                        <span className={getGrowthColor(item.growthRate)}>
                          {item.growthRate > 0 ? '+' : ''}{item.growthRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Rankings */}
        {viewMode === "categories" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Category Rankings</h3>
            <div className="space-y-4">
              {categoryRankings.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{category.category}</h4>
                      <p className="text-sm text-gray-600">Top: {category.topItem}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${category.totalSales.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{category.itemsCount} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Table */}
        {viewMode === "all" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Detailed Item Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Item Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Quantity</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Growth</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-yellow-600">{getRankIcon(item.rank)}</span>
                          <span className="text-gray-600">#{item.rank}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-3 px-4 text-gray-600">{item.category}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{item.quantitySold}</td>
                      <td className="py-3 px-4 text-right text-gray-700">${item.averagePrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">${item.revenue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {getGrowthIcon(item.growthRate)}
                          <span className={getGrowthColor(item.growthRate)}>
                            {item.growthRate > 0 ? '+' : ''}{item.growthRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">{item.profitMargin.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellingItemsReport;
