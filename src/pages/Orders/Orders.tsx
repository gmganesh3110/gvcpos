import React, { useEffect, useState } from "react";
import { getAxios, postAxios } from "../../services/AxiosService";
import { useSelector } from "react-redux";
import { PaymentMode } from "../../constants/Paymodes";
import { OrderStatus } from "../../constants/OrderStatus";
import { OrderType } from "../../constants/OrderTypes";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { HiEye } from "react-icons/hi";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NewOrderModal from "../../components/POS/NewOrderModal";
const limit = 5;
const OrdersComponent: React.FC = () => {
  const today = new Date();
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newOrder, setNewOrder] = useState(false);
  const [existingOrder, setExistingOrder] = useState(false);
  const [existingOrderData, setExistingOrderData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [order, setOrder] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [searchOrderId, setSearchOrderId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(totalCount / limit);
  const [fromDate, setFromDate] = useState<Date | null>(today);
  const [toDate, setToDate] = useState<Date | null>(today);
  const [orderType, setOrderType] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const User = useSelector((state: any) => state.auth.user);
  const [itemsLoading, setItemsLoading] = useState<boolean>(false);
  const filteredItems = selectedCategory
    ? items.filter((i: any) => i.categoryId === selectedCategory)
    : items;

  useEffect(() => {
    setTotal(order.reduce((sum, item) => sum + item.price * item.qty, 0));
  }, [order]);
  const fetchCategories = async () => {
    try {
      const response: any = await getAxios("/categories/getall", {
        categoryId: selectedCategory,
        start: 0,
        limit: 50,
      });
      const data = response.data[0];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [newOrder]);

  const fetchFilteredItems = async () => {
    setItemsLoading(true);
    try {
      const response: any = await getAxios("/items/getall", {
        categoryId: selectedCategory,
        start: 0,
        limit: 50,
      });
      const data: any = response.data[0];
      setItems(data);
    } catch (error) {
      console.error("Error fetching filtered items:", error);
    } finally {
      setItemsLoading(false);
    }
  };
  useEffect(() => {
    fetchFilteredItems();
  }, [selectedCategory, newOrder]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response: any = await getAxios("/orders/getallorders", {
        orderId: searchOrderId || 0,
        fromDate: fromDate ? moment(fromDate).format("YYYY-MM-DD") : null,
        toDate: toDate ? moment(toDate).format("YYYY-MM-DD") : null,
        orderType: orderType || null,
        orderStatus: orderStatus || null,
        start: (page - 1) * limit,
        limit: limit,
        restuarent: User.restuarent,
      });

      const data = response.data[0];
      setOrders(data);
      setTotalCount(response.data[1][0].tot);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, searchOrderId]);

  const handleUpdateOrder = async () => {
    try {
      await postAxios("/orders/updateorder", {
        orderId: existingOrderData.orderId,
        isPaid: existingOrderData.isPaid,
        paymentMode: existingOrderData.paymentMethod,
        modifiedBy: User.id,
        status: OrderStatus.COMPLETED,
      });
      setExistingOrder(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const onCardClick = (id: number) => {
    setSelectedCategory(id);
  };

  const handleAddItem = (item: any) => {
    setOrder((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleIncrease = (id: number) => {
    setOrder((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  };
  const handleDecrease = (id: number) => {
    setOrder((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const handlePlaceOrder = async () => {
    let orderData = {
      totalAmount: total,
      status: OrderStatus.COMPLETED,
      type: OrderType.TAKEAWAY,
      isPaid: isPaid,
      paymentMethod: paymentMethod,
      createdBy: User.id,
      items: order.map((item) => ({
        id: item.id,
        quantity: item.qty,
        price: item.price,
      })),
      restuarent: User.restuarent,
    };
    const res = await postAxios("/orders/createorder", orderData);
    if (res) {
      fetchOrders();
      setNewOrder(false);
    }
  };

  const handleSearch = () => {
    fetchOrders();
  };
  const updateSaveAndPrint = async () => {
    try {
      await postAxios("/orders/updateorder", {
        orderId: existingOrderData.id,
        isPaid: existingOrderData.isPaid,
        paymentMode: existingOrderData.paymentMethod,
        modifiedBy: User.id,
        status: OrderStatus.COMPLETED,
        totalAmount: existingOrderData.totalAmount,
        restuarent: User.restuarent,
      });
      setExistingOrder(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetOrderDetails = async (orderId: number) => {
    const res: any = await getAxios("/orders/getorderdetails", {
      orderId,
      restuarent: User.restuarent,
    });
    // The API now returns the order items directly
    const orderItems = res.data || [];
    const orderData = {
      id: orderId,
      orderitems: orderItems,
      totalAmount: orderItems.reduce(
        (sum: number, item: any) =>
          sum + parseFloat(item.price) * item.quantity,
        0
      ),
      status: orderItems[0].status,
    };
    setExistingOrderData(orderData);
    setExistingOrder(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📋 Orders Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track all your orders efficiently
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Live Updates
                </span>
              </div>
            </div>
            <button
              onClick={() => setNewOrder(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <FiPlus className="text-lg" />
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Modern Search & Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
            <span className="text-xl">🔍</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Search & Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Order ID Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Order ID
            </label>
            <input
              type="text"
              placeholder="Search by Order ID"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              value={searchOrderId!}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />
          </div>

          {/* From Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              From Date
            </label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholderText="Select from date"
            />
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To Date</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholderText="Select to date"
            />
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Order Type
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              value={orderType!}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <option value="">All Order Types</option>
              <option value="TAKEAWAY">🥡 Takeaway</option>
              <option value="DINEIN">🍽️ Dining</option>
            </select>
          </div>

          {/* Order Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Order Status
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              value={orderStatus!}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ORDERED">📝 Ordered</option>
              <option value="COMPLETED">✅ Completed</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-transparent">
              Search
            </label>
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              Search Orders
            </button>
          </div>
        </div>
      </div>

      {/* Modern Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
              <span className="text-xl">📊</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Orders List</h2>
            <div className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
              {totalCount} Total Orders
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  >
                    {/* Order ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          #{order.id}
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {moment(order.date).format("DD/MM/YYYY")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {moment(order.time, "HH:mm:ss").format("hh:mm A")}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">
                        ₹{order.totalAmount}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.type === "DINEIN"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {order.type === "DINEIN" ? "🍽️ Dine In" : "🥡 Takeaway"}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.isPaid ? "✅ Paid" : "❌ Not Paid"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "ORDERED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === "COMPLETED"
                          ? "✅ Completed"
                          : order.status === "ORDERED"
                          ? "📝 Ordered"
                          : order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleGetOrderDetails(order.id)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-2 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <HiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Pagination */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalCount)}
            </span>
            <span className="mx-2">of</span>
            <span className="font-bold text-blue-600">{totalCount}</span>
            <span className="ml-2">results</span>
          </div>

          <nav className="flex items-center space-x-2" aria-label="Pagination">
            {/* Previous Button */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
              }`}
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {(() => {
                const pages: (number | string)[] = [];
                const showRange = 2;

                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (page > showRange + 2) pages.push("...");
                  for (
                    let i = Math.max(2, page - showRange);
                    i <= Math.min(totalPages - 1, page + showRange);
                    i++
                  ) {
                    pages.push(i);
                  }
                  if (page < totalPages - (showRange + 1)) pages.push("...");
                  pages.push(totalPages);
                }

                return pages.map((p, i) =>
                  p === "..." ? (
                    <span key={i} className="px-3 py-2 text-sm text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setPage(p as number)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        page === p
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                      }`}
                    >
                      {p}
                    </button>
                  )
                );
              })()}
            </div>

            {/* Next Button */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
              }`}
            >
              Next →
            </button>
          </nav>
        </div>
      </div>

      <NewOrderModal
        isOpen={newOrder}
        onClose={() => setNewOrder(false)}
        onSubmit={handlePlaceOrder}
        categories={categories}
        items={filteredItems}
        itemsLoading={itemsLoading}
        onCategorySelect={onCardClick}
        onItemAdd={handleAddItem}
        onItemIncrease={handleIncrease}
        onItemDecrease={handleDecrease}
        selectedCategory={selectedCategory}
        order={order}
        total={total}
        orderType="TAKEAWAY"
      />
      {existingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-7xl h-[95%] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">View Order</h1>
                    <p className="text-green-100 text-sm">
                      Order #{existingOrderData?.orderId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExistingOrder(false)}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Side - Categories */}
              <div className="w-[20%] border-r bg-gray-50">
                <div className="h-full p-4 grid grid-cols-1 gap-4 overflow-y-auto">
                  {categories.map((cat: any) => (
                    <div
                      key={cat.id}
                      className="p-4 rounded-xl shadow-sm cursor-pointer hover:scale-105 transition bg-white hover:shadow-md"
                      onClick={() => onCardClick(cat.id)}
                    >
                      <p className="font-semibold text-gray-800 text-center">
                        {cat.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle - Items */}
              <div className="w-[50%] border-r bg-gray-50">
                <div className="h-full p-4 grid grid-cols-3 gap-4 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl shadow-sm bg-white cursor-pointer hover:scale-105 transition hover:shadow-md"
                      onClick={() => handleAddItem(item)}
                    >
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        )}
                      </div>
                      <p className="font-medium mt-2">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Order Summary */}
              <div className="w-[30%] bg-gray-50">
                <div className="h-full p-4 flex flex-col">
                  <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                  {/* Order Items */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {existingOrderData.orderitems.map((item: any) => (
                      <div
                        key={item.item.id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md border"
                      >
                        <div>
                          <p className="font-medium">{item.item.name}</p>
                          <p className="text-sm text-gray-500">
                            ₹{item.item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={() => handleDecrease(item.item.id)}
                          >
                            -
                          </button>
                          <span className="min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            onClick={() => handleIncrease(item.item.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkboxes & Payment */}
                  <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isPaid}
                        onChange={(e) => setIsPaid(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>Paid</span>
                    </label>

                    <div>
                      <select
                        className="w-full border rounded-lg p-2"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value={PaymentMode.CASH}>Cash</option>
                        <option value={PaymentMode.CARD}>Card</option>
                        <option value={PaymentMode.UPI}>UPI</option>
                        <option value={PaymentMode.ONLINE}>Online</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={() =>
                          setOrderStatus(
                            existingOrderData.status == OrderStatus.INPROGRESS
                              ? OrderStatus.BILLED
                              : OrderStatus.COMPLETED
                          )
                        }
                        value={orderStatus || undefined}
                      />
                      <span>
                        {existingOrderData.status == OrderStatus.INPROGRESS
                          ? OrderStatus.BILLED
                          : OrderStatus.COMPLETED}
                      </span>
                    </label>
                  </div>

                  {/* Total & Buttons */}
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">₹{total}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold shadow"
                        onClick={handleUpdateOrder}
                      >
                        💾 Save
                      </button>
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold shadow"
                        onClick={updateSaveAndPrint}
                      >
                        🖨 Save & Print
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersComponent;
