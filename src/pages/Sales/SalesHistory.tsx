import React, { useState } from "react";
import { FaHistory, FaSearch, FaFilter, FaEye, FaPrint, FaDownload } from "react-icons/fa";

interface Sale {
  id: number;
  orderNumber: string;
  customerName: string;
  tableNumber: string;
  items: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "Cash" | "Card" | "Digital";
  status: "Completed" | "Pending" | "Cancelled";
  date: string;
  time: string;
  server: string;
}

const SalesHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  // Hardcoded sample data
  const salesData: Sale[] = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      customerName: "John Smith",
      tableNumber: "T-05",
      items: 3,
      subtotal: 45.50,
      tax: 4.55,
      discount: 5.00,
      total: 45.05,
      paymentMethod: "Card",
      status: "Completed",
      date: "2024-01-15",
      time: "14:30",
      server: "Sarah Johnson"
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      customerName: "Mike Wilson",
      tableNumber: "T-12",
      items: 2,
      subtotal: 28.75,
      tax: 2.88,
      discount: 0.00,
      total: 31.63,
      paymentMethod: "Cash",
      status: "Completed",
      date: "2024-01-15",
      time: "13:45",
      server: "Tom Brown"
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      customerName: "Emily Davis",
      tableNumber: "T-08",
      items: 4,
      subtotal: 67.20,
      tax: 6.72,
      discount: 10.00,
      total: 63.92,
      paymentMethod: "Digital",
      status: "Completed",
      date: "2024-01-15",
      time: "12:15",
      server: "Lisa Garcia"
    },
    {
      id: 4,
      orderNumber: "ORD-2024-004",
      customerName: "David Brown",
      tableNumber: "T-03",
      items: 1,
      subtotal: 15.99,
      tax: 1.60,
      discount: 0.00,
      total: 17.59,
      paymentMethod: "Card",
      status: "Pending",
      date: "2024-01-15",
      time: "16:20",
      server: "Sarah Johnson"
    },
    {
      id: 5,
      orderNumber: "ORD-2024-005",
      customerName: "Anna Taylor",
      tableNumber: "T-15",
      items: 5,
      subtotal: 89.45,
      tax: 8.95,
      discount: 15.00,
      total: 83.40,
      paymentMethod: "Digital",
      status: "Completed",
      date: "2024-01-14",
      time: "19:30",
      server: "Mike Johnson"
    },
    {
      id: 6,
      orderNumber: "ORD-2024-006",
      customerName: "Robert Lee",
      tableNumber: "T-07",
      items: 2,
      subtotal: 32.10,
      tax: 3.21,
      discount: 0.00,
      total: 35.31,
      paymentMethod: "Cash",
      status: "Cancelled",
      date: "2024-01-14",
      time: "18:45",
      server: "Tom Brown"
    }
  ];

  const statuses = ["all", "Completed", "Pending", "Cancelled"];
  const paymentMethods = ["all", "Cash", "Card", "Digital"];
  const dateRanges = ["today", "yesterday", "week", "month"];

  const filteredData = salesData.filter(sale => {
    const matchesSearch = sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
    const matchesPayment = filterPayment === "all" || sale.paymentMethod === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-100";
      case "Pending": return "text-yellow-600 bg-yellow-100";
      case "Cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "Cash": return "💵";
      case "Card": return "💳";
      case "Digital": return "📱";
      default: return "💰";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaHistory className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Sales History</h1>
          </div>
          <p className="text-gray-600">View and manage all sales transactions and orders</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </option>
                  ))}
                </select>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>
                      {method === "all" ? "All Payment" : method}
                    </option>
                  ))}
                </select>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dateRanges.map(range => (
                    <option key={range} value={range}>
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </option>
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

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sale.orderNumber}</div>
                        <div className="text-sm text-gray-500">Table: {sale.tableNumber}</div>
                        <div className="text-sm text-gray-500">Server: {sale.server}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{sale.items} items</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">${sale.total.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          Sub: ${sale.subtotal.toFixed(2)} | Tax: ${sale.tax.toFixed(2)}
                          {sale.discount > 0 && ` | Disc: -$${sale.discount.toFixed(2)}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPaymentIcon(sale.paymentMethod)}</span>
                        <span className="text-sm text-gray-900">{sale.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.date}</div>
                      <div className="text-sm text-gray-500">{sale.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <FaEye />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <FaPrint />
                        </button>
                      </div>
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
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{salesData.length}</p>
              </div>
              <FaHistory className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {salesData.filter(sale => sale.status === "Completed").length}
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
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${salesData.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(salesData.reduce((sum, sale) => sum + sale.total, 0) / salesData.length).toFixed(2)}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
