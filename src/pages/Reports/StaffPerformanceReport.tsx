import React, { useState } from "react";
import { FaUsers, FaDollarSign, FaClock, FaDownload, FaPrint, FaArrowUp, FaArrowDown, FaStar, FaTrophy } from "react-icons/fa";

interface StaffData {
  id: string;
  name: string;
  role: string;
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  hoursWorked: number;
  salesPerHour: number;
  customerRating: number;
  tipsEarned: number;
  efficiency: number;
  status: "Active" | "On Break" | "Off Duty";
  shift: string;
}

interface StaffStats {
  id: string;
  name: string;
  peakHour: string;
  peakSales: number;
  bestSellingItem: string;
  customerComplaints: number;
  customerCompliments: number;
  attendanceRate: number;
  punctuality: number;
}

interface RolePerformance {
  role: string;
  totalStaff: number;
  averageSales: number;
  averageRating: number;
  totalHours: number;
  efficiency: number;
}

const StaffPerformanceReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [viewMode, setViewMode] = useState("overview");
  const [roleFilter, setRoleFilter] = useState("all");

  // Hardcoded sample data
  const staffData: StaffData[] = [
    {
      id: "S001",
      name: "Sarah Johnson",
      role: "Server",
      totalOrders: 85,
      totalSales: 5425.50,
      averageOrderValue: 63.83,
      hoursWorked: 40,
      salesPerHour: 135.64,
      customerRating: 4.8,
      tipsEarned: 650.00,
      efficiency: 92.5,
      status: "Active",
      shift: "Evening"
    },
    {
      id: "S002",
      name: "Mike Chen",
      role: "Server",
      totalOrders: 78,
      totalSales: 4850.25,
      averageOrderValue: 62.18,
      hoursWorked: 38,
      salesPerHour: 127.64,
      customerRating: 4.6,
      tipsEarned: 580.00,
      efficiency: 88.7,
      status: "On Break",
      shift: "Evening"
    },
    {
      id: "S003",
      name: "Emily Rodriguez",
      role: "Server",
      totalOrders: 92,
      totalSales: 6200.75,
      averageOrderValue: 67.40,
      hoursWorked: 42,
      salesPerHour: 147.64,
      customerRating: 4.9,
      tipsEarned: 720.00,
      efficiency: 95.2,
      status: "Active",
      shift: "Evening"
    },
    {
      id: "S004",
      name: "David Kim",
      role: "Bartender",
      totalOrders: 65,
      totalSales: 3250.00,
      averageOrderValue: 50.00,
      hoursWorked: 35,
      salesPerHour: 92.86,
      customerRating: 4.7,
      tipsEarned: 420.00,
      efficiency: 89.3,
      status: "Active",
      shift: "Evening"
    },
    {
      id: "S005",
      name: "Lisa Thompson",
      role: "Host",
      totalOrders: 0,
      totalSales: 0,
      averageOrderValue: 0,
      hoursWorked: 30,
      salesPerHour: 0,
      customerRating: 4.5,
      tipsEarned: 0,
      efficiency: 85.0,
      status: "Active",
      shift: "Evening"
    },
    {
      id: "S006",
      name: "James Wilson",
      role: "Kitchen Staff",
      totalOrders: 0,
      totalSales: 0,
      averageOrderValue: 0,
      hoursWorked: 45,
      salesPerHour: 0,
      customerRating: 4.4,
      tipsEarned: 0,
      efficiency: 87.8,
      status: "Off Duty",
      shift: "Day"
    }
  ];

  const staffStats: StaffStats[] = [
    {
      id: "S001",
      name: "Sarah Johnson",
      peakHour: "19:00-20:00",
      peakSales: 450.25,
      bestSellingItem: "Grilled Chicken Breast",
      customerComplaints: 0,
      customerCompliments: 12,
      attendanceRate: 98.5,
      punctuality: 95.0
    },
    {
      id: "S002",
      name: "Mike Chen",
      peakHour: "20:00-21:00",
      peakSales: 380.75,
      bestSellingItem: "Fish and Chips",
      customerComplaints: 1,
      customerCompliments: 8,
      attendanceRate: 96.0,
      punctuality: 92.5
    },
    {
      id: "S003",
      name: "Emily Rodriguez",
      peakHour: "18:00-19:00",
      peakSales: 520.50,
      bestSellingItem: "Caesar Salad",
      customerComplaints: 0,
      customerCompliments: 15,
      attendanceRate: 100.0,
      punctuality: 98.0
    },
    {
      id: "S004",
      name: "David Kim",
      peakHour: "21:00-22:00",
      peakSales: 280.25,
      bestSellingItem: "Craft Beer",
      customerComplaints: 0,
      customerCompliments: 6,
      attendanceRate: 97.5,
      punctuality: 94.5
    }
  ];

  const rolePerformance: RolePerformance[] = [
    {
      role: "Server",
      totalStaff: 3,
      averageSales: 5492.17,
      averageRating: 4.77,
      totalHours: 120,
      efficiency: 92.1
    },
    {
      role: "Bartender",
      totalStaff: 1,
      averageSales: 3250.00,
      averageRating: 4.7,
      totalHours: 35,
      efficiency: 89.3
    },
    {
      role: "Host",
      totalStaff: 1,
      averageSales: 0,
      averageRating: 4.5,
      totalHours: 30,
      efficiency: 85.0
    },
    {
      role: "Kitchen Staff",
      totalStaff: 1,
      averageSales: 0,
      averageRating: 4.4,
      totalHours: 45,
      efficiency: 87.8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-green-600 bg-green-100";
      case "On Break": return "text-yellow-600 bg-yellow-100";
      case "Off Duty": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return "🟢";
      case "On Break": return "🟡";
      case "Off Duty": return "⚫";
      default: return "⚪";
    }
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const filteredStaff = roleFilter === "all" 
    ? staffData 
    : staffData.filter(staff => staff.role === roleFilter);

  const getMaxSales = () => {
    return Math.max(...staffData.map(s => s.totalSales));
  };

  const getSalesPercentage = (sales: number) => {
    return sales > 0 ? (sales / getMaxSales()) * 100 : 0;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Staff Performance Report</h1>
          </div>
          <p className="text-gray-600">Monitor staff performance, sales, and customer satisfaction</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Filter</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="Server">Server</option>
                  <option value="Bartender">Bartender</option>
                  <option value="Host">Host</option>
                  <option value="Kitchen Staff">Kitchen Staff</option>
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
                  <option value="stats">Statistics</option>
                  <option value="roles">Role Analysis</option>
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
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-blue-600">{staffData.length}</p>
              </div>
              <FaUsers className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  ${staffData.reduce((sum, staff) => sum + staff.totalSales, 0).toLocaleString()}
                </p>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(staffData.reduce((sum, staff) => sum + staff.customerRating, 0) / staffData.length).toFixed(1)}
                </p>
              </div>
              <FaStar className="text-2xl text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tips</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${staffData.reduce((sum, staff) => sum + staff.tipsEarned, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Performance */}
        {viewMode === "performance" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Staff Performance Details</h3>
            <div className="space-y-4">
              {filteredStaff.map((staff, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{staff.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{staff.name}</h4>
                      <p className="text-sm text-gray-600">{staff.role} • {staff.shift} Shift</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        {staff.totalSales > 0 && (
                          <>
                            <span className="text-sm text-gray-700">${staff.totalSales.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">{staff.totalOrders} orders</span>
                            <span className="text-sm text-gray-500">${staff.salesPerHour.toFixed(2)}/hr</span>
                            <span className="text-sm text-gray-500">{staff.hoursWorked}h worked</span>
                          </>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">{getRatingStars(staff.customerRating)}</span>
                          <span className="text-sm text-gray-600">({staff.customerRating})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(staff.status)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                          {staff.status}
                        </span>
                      </div>
                    </div>
                    {staff.totalSales > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getSalesPercentage(staff.totalSales)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Statistics */}
        {viewMode === "stats" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Staff Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {staffStats.map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{stat.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <h4 className="font-medium text-gray-800">{stat.name}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Hour</span>
                      <span className="font-medium">{stat.peakHour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Sales</span>
                      <span className="font-medium">${stat.peakSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Item</span>
                      <span className="font-medium text-xs">{stat.bestSellingItem}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Complaints</span>
                      <span className="font-medium text-red-600">{stat.customerComplaints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compliments</span>
                      <span className="font-medium text-green-600">{stat.customerCompliments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance</span>
                      <span className="font-medium">{stat.attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Punctuality</span>
                      <span className="font-medium">{stat.punctuality.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Analysis */}
        {viewMode === "roles" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Role Performance Analysis</h3>
            <div className="space-y-4">
              {rolePerformance.map((role, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24 text-sm text-gray-600 font-medium">{role.role}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">{role.totalStaff} staff</span>
                        <span className="text-sm text-gray-500">${role.averageSales.toFixed(2)} avg sales</span>
                        <span className="text-sm text-gray-500">{role.averageRating.toFixed(1)} avg rating</span>
                        <span className="text-sm text-gray-500">{role.totalHours}h total</span>
                        <span className="text-sm text-gray-500">{role.efficiency.toFixed(1)}% efficiency</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${role.efficiency}%` }}
                      ></div>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Staff Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Staff</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Orders</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Sales</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Sales/Hr</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Hours</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Rating</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Tips</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{staff.name}</td>
                      <td className="py-3 px-4 text-gray-700">{staff.role}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{staff.totalOrders}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {staff.totalSales > 0 ? `$${staff.totalSales.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {staff.salesPerHour > 0 ? `$${staff.salesPerHour.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">{staff.hoursWorked}h</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-yellow-500">{getRatingStars(staff.customerRating)}</span>
                          <span className="text-sm text-gray-600">({staff.customerRating})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {staff.tipsEarned > 0 ? `$${staff.tipsEarned.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                          {staff.status}
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

export default StaffPerformanceReport;
