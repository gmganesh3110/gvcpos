import React, { useState } from "react";
import { FaDesktop, FaClock, FaCheck, FaTimes, FaUtensils, FaBell } from "react-icons/fa";

interface KitchenOrder {
  id: number;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  items: KitchenItem[];
  orderTime: string;
  estimatedTime: number;
  status: "New" | "Preparing" | "Ready" | "Served";
  priority: "Normal" | "High" | "Urgent";
  server: string;
}

interface KitchenItem {
  id: number;
  name: string;
  quantity: number;
  specialInstructions: string;
  category: string;
  preparationTime: number;
  status: "Pending" | "Preparing" | "Ready";
}

const KitchenDisplay: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);

  // Hardcoded sample data
  const kitchenOrders: KitchenOrder[] = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      tableNumber: "T-05",
      customerName: "John Smith",
      orderTime: "14:30",
      estimatedTime: 20,
      status: "New",
      priority: "High",
      server: "Sarah Johnson",
      items: [
        {
          id: 1,
          name: "Grilled Chicken Breast",
          quantity: 1,
          specialInstructions: "Well done, no sauce",
          category: "Main Course",
          preparationTime: 15,
          status: "Pending"
        },
        {
          id: 2,
          name: "Caesar Salad",
          quantity: 1,
          specialInstructions: "Extra dressing on side",
          category: "Salad",
          preparationTime: 5,
          status: "Pending"
        }
      ]
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      tableNumber: "T-12",
      customerName: "Mike Wilson",
      orderTime: "14:25",
      estimatedTime: 15,
      status: "Preparing",
      priority: "Normal",
      server: "Tom Brown",
      items: [
        {
          id: 3,
          name: "Margherita Pizza",
          quantity: 1,
          specialInstructions: "Extra cheese",
          category: "Pizza",
          preparationTime: 12,
          status: "Preparing"
        }
      ]
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      tableNumber: "T-08",
      customerName: "Emily Davis",
      orderTime: "14:20",
      estimatedTime: 10,
      status: "Ready",
      priority: "Urgent",
      server: "Lisa Garcia",
      items: [
        {
          id: 4,
          name: "Fish and Chips",
          quantity: 1,
          specialInstructions: "No salt on chips",
          category: "Main Course",
          preparationTime: 10,
          status: "Ready"
        },
        {
          id: 5,
          name: "Coleslaw",
          quantity: 1,
          specialInstructions: "",
          category: "Side",
          preparationTime: 3,
          status: "Ready"
        }
      ]
    },
    {
      id: 4,
      orderNumber: "ORD-2024-004",
      tableNumber: "T-03",
      customerName: "David Brown",
      orderTime: "14:35",
      estimatedTime: 8,
      status: "New",
      priority: "Normal",
      server: "Sarah Johnson",
      items: [
        {
          id: 6,
          name: "Chicken Burger",
          quantity: 1,
          specialInstructions: "No pickles",
          category: "Burger",
          preparationTime: 8,
          status: "Pending"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-red-100 text-red-800 border-red-200";
      case "Preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready": return "bg-green-100 text-green-800 border-green-200";
      case "Served": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Normal": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-gray-100 text-gray-800";
      case "Preparing": return "bg-yellow-100 text-yellow-800";
      case "Ready": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (minutes: number) => {
    return `${minutes} min`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaDesktop className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Kitchen Display</h1>
          </div>
          <p className="text-gray-600">Monitor and manage kitchen orders in real-time</p>
        </div>

        {/* Kitchen Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {kitchenOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                order.priority === "Urgent" ? "border-red-500" :
                order.priority === "High" ? "border-orange-500" : "border-green-500"
              } hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => setSelectedOrder(order)}
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">Table: {order.tableNumber}</p>
                  <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                    {order.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <span>Ordered: {order.orderTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUtensils className="text-gray-400" />
                  <span>Est: {formatTime(order.estimatedTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBell className="text-gray-400" />
                  <span>Server: {order.server}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Items: {order.items.length}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getItemStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    {item.specialInstructions && (
                      <p className="text-xs text-orange-600 italic">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{item.category}</span>
                      <span className="text-xs text-gray-500">{formatTime(item.preparationTime)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {order.status === "New" && (
                  <button className="flex-1 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-600 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors">
                    <FaUtensils />
                    Start Preparing
                  </button>
                )}
                {order.status === "Preparing" && (
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-600 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    <FaCheck />
                    Mark Ready
                  </button>
                )}
                {order.status === "Ready" && (
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    <FaCheck />
                    Mark Served
                  </button>
                )}
                <button className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                  <FaTimes />
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
                <p className="text-sm text-gray-600">New Orders</p>
                <p className="text-2xl font-bold text-red-600">
                  {kitchenOrders.filter(order => order.status === "New").length}
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
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {kitchenOrders.filter(order => order.status === "Preparing").length}
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
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-green-600">
                  {kitchenOrders.filter(order => order.status === "Ready").length}
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
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{kitchenOrders.length}</p>
              </div>
              <FaDesktop className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplay;
