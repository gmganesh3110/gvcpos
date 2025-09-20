import React, { useState } from "react";
import { FaExclamationTriangle, FaBell, FaSearch, FaFilter, FaShoppingCart } from "react-icons/fa";

interface LowStockItem {
  id: number;
  itemName: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  daysSinceAlert: number;
  priority: "High" | "Medium" | "Low";
  lastRestocked: string;
  supplier: string;
  estimatedCost: number;
}

const LowStockAlerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Hardcoded sample data
  const lowStockData: LowStockItem[] = [
    {
      id: 1,
      itemName: "Tomatoes",
      category: "Vegetables",
      currentStock: 8,
      minStock: 15,
      unit: "kg",
      daysSinceAlert: 3,
      priority: "High",
      lastRestocked: "2024-01-10",
      supplier: "Fresh Produce Co.",
      estimatedCost: 25.60
    },
    {
      id: 2,
      itemName: "Olive Oil",
      category: "Cooking Oil",
      currentStock: 0,
      minStock: 5,
      unit: "liters",
      daysSinceAlert: 5,
      priority: "High",
      lastRestocked: "2024-01-08",
      supplier: "Mediterranean Foods",
      estimatedCost: 43.75
    },
    {
      id: 3,
      itemName: "Chicken Breast",
      category: "Meat",
      currentStock: 12,
      minStock: 20,
      unit: "kg",
      daysSinceAlert: 1,
      priority: "Medium",
      lastRestocked: "2024-01-12",
      supplier: "Premium Meats Ltd.",
      estimatedCost: 150.00
    },
    {
      id: 4,
      itemName: "Cheese",
      category: "Dairy",
      currentStock: 6,
      minStock: 10,
      unit: "kg",
      daysSinceAlert: 2,
      priority: "Medium",
      lastRestocked: "2024-01-11",
      supplier: "Dairy Fresh",
      estimatedCost: 40.80
    },
    {
      id: 5,
      itemName: "Rice",
      category: "Grains",
      currentStock: 18,
      minStock: 25,
      unit: "kg",
      daysSinceAlert: 1,
      priority: "Low",
      lastRestocked: "2024-01-13",
      supplier: "Grain Suppliers Inc.",
      estimatedCost: 37.80
    },
    {
      id: 6,
      itemName: "Onions",
      category: "Vegetables",
      currentStock: 5,
      minStock: 12,
      unit: "kg",
      daysSinceAlert: 4,
      priority: "High",
      lastRestocked: "2024-01-09",
      supplier: "Fresh Produce Co.",
      estimatedCost: 8.50
    }
  ];

  const priorities = ["all", "High", "Medium", "Low"];
  const categories = ["all", "Vegetables", "Cooking Oil", "Meat", "Dairy", "Grains"];

  const filteredData = lowStockData.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || item.priority === filterPriority;
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStockPercentage = (current: number, min: number) => {
    return Math.round((current / min) * 100);
  };

  const getStockColor = (percentage: number) => {
    if (percentage === 0) return "bg-red-500";
    if (percentage < 50) return "bg-red-400";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaExclamationTriangle className="text-2xl text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">Low Stock Alerts</h1>
          </div>
          <p className="text-gray-600">Monitor items that need immediate restocking</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === "all" ? "All Priorities" : priority}
                    </option>
                  ))}
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <FaShoppingCart />
              Bulk Order
            </button>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className="font-semibold text-red-600">{item.currentStock} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Min Required:</span>
                  <span className="text-sm">{item.minStock} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days Since Alert:</span>
                  <span className="text-sm font-medium">{item.daysSinceAlert} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Supplier:</span>
                  <span className="text-sm">{item.supplier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Est. Cost:</span>
                  <span className="font-semibold text-green-600">${item.estimatedCost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Restocked:</span>
                  <span className="text-sm">{item.lastRestocked}</span>
                </div>
              </div>

              {/* Stock Level Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Stock Level</span>
                  <span>{getStockPercentage(item.currentStock, item.minStock)}% of minimum</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStockColor(getStockPercentage(item.currentStock, item.minStock))}`}
                    style={{ width: `${Math.min(getStockPercentage(item.currentStock, item.minStock), 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-600 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors">
                  <FaShoppingCart />
                  Order Now
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                  <FaBell />
                  Remind Later
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-800">{lowStockData.length}</p>
              </div>
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {lowStockData.filter(item => item.priority === "High").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medium Priority</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {lowStockData.filter(item => item.priority === "Medium").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Est. Cost</p>
                <p className="text-2xl font-bold text-green-600">
                  ${lowStockData.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;
