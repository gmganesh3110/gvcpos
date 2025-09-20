import React, { useState } from "react";
import { FaUserAlt, FaUsers, FaDollarSign, FaDownload, FaPrint, FaArrowUp, FaArrowDown, FaStar, FaClock, FaHeart } from "react-icons/fa";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  totalVisits: number;
  totalSpent: number;
  averageOrderValue: number;
  lastVisit: string;
  customerSince: string;
  loyaltyPoints: number;
  favoriteCategory: string;
  preferredPaymentMethod: string;
  customerRating: number;
  status: "Active" | "Inactive" | "VIP" | "New";
}

interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  averageSpent: number;
  averageVisits: number;
  color: string;
}

interface CustomerTrend {
  period: string;
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
  growthRate: number;
}

interface CustomerBehavior {
  behavior: string;
  count: number;
  percentage: number;
  description: string;
}

const CustomerAnalyticsReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [viewMode, setViewMode] = useState("overview");
  const [segmentFilter, setSegmentFilter] = useState("all");

  // Hardcoded sample data
  const customerData: CustomerData[] = [
    {
      id: "C001",
      name: "John Smith",
      email: "john.smith@email.com",
      totalVisits: 25,
      totalSpent: 1250.75,
      averageOrderValue: 50.03,
      lastVisit: "2024-01-15",
      customerSince: "2023-06-15",
      loyaltyPoints: 1250,
      favoriteCategory: "Main Course",
      preferredPaymentMethod: "Credit Card",
      customerRating: 4.8,
      status: "VIP"
    },
    {
      id: "C002",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      totalVisits: 18,
      totalSpent: 890.50,
      averageOrderValue: 49.47,
      lastVisit: "2024-01-14",
      customerSince: "2023-08-20",
      loyaltyPoints: 890,
      favoriteCategory: "Salad",
      preferredPaymentMethod: "Digital Wallet",
      customerRating: 4.6,
      status: "Active"
    },
    {
      id: "C003",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      totalVisits: 12,
      totalSpent: 650.25,
      averageOrderValue: 54.19,
      lastVisit: "2024-01-12",
      customerSince: "2023-10-05",
      loyaltyPoints: 650,
      favoriteCategory: "Beverages",
      preferredPaymentMethod: "Cash",
      customerRating: 4.4,
      status: "Active"
    },
    {
      id: "C004",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      totalVisits: 8,
      totalSpent: 420.00,
      averageOrderValue: 52.50,
      lastVisit: "2024-01-10",
      customerSince: "2023-11-15",
      loyaltyPoints: 420,
      favoriteCategory: "Desserts",
      preferredPaymentMethod: "Debit Card",
      customerRating: 4.7,
      status: "New"
    },
    {
      id: "C005",
      name: "David Kim",
      email: "david.kim@email.com",
      totalVisits: 35,
      totalSpent: 1850.00,
      averageOrderValue: 52.86,
      lastVisit: "2024-01-13",
      customerSince: "2023-03-10",
      loyaltyPoints: 1850,
      favoriteCategory: "Main Course",
      preferredPaymentMethod: "Credit Card",
      customerRating: 4.9,
      status: "VIP"
    },
    {
      id: "C006",
      name: "Lisa Thompson",
      email: "lisa.t@email.com",
      totalVisits: 5,
      totalSpent: 250.75,
      averageOrderValue: 50.15,
      lastVisit: "2023-12-20",
      customerSince: "2023-12-01",
      loyaltyPoints: 250,
      favoriteCategory: "Appetizers",
      preferredPaymentMethod: "Digital Wallet",
      customerRating: 4.2,
      status: "Inactive"
    }
  ];

  const customerSegments: CustomerSegment[] = [
    {
      segment: "VIP Customers",
      count: 2,
      percentage: 33.3,
      averageSpent: 1550.38,
      averageVisits: 30,
      color: "bg-purple-500"
    },
    {
      segment: "Active Customers",
      count: 2,
      percentage: 33.3,
      averageSpent: 770.38,
      averageVisits: 15,
      color: "bg-green-500"
    },
    {
      segment: "New Customers",
      count: 1,
      percentage: 16.7,
      averageSpent: 420.00,
      averageVisits: 8,
      color: "bg-blue-500"
    },
    {
      segment: "Inactive Customers",
      count: 1,
      percentage: 16.7,
      averageSpent: 250.75,
      averageVisits: 5,
      color: "bg-gray-500"
    }
  ];

  const customerTrends: CustomerTrend[] = [
    { period: "Week 1", newCustomers: 3, returningCustomers: 45, totalCustomers: 48, growthRate: 6.7 },
    { period: "Week 2", newCustomers: 5, returningCustomers: 52, totalCustomers: 57, growthRate: 18.8 },
    { period: "Week 3", newCustomers: 4, returningCustomers: 48, totalCustomers: 52, growthRate: -8.8 },
    { period: "Week 4", newCustomers: 6, returningCustomers: 55, totalCustomers: 61, growthRate: 17.3 }
  ];

  const customerBehaviors: CustomerBehavior[] = [
    {
      behavior: "Frequent Visitors",
      count: 15,
      percentage: 25.0,
      description: "Visit 3+ times per month"
    },
    {
      behavior: "High Spenders",
      count: 12,
      percentage: 20.0,
      description: "Spend $100+ per visit"
    },
    {
      behavior: "Loyalty Program Members",
      count: 35,
      percentage: 58.3,
      description: "Active in loyalty program"
    },
    {
      behavior: "Online Orderers",
      count: 28,
      percentage: 46.7,
      description: "Prefer online ordering"
    },
    {
      behavior: "Weekend Customers",
      count: 22,
      percentage: 36.7,
      description: "Visit primarily on weekends"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "text-purple-600 bg-purple-100";
      case "Active": return "text-green-600 bg-green-100";
      case "New": return "text-blue-600 bg-blue-100";
      case "Inactive": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VIP": return "👑";
      case "Active": return "🟢";
      case "New": return "🆕";
      case "Inactive": return "⚫";
      default: return "⚪";
    }
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const filteredCustomers = segmentFilter === "all" 
    ? customerData 
    : customerData.filter(customer => customer.status === segmentFilter);

  const getMaxSpent = () => {
    return Math.max(...customerData.map(c => c.totalSpent));
  };

  const getSpentPercentage = (spent: number) => {
    return (spent / getMaxSpent()) * 100;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaUserAlt className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Customer Analytics Report</h1>
          </div>
          <p className="text-gray-600">Analyze customer behavior, preferences, and loyalty patterns</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Segment Filter</label>
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Segments</option>
                  <option value="VIP">VIP Customers</option>
                  <option value="Active">Active Customers</option>
                  <option value="New">New Customers</option>
                  <option value="Inactive">Inactive Customers</option>
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
                  <option value="customers">Customer List</option>
                  <option value="segments">Segments</option>
                  <option value="trends">Trends</option>
                  <option value="behavior">Behavior</option>
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
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-600">{customerData.length}</p>
              </div>
              <FaUsers className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${customerData.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}
                </p>
              </div>
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(customerData.reduce((sum, customer) => sum + customer.averageOrderValue, 0) / customerData.length).toFixed(2)}
                </p>
              </div>
              <FaStar className="text-2xl text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(customerData.reduce((sum, customer) => sum + customer.customerRating, 0) / customerData.length).toFixed(1)}
                </p>
              </div>
              <FaHeart className="text-2xl text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Customer List */}
        {viewMode === "customers" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Details</h3>
            <div className="space-y-4">
              {filteredCustomers.map((customer, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{customer.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">${customer.totalSpent.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">{customer.totalVisits} visits</span>
                        <span className="text-sm text-gray-500">${customer.averageOrderValue.toFixed(2)} avg</span>
                        <span className="text-sm text-gray-500">{customer.loyaltyPoints} points</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">{getRatingStars(customer.customerRating)}</span>
                          <span className="text-sm text-gray-600">({customer.customerRating})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(customer.status)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getSpentPercentage(customer.totalSpent)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Segments */}
        {viewMode === "segments" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Segments</h3>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24 text-sm text-gray-600 font-medium">{segment.segment}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">{segment.count} customers</span>
                        <span className="text-sm text-gray-500">{segment.percentage.toFixed(1)}%</span>
                        <span className="text-sm text-gray-500">${segment.averageSpent.toFixed(2)} avg spent</span>
                        <span className="text-sm text-gray-500">{segment.averageVisits} avg visits</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${segment.color}`}
                        style={{ width: `${segment.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Trends */}
        {viewMode === "trends" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Growth Trends</h3>
            <div className="space-y-4">
              {customerTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 text-sm text-gray-600 font-medium">{trend.period}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">{trend.newCustomers} new</span>
                        <span className="text-sm text-gray-500">{trend.returningCustomers} returning</span>
                        <span className="text-sm text-gray-500">{trend.totalCustomers} total</span>
                        <div className="flex items-center gap-1">
                          {trend.growthRate > 0 ? (
                            <FaArrowUp className="text-green-500 text-xs" />
                          ) : (
                            <FaArrowDown className="text-red-500 text-xs" />
                          )}
                          <span className={`text-xs ${trend.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(trend.totalCustomers / Math.max(...customerTrends.map(t => t.totalCustomers))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Behavior */}
        {viewMode === "behavior" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Behavior Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerBehaviors.map((behavior, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{behavior.count}</span>
                    </div>
                    <h4 className="font-medium text-gray-800">{behavior.behavior}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Count</span>
                      <span className="font-medium">{behavior.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage</span>
                      <span className="font-medium">{behavior.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-600 text-xs">{behavior.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Charts */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Segments</h3>
              <div className="space-y-3">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{segment.segment}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${segment.color}`}
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{segment.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Growth</h3>
              <div className="space-y-3">
                {customerTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{trend.period}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(trend.totalCustomers / Math.max(...customerTrends.map(t => t.totalCustomers))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{trend.totalCustomers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Overview Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Visits</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Total Spent</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Avg Order</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Points</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Rating</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{customer.name}</td>
                    <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{customer.totalVisits}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">${customer.averageOrderValue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{customer.loyaltyPoints}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-yellow-500">{getRatingStars(customer.customerRating)}</span>
                        <span className="text-sm text-gray-600">({customer.customerRating})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
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

export default CustomerAnalyticsReport;
