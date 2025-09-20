import React, { useState } from "react";
import { FaBoxes, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa";

interface StockItem {
  id: number;
  itemName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  lastUpdated: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const StockManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Hardcoded sample data
  const stockData: StockItem[] = [
    {
      id: 1,
      itemName: "Chicken Breast",
      category: "Meat",
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: "kg",
      cost: 12.50,
      lastUpdated: "2024-01-15",
      status: "In Stock"
    },
    {
      id: 2,
      itemName: "Tomatoes",
      category: "Vegetables",
      currentStock: 8,
      minStock: 15,
      maxStock: 30,
      unit: "kg",
      cost: 3.20,
      lastUpdated: "2024-01-14",
      status: "Low Stock"
    },
    {
      id: 3,
      itemName: "Olive Oil",
      category: "Cooking Oil",
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      unit: "liters",
      cost: 8.75,
      lastUpdated: "2024-01-13",
      status: "Out of Stock"
    },
    {
      id: 4,
      itemName: "Rice",
      category: "Grains",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: "kg",
      cost: 2.10,
      lastUpdated: "2024-01-15",
      status: "In Stock"
    },
    {
      id: 5,
      itemName: "Cheese",
      category: "Dairy",
      currentStock: 12,
      minStock: 8,
      maxStock: 25,
      unit: "kg",
      cost: 6.80,
      lastUpdated: "2024-01-14",
      status: "In Stock"
    }
  ];

  const categories = ["all", "Meat", "Vegetables", "Cooking Oil", "Grains", "Dairy"];

  const filteredData = stockData.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "text-green-600 bg-green-100";
      case "Low Stock": return "text-yellow-600 bg-yellow-100";
      case "Out of Stock": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaBoxes className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
          </div>
          <p className="text-gray-600">Manage your inventory stock levels and track items</p>
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
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              Add Stock Item
            </button>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className="font-semibold">{item.currentStock} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Min Stock:</span>
                  <span className="text-sm">{item.minStock} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Max Stock:</span>
                  <span className="text-sm">{item.maxStock} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cost:</span>
                  <span className="font-semibold text-green-600">${item.cost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm">{item.lastUpdated}</span>
                </div>
              </div>

              {/* Stock Level Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Stock Level</span>
                  <span>{Math.round((item.currentStock / item.maxStock) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.status === "Out of Stock" ? "bg-red-500" :
                      item.status === "Low Stock" ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                  <FaEdit />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors">
                  <FaTrash />
                  Delete
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
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-800">{stockData.length}</p>
              </div>
              <FaBoxes className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {stockData.filter(item => item.status === "In Stock").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stockData.filter(item => item.status === "Low Stock").length}
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
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {stockData.filter(item => item.status === "Out of Stock").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
