import { useState } from "react";

export default function Dashboard() {
  const [orders] = useState([
    { id: "ORD123", customer: "John Doe", item: "Margherita Pizza", amount: 450, status: "Completed" },
    { id: "ORD124", customer: "Jane Smith", item: "Pasta Alfredo", amount: 320, status: "Pending" },
    { id: "ORD125", customer: "Rahul Kumar", item: "Veg Burger", amount: 180, status: "Completed" },
    { id: "ORD126", customer: "Emily Davis", item: "Chicken Biryani", amount: 550, status: "Completed" },
  ]);


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurant Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">Total Orders Today</h2>
          <p className="text-2xl font-bold text-gray-800">124</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">Total Revenue</h2>
          <p className="text-2xl font-bold text-gray-800">₹ 58,320</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">Most Ordered Item</h2>
          <p className="text-2xl font-bold text-gray-800">Margherita Pizza</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">Average Order Value</h2>
          <p className="text-2xl font-bold text-gray-800">₹ 470</p>
        </div>
      </div>


      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition">Add New Order</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition">Inventory</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition">Reports</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition">Expenses</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition">User Management</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition">Sales</button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition">
            View All
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600 font-medium">Order ID</th>
              <th className="p-4 text-gray-600 font-medium">Customer</th>
              <th className="p-4 text-gray-600 font-medium">Item</th>
              <th className="p-4 text-gray-600 font-medium">Amount</th>
              <th className="p-4 text-gray-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-gray-700">{order.id}</td>
                <td className="p-4 text-gray-700">{order.customer}</td>
                <td className="p-4 text-gray-700">{order.item}</td>
                <td className="p-4 text-gray-700">₹ {order.amount}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
