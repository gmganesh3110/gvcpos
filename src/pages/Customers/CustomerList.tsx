import React, { useState } from "react";
import { FaUsers, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "Active" | "Inactive" | "VIP";
  loyaltyPoints: number;
  joinDate: string;
}

const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Hardcoded sample data
  const customersData: Customer[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street",
      city: "New York",
      totalOrders: 25,
      totalSpent: 1250.75,
      lastOrder: "2024-01-14",
      status: "VIP",
      loyaltyPoints: 1250,
      joinDate: "2023-06-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Avenue",
      city: "Los Angeles",
      totalOrders: 18,
      totalSpent: 890.50,
      lastOrder: "2024-01-12",
      status: "Active",
      loyaltyPoints: 890,
      joinDate: "2023-08-22"
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine Road",
      city: "Chicago",
      totalOrders: 8,
      totalSpent: 320.25,
      lastOrder: "2024-01-08",
      status: "Active",
      loyaltyPoints: 320,
      joinDate: "2023-11-10"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 456-7890",
      address: "321 Elm Street",
      city: "Houston",
      totalOrders: 3,
      totalSpent: 95.80,
      lastOrder: "2023-12-20",
      status: "Inactive",
      loyaltyPoints: 95,
      joinDate: "2023-12-01"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 (555) 567-8901",
      address: "654 Maple Drive",
      city: "Phoenix",
      totalOrders: 42,
      totalSpent: 2100.00,
      lastOrder: "2024-01-15",
      status: "VIP",
      loyaltyPoints: 2100,
      joinDate: "2023-03-05"
    }
  ];

  const statuses = ["all", "Active", "Inactive", "VIP"];

  const filteredData = customersData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-green-600 bg-green-100";
      case "Inactive": return "text-gray-600 bg-gray-100";
      case "VIP": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Customer List</h1>
          </div>
          <p className="text-gray-600">Manage your customer database and track customer information</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
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
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              Add Customer
            </button>
          </div>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                    <FaEdit />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaEnvelope className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaPhone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{customer.address}, {customer.city}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Orders</p>
                    <p className="font-semibold text-gray-800">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Spent</p>
                    <p className="font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Loyalty Points</p>
                    <p className="font-semibold text-purple-600">{customer.loyaltyPoints}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Order</p>
                    <p className="font-semibold text-gray-800">{customer.lastOrder}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">Member since: {customer.joinDate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-800">{customersData.length}</p>
              </div>
              <FaUsers className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">
                  {customersData.filter(customer => customer.status === "Active").length}
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
                <p className="text-sm text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {customersData.filter(customer => customer.status === "VIP").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${customersData.reduce((sum, customer) => sum + customer.totalSpent, 0).toFixed(2)}
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

export default CustomerList;
