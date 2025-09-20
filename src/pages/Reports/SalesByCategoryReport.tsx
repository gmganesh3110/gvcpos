import React, { useState } from "react";
import { FaTags, FaDollarSign, FaChartPie, FaDownload, FaPrint, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface CategoryData {
  category: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  percentage: number;
  growthRate: number;
  topItem: string;
  topItemSales: number;
}

interface CategoryItem {
  name: string;
  sales: number;
  quantity: number;
  price: number;
  category: string;
}

interface TimePeriodData {
  period: string;
  sales: number;
  growth: number;
}

const SalesByCategoryReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Hardcoded sample data
  const categoryData: CategoryData[] = [
    {
      category: "Main Course",
      totalSales: 34250.25,
      totalOrders: 485,
      averageOrderValue: 70.62,
      percentage: 40.1,
      growthRate: 15.2,
      topItem: "Grilled Chicken Breast",
      topItemSales: 2850.00
    },
    {
      category: "Beverages",
      totalSales: 18750.50,
      totalOrders: 625,
      averageOrderValue: 30.00,
      percentage: 21.9,
      growthRate: 8.5,
      topItem: "Fresh Orange Juice",
      topItemSales: 1250.00
    },
    {
      category: "Appetizers",
      totalSales: 12850.75,
      totalOrders: 285,
      averageOrderValue: 45.09,
      percentage: 15.0,
      growthRate: 12.3,
      topItem: "Chicken Wings",
      topItemSales: 1850.00
    },
    {
      category: "Desserts",
      totalSales: 9850.25,
      totalOrders: 195,
      averageOrderValue: 50.51,
      percentage: 11.5,
      growthRate: 18.7,
      topItem: "Chocolate Cake",
      topItemSales: 1250.00
    },
    {
      category: "Salads",
      totalSales: 9724.00,
      totalOrders: 245,
      averageOrderValue: 39.69,
      percentage: 11.4,
      growthRate: 6.8,
      topItem: "Caesar Salad",
      topItemSales: 1500.00
    }
  ];

  const categoryItems: CategoryItem[] = [
    { name: "Grilled Chicken Breast", sales: 2850.00, quantity: 190, price: 15.00, category: "Main Course" },
    { name: "Fish and Chips", sales: 2250.00, quantity: 150, price: 15.00, category: "Main Course" },
    { name: "Beef Steak", sales: 1950.00, quantity: 130, price: 15.00, category: "Main Course" },
    { name: "Fresh Orange Juice", sales: 1250.00, quantity: 250, price: 5.00, category: "Beverages" },
    { name: "Coffee", sales: 950.00, quantity: 190, price: 5.00, category: "Beverages" },
    { name: "Chicken Wings", sales: 1850.00, quantity: 185, price: 10.00, category: "Appetizers" },
    { name: "Mozzarella Sticks", sales: 1200.00, quantity: 120, price: 10.00, category: "Appetizers" },
    { name: "Chocolate Cake", sales: 1250.00, quantity: 125, price: 10.00, category: "Desserts" },
    { name: "Ice Cream", sales: 850.00, quantity: 85, price: 10.00, category: "Desserts" },
    { name: "Caesar Salad", sales: 1500.00, quantity: 150, price: 10.00, category: "Salads" }
  ];

  const timePeriodData: TimePeriodData[] = [
    { period: "This Week", sales: 21560.50, growth: 12.5 },
    { period: "Last Week", sales: 19150.25, growth: 8.2 },
    { period: "This Month", sales: 85425.75, growth: 15.2 },
    { period: "Last Month", sales: 74125.50, growth: 6.8 }
  ];

  const getMaxSales = () => {
    return Math.max(...categoryData.map(c => c.totalSales));
  };

  const getSalesPercentage = (sales: number) => {
    return (sales / getMaxSales()) * 100;
  };

  const filteredItems = selectedCategory === "all" 
    ? categoryItems 
    : categoryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaTags className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Sales by Category</h1>
          </div>
          <p className="text-gray-600">Analyze sales performance across different food categories</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Filter</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categoryData.map((cat) => (
                    <option key={cat.category} value={cat.category}>{cat.category}</option>
                  ))}
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
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-blue-600">{categoryData.length}</p>
              </div>
              <FaTags className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  ${categoryData.reduce((sum, cat) => sum + cat.totalSales, 0).toLocaleString()}
                </p>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Category</p>
                <p className="text-lg font-bold text-purple-600">{categoryData[0].category}</p>
                <p className="text-sm text-gray-500">{categoryData[0].percentage.toFixed(1)}%</p>
              </div>
              <FaChartPie className="text-2xl text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Growth</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(categoryData.reduce((sum, cat) => sum + cat.growthRate, 0) / categoryData.length).toFixed(1)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Category Performance</h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 text-sm text-gray-600 font-medium">{category.category}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700">${category.totalSales.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{category.totalOrders} orders</span>
                      <span className="text-sm text-gray-500">${category.averageOrderValue.toFixed(2)} avg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{category.percentage.toFixed(1)}%</span>
                      <div className="flex items-center gap-1">
                        {category.growthRate > 0 ? (
                          <FaArrowUp className="text-green-500 text-xs" />
                        ) : (
                          <FaArrowDown className="text-red-500 text-xs" />
                        )}
                        <span className={`text-xs ${category.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {category.growthRate > 0 ? '+' : ''}{category.growthRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getSalesPercentage(category.totalSales)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Period Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Time Period Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timePeriodData.map((period, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">{period.period}</div>
                <div className="text-xl font-bold text-gray-800 mb-1">${period.sales.toLocaleString()}</div>
                <div className="flex items-center gap-1">
                  {period.growth > 0 ? (
                    <FaArrowUp className="text-green-500 text-xs" />
                  ) : (
                    <FaArrowDown className="text-red-500 text-xs" />
                  )}
                  <span className={`text-xs ${period.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {period.growth > 0 ? '+' : ''}{period.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            {selectedCategory === "all" ? "All Items" : `${selectedCategory} Items`}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Item Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Quantity</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.category}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-700">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">${item.sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesByCategoryReport;
