import React, { useState } from "react";
import { FaChair, FaClock, FaDollarSign, FaDownload, FaPrint, FaArrowUp, FaArrowDown, FaUsers } from "react-icons/fa";

interface TableData {
  tableNumber: string;
  capacity: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  averageOccupancyTime: number;
  occupancyRate: number;
  turnoverRate: number;
  status: "Available" | "Occupied" | "Reserved" | "Maintenance";
  lastUsed: string;
}

interface TableStats {
  tableNumber: string;
  peakHour: string;
  peakRevenue: number;
  averagePartySize: number;
  customerSatisfaction: number;
  mostPopularItems: string[];
}

interface TimeSlotPerformance {
  timeSlot: string;
  totalTables: number;
  occupiedTables: number;
  occupancyRate: number;
  averageRevenue: number;
}

const TablePerformanceReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [viewMode, setViewMode] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");

  // Hardcoded sample data
  const tableData: TableData[] = [
    {
      tableNumber: "T01",
      capacity: 2,
      totalOrders: 45,
      totalRevenue: 2850.25,
      averageOrderValue: 63.34,
      averageOccupancyTime: 75,
      occupancyRate: 85.2,
      turnoverRate: 4.2,
      status: "Available",
      lastUsed: "2024-01-15 20:30"
    },
    {
      tableNumber: "T02",
      capacity: 4,
      totalOrders: 38,
      totalRevenue: 2450.75,
      averageOrderValue: 64.49,
      averageOccupancyTime: 90,
      occupancyRate: 78.5,
      turnoverRate: 3.8,
      status: "Occupied",
      lastUsed: "2024-01-15 21:15"
    },
    {
      tableNumber: "T03",
      capacity: 6,
      totalOrders: 32,
      totalRevenue: 3200.50,
      averageOrderValue: 100.02,
      averageOccupancyTime: 120,
      occupancyRate: 72.1,
      turnoverRate: 3.2,
      status: "Reserved",
      lastUsed: "2024-01-15 19:45"
    },
    {
      tableNumber: "T04",
      capacity: 2,
      totalOrders: 42,
      totalRevenue: 2100.00,
      averageOrderValue: 50.00,
      averageOccupancyTime: 60,
      occupancyRate: 88.7,
      turnoverRate: 4.5,
      status: "Available",
      lastUsed: "2024-01-15 20:00"
    },
    {
      tableNumber: "T05",
      capacity: 4,
      totalOrders: 35,
      totalRevenue: 2750.25,
      averageOrderValue: 78.58,
      averageOccupancyTime: 85,
      occupancyRate: 80.3,
      turnoverRate: 3.9,
      status: "Occupied",
      lastUsed: "2024-01-15 21:00"
    },
    {
      tableNumber: "T06",
      capacity: 8,
      totalOrders: 28,
      totalRevenue: 4200.75,
      averageOrderValue: 150.03,
      averageOccupancyTime: 150,
      occupancyRate: 65.8,
      turnoverRate: 2.8,
      status: "Available",
      lastUsed: "2024-01-15 18:30"
    },
    {
      tableNumber: "T07",
      capacity: 2,
      totalOrders: 48,
      totalRevenue: 2400.00,
      averageOrderValue: 50.00,
      averageOccupancyTime: 55,
      occupancyRate: 92.1,
      turnoverRate: 4.8,
      status: "Maintenance",
      lastUsed: "2024-01-15 17:45"
    },
    {
      tableNumber: "T08",
      capacity: 4,
      totalOrders: 40,
      totalRevenue: 3000.50,
      averageOrderValue: 75.01,
      averageOccupancyTime: 95,
      occupancyRate: 82.4,
      turnoverRate: 4.0,
      status: "Available",
      lastUsed: "2024-01-15 20:45"
    }
  ];

  const tableStats: TableStats[] = [
    {
      tableNumber: "T01",
      peakHour: "19:00-20:00",
      peakRevenue: 450.25,
      averagePartySize: 1.8,
      customerSatisfaction: 4.5,
      mostPopularItems: ["Grilled Chicken", "Caesar Salad", "Coffee"]
    },
    {
      tableNumber: "T02",
      peakHour: "20:00-21:00",
      peakRevenue: 380.75,
      averagePartySize: 3.2,
      customerSatisfaction: 4.3,
      mostPopularItems: ["Fish and Chips", "Pizza", "Beer"]
    },
    {
      tableNumber: "T03",
      peakHour: "18:00-19:00",
      peakRevenue: 650.50,
      averagePartySize: 5.1,
      customerSatisfaction: 4.7,
      mostPopularItems: ["Family Platter", "Wine", "Dessert"]
    },
    {
      tableNumber: "T04",
      peakHour: "19:30-20:30",
      peakRevenue: 320.00,
      averagePartySize: 1.9,
      customerSatisfaction: 4.4,
      mostPopularItems: ["Chicken Wings", "Salad", "Tea"]
    }
  ];

  const timeSlotPerformance: TimeSlotPerformance[] = [
    { timeSlot: "17:00-18:00", totalTables: 8, occupiedTables: 3, occupancyRate: 37.5, averageRevenue: 285.50 },
    { timeSlot: "18:00-19:00", totalTables: 8, occupiedTables: 6, occupancyRate: 75.0, averageRevenue: 425.75 },
    { timeSlot: "19:00-20:00", totalTables: 8, occupiedTables: 7, occupancyRate: 87.5, averageRevenue: 485.25 },
    { timeSlot: "20:00-21:00", totalTables: 8, occupiedTables: 8, occupancyRate: 100.0, averageRevenue: 520.50 },
    { timeSlot: "21:00-22:00", totalTables: 8, occupiedTables: 6, occupancyRate: 75.0, averageRevenue: 380.75 },
    { timeSlot: "22:00-23:00", totalTables: 8, occupiedTables: 2, occupancyRate: 25.0, averageRevenue: 195.25 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "text-green-600 bg-green-100";
      case "Occupied": return "text-red-600 bg-red-100";
      case "Reserved": return "text-yellow-600 bg-yellow-100";
      case "Maintenance": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available": return "🟢";
      case "Occupied": return "🔴";
      case "Reserved": return "🟡";
      case "Maintenance": return "⚫";
      default: return "⚪";
    }
  };

  const filteredTables = statusFilter === "all" 
    ? tableData 
    : tableData.filter(table => table.status === statusFilter);

  const getMaxRevenue = () => {
    return Math.max(...tableData.map(t => t.totalRevenue));
  };

  const getRevenuePercentage = (revenue: number) => {
    return (revenue / getMaxRevenue()) * 100;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaChair className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Table Performance Report</h1>
          </div>
          <p className="text-gray-600">Monitor table utilization, revenue, and operational efficiency</p>
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
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Tables</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintenance">Maintenance</option>
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
                  <option value="performance">Performance</option>
                  <option value="timeslots">Time Slots</option>
                  <option value="stats">Statistics</option>
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
                <p className="text-sm text-gray-600">Total Tables</p>
                <p className="text-2xl font-bold text-blue-600">{tableData.length}</p>
              </div>
              <FaChair className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${tableData.reduce((sum, table) => sum + table.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Occupancy</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(tableData.reduce((sum, table) => sum + table.occupancyRate, 0) / tableData.length).toFixed(1)}%
                </p>
              </div>
              <FaUsers className="text-2xl text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Turnover</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(tableData.reduce((sum, table) => sum + table.turnoverRate, 0) / tableData.length).toFixed(1)}
                </p>
              </div>
              <FaClock className="text-2xl text-orange-600" />
            </div>
          </div>
        </div>

        {/* Table Performance */}
        {viewMode === "performance" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Table Performance Details</h3>
            <div className="space-y-4">
              {filteredTables.map((table, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{table.tableNumber}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Table {table.tableNumber}</h4>
                      <p className="text-sm text-gray-600">Capacity: {table.capacity} • {table.totalOrders} orders</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">${table.totalRevenue.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">${table.averageOrderValue.toFixed(2)} avg</span>
                        <span className="text-sm text-gray-500">{table.occupancyRate.toFixed(1)}% occupied</span>
                        <span className="text-sm text-gray-500">{table.turnoverRate.toFixed(1)}x turnover</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(table.status)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                          {table.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getRevenuePercentage(table.totalRevenue)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Slot Performance */}
        {viewMode === "timeslots" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Time Slot Performance</h3>
            <div className="space-y-4">
              {timeSlotPerformance.map((slot, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24 text-sm text-gray-600 font-medium">{slot.timeSlot}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">{slot.occupiedTables}/{slot.totalTables} tables</span>
                        <span className="text-sm text-gray-500">{slot.occupancyRate.toFixed(1)}% occupancy</span>
                        <span className="text-sm text-gray-500">${slot.averageRevenue.toFixed(2)} avg revenue</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${slot.occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Statistics */}
        {viewMode === "stats" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Table Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tableStats.map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{stat.tableNumber}</span>
                    </div>
                    <h4 className="font-medium text-gray-800">Table {stat.tableNumber}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Hour</span>
                      <span className="font-medium">{stat.peakHour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Revenue</span>
                      <span className="font-medium">${stat.peakRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Party Size</span>
                      <span className="font-medium">{stat.averagePartySize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satisfaction</span>
                      <span className="font-medium text-green-600">{stat.customerSatisfaction}/5</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-600 text-xs mb-1">Popular Items:</p>
                      <div className="flex flex-wrap gap-1">
                        {stat.mostPopularItems.map((item, itemIndex) => (
                          <span key={itemIndex} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Table */}
        {viewMode === "overview" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Table Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Table</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Capacity</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Orders</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Avg Order</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Occupancy</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Turnover</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTables.map((table, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{table.tableNumber}</td>
                      <td className="py-3 px-4 text-gray-700">{table.capacity}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{table.totalOrders}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">${table.totalRevenue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-700">${table.averageOrderValue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{table.occupancyRate.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right text-gray-700">{table.turnoverRate.toFixed(1)}x</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                          {table.status}
                        </span>
                      </td>
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

export default TablePerformanceReport;
