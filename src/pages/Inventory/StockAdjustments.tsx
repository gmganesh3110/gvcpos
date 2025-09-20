import React, { useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaFilter, FaHistory } from "react-icons/fa";

interface StockAdjustment {
  id: number;
  itemName: string;
  category: string;
  adjustmentType: "Increase" | "Decrease" | "Transfer";
  quantity: number;
  reason: string;
  adjustedBy: string;
  date: string;
  time: string;
  reference: string;
}

const StockAdjustments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Hardcoded sample data
  const adjustmentsData: StockAdjustment[] = [
    {
      id: 1,
      itemName: "Chicken Breast",
      category: "Meat",
      adjustmentType: "Increase",
      quantity: 10,
      reason: "New stock received",
      adjustedBy: "John Doe",
      date: "2024-01-15",
      time: "10:30 AM",
      reference: "PO-2024-001"
    },
    {
      id: 2,
      itemName: "Tomatoes",
      category: "Vegetables",
      adjustmentType: "Decrease",
      quantity: 5,
      reason: "Damaged goods disposal",
      adjustedBy: "Jane Smith",
      date: "2024-01-15",
      time: "09:15 AM",
      reference: "DMG-2024-002"
    },
    {
      id: 3,
      itemName: "Olive Oil",
      category: "Cooking Oil",
      adjustmentType: "Transfer",
      quantity: 3,
      reason: "Transfer to branch 2",
      adjustedBy: "Mike Johnson",
      date: "2024-01-14",
      time: "02:45 PM",
      reference: "TRF-2024-003"
    },
    {
      id: 4,
      itemName: "Rice",
      category: "Grains",
      adjustmentType: "Increase",
      quantity: 25,
      reason: "Bulk purchase",
      adjustedBy: "Sarah Wilson",
      date: "2024-01-14",
      time: "11:20 AM",
      reference: "PO-2024-004"
    },
    {
      id: 5,
      itemName: "Cheese",
      category: "Dairy",
      adjustmentType: "Decrease",
      quantity: 2,
      reason: "Expired items",
      adjustedBy: "Tom Brown",
      date: "2024-01-13",
      time: "04:10 PM",
      reference: "EXP-2024-005"
    }
  ];

  const adjustmentTypes = ["all", "Increase", "Decrease", "Transfer"];

  const filteredData = adjustmentsData.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.adjustmentType === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Increase": return "text-green-600 bg-green-100";
      case "Decrease": return "text-red-600 bg-red-100";
      case "Transfer": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Increase": return "↗";
      case "Decrease": return "↘";
      case "Transfer": return "↔";
      default: return "?";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaEdit className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Stock Adjustments</h1>
          </div>
          <p className="text-gray-600">Track and manage inventory adjustments and movements</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search adjustments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {adjustmentTypes.map(type => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
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
              New Adjustment
            </button>
          </div>
        </div>

        {/* Adjustments Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adjusted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{adjustment.itemName}</div>
                        <div className="text-sm text-gray-500">{adjustment.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(adjustment.adjustmentType)}`}>
                        <span className="text-sm">{getTypeIcon(adjustment.adjustmentType)}</span>
                        {adjustment.adjustmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        adjustment.adjustmentType === "Increase" ? "text-green-600" :
                        adjustment.adjustmentType === "Decrease" ? "text-red-600" : "text-blue-600"
                      }`}>
                        {adjustment.adjustmentType === "Increase" ? "+" : adjustment.adjustmentType === "Decrease" ? "-" : ""}
                        {adjustment.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={adjustment.reason}>
                        {adjustment.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{adjustment.adjustedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{adjustment.date}</div>
                      <div className="text-sm text-gray-500">{adjustment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">{adjustment.reference}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Adjustments</p>
                <p className="text-2xl font-bold text-gray-800">{adjustmentsData.length}</p>
              </div>
              <FaHistory className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Increases</p>
                <p className="text-2xl font-bold text-green-600">
                  {adjustmentsData.filter(item => item.adjustmentType === "Increase").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">↗</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Decreases</p>
                <p className="text-2xl font-bold text-red-600">
                  {adjustmentsData.filter(item => item.adjustmentType === "Decrease").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">↘</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transfers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {adjustmentsData.filter(item => item.adjustmentType === "Transfer").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">↔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustments;
