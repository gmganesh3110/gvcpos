import React, { useEffect, useState } from "react";
import { postAxios } from "../../services/AxiosService";
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
const gradientColors = [
  "from-pink-100 to-pink-200 text-pink-900",
  "from-purple-100 to-purple-200 text-purple-900",
  "from-green-100 to-green-200 text-green-900",
  "from-yellow-100 to-yellow-200 text-yellow-900",
  "from-blue-100 to-blue-200 text-blue-900",
  "from-indigo-100 to-indigo-200 text-indigo-900",
  "from-red-100 to-red-200 text-red-900",
  "from-teal-100 to-teal-200 text-teal-900",
];
const limit = 5;
const getRandomGradient = () =>
  gradientColors[Math.floor(Math.random() * gradientColors.length)];
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
  const filteredItems = selectedCategory
    ? items.filter((i: any) => i.categoryId === selectedCategory)
    : items;

  useEffect(() => {
    setTotal(order.reduce((sum, item) => sum + item.price * item.qty, 0));
  }, [order]);
  const fetchCategories = async () => {
    try {
      const response: any = await postAxios("/categories/getall", {
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
    try {
      const response: any = await postAxios("/items/getall", {
        categoryId: selectedCategory,
        start: 0,
        limit: 50,
      });
      const data: any = response.data[0];
      setItems(data);
    } catch (error) {
      console.error("Error fetching filtered items:", error);
    }
  };
  useEffect(() => {
    fetchFilteredItems();
  }, [selectedCategory, newOrder]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response: any = await postAxios("/orders/getallorders", {
        orderId: searchOrderId || 0,
        fromDate: fromDate ? moment(fromDate).format("YYYY-MM-DD") : null,
        toDate: toDate ? moment(toDate).format("YYYY-MM-DD") : null,
        orderType: orderType || null,
        orderStatus: orderStatus || null,
        start: (page - 1) * limit,
        limit: limit,
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
      status: OrderStatus.ORDERED,
      type: OrderType.TAKEAWAY,
      isPaid: isPaid,
      paymentMethod: paymentMethod,
      createdBy: User.id,
      items: order.map((item) => ({
        id: item.id,
        quantity: item.qty,
        price: item.price,
      })),
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

  const handleGetOrderDetails = async (orderId: number) => {
    const res: any = await postAxios("/orders/getorderdetails", { orderId });
    const rawItems = res.data[0]; // array of items
    if (rawItems.length > 0) {
      const orderSummary = {
        orderId: rawItems[0].orderid,
        total: Number(rawItems[0].totalAmount),
        type: rawItems[0].type,
        isPaid: rawItems[0].isPaid === 1,
        paymentMethod: rawItems[0].paymentMode,
        items: rawItems.map((row: any) => ({
          id: row.itemid,
          name: row.name,
          price: Number(row.price),
          qty: row.quantity,
        })),
      };
      setExistingOrder(true);
      setExistingOrderData(orderSummary);
    }
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Orders</h2>
        <button
          onClick={() => setNewOrder(true)}
          className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center gap-2 hover:bg-orange-600 cursor-pointer"
        >
          <FiPlus /> New Order
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Id */}
          <input
            type="text"
            placeholder="Search OrderId"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            value={searchOrderId!}
            onChange={(e) => setSearchOrderId(e.target.value)}
          />

          {/* From Date */}
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholderText="From Date"
          />

          {/* To Date */}
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholderText="To Date"
          />

          {/* Order Type */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            value={orderType!}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option value="">Select Order Type</option>
            <option value="TAKEAWAY">Takeaway</option>
            <option value="DINEIN">Dining</option>
          </select>

          {/* Order Status */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            value={orderStatus!}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="">Select Order Status</option>
            <option value="ORDERED">Ordered</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center justify-center gap-2 hover:bg-orange-600 w-full"
          >
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto pb-4 px-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border rounded-lg border-gray-300">
              <table className="table-auto min-w-full rounded-xl">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Id
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Time
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Total Amount
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Paid
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {orders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="transition-all duration-500 hover:bg-gray-50"
                    >
                      {/* Id */}
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      {/* Date */}
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {moment(order.date).format("DD/MM/YYYY")}
                      </td>
                      {/* Time */}
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {moment(order.time, "HH:mm:ss").format("hh:mm A")}
                      </td>

                      {/* Total */}
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {order.totalAmount}
                      </td>

                      {/* Type */}
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {order.type}
                      </td>

                      {/* Paid */}
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </td>

                      {/* Status */}
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {order.status}
                      </td>

                      {/* Actions */}
                      <td className="flex p-5 gap-2">
                        <button
                          onClick={() => handleGetOrderDetails(order.id)}
                          className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-orange-500 cursor-pointer"
                        >
                          <HiEye className="w-5 h-5 text-indigo-500 hover:text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 px-6">
        <div className="text-sm text-gray-700">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount} results
        </div>
        <nav className="inline-flex shadow-sm" aria-label="Pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-2 border text-sm font-medium cursor-pointer rounded-l-md ${
              page === 1
                ? "bg-gray-200 text-gray-500"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 border-t border-b text-sm cursor-pointer font-medium ${
                page === i + 1
                  ? "bg-orange-500 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-2 border text-sm font-medium cursor-pointer rounded-r-md ${
              page === totalPages
                ? "bg-gray-200 text-gray-500"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </nav>
      </div>

      {newOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[95%] h-[90%] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-green-500 to-green-600 text-white">
              <h1 className="text-2xl font-bold">🛒 New Order</h1>
              <button
                onClick={() => setNewOrder(false)}
                className="text-white hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Side */}
              <div className="w-[70%] flex flex-col border-r">
                {/* Categories */}
                <div className="h-[40%] p-4 grid grid-cols-4 gap-4 overflow-y-auto">
                  {categories.map((cat: any) => (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-xl shadow bg-gradient-to-br ${getRandomGradient()} cursor-pointer hover:scale-105 transition transform hover:shadow-lg`}
                      onClick={() => onCardClick(cat.id)}
                    >
                      <p className="font-semibold text-center">
                        {cat.category}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Items */}
                <div className="h-[60%] p-4 grid grid-cols-4 gap-4 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl shadow bg-gradient-to-br ${getRandomGradient()} cursor-pointer hover:scale-105 transition transform hover:shadow-md`}
                      onClick={() => handleAddItem(item)}
                    >
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm mt-1">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right Side */}
              <div className="w-[30%] bg-gray-50">
                <div className="h-full p-4 flex flex-col">
                  <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                  {/* Order Items */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {order.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={() => handleDecrease(item.id)}
                          >
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            onClick={() => handleIncrease(item.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Payment Options */}
                  <div className="mt-4 border-t pt-4 space-y-4">
                    {/* Is Paid Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPaid"
                        checked={isPaid}
                        onChange={(e) => setIsPaid(e.target.checked)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label
                        htmlFor="isPaid"
                        className="text-gray-700 font-medium"
                      >
                        Is Paid?
                      </label>
                    </div>
                    {/* Payment Method Dropdown */}
                    {isPaid && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod!}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Payment Method</option>
                          <option value={PaymentMode.ONLINE}>Online</option>
                          <option value={PaymentMode.CASH}>Cash</option>
                          <option value={PaymentMode.CARD}>Card</option>
                          <option value={PaymentMode.UPI}>UPI</option>
                        </select>
                      </div>
                    )}
                  </div>
                  {/* Total & Button */}
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center mb-4 text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">₹{total}</span>
                    </div>
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-200"
                      onClick={handlePlaceOrder}
                    >
                      ✅ Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {existingOrder && existingOrderData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[95%] h-[90%] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-green-500 to-green-600 text-white">
              <h1 className="text-2xl font-bold">📦 Order Details</h1>
              <button
                onClick={() => setExistingOrder(false)}
                className="text-white hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Side (Categories + Items) */}
              <div className="w-[70%] flex flex-col border-r">
                {/* Categories */}
                <div className="h-[40%] p-4 grid grid-cols-4 gap-4 overflow-y-auto">
                  {categories?.map((cat: any) => (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-xl shadow bg-gradient-to-br ${getRandomGradient()} cursor-not-allowed opacity-70`}
                    >
                      <p className="font-semibold text-center">
                        {cat.category}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Items */}
                <div className="h-[60%] p-4 grid grid-cols-4 gap-4 overflow-y-auto">
                  {existingOrderData.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl shadow bg-gradient-to-br ${getRandomGradient()} cursor-not-allowed opacity-70`}
                    >
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm mt-1">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right Side (Order Summary) */}
              <div className="w-[30%] bg-gray-50 flex flex-col">
                <div className="flex-1 p-4 flex flex-col min-h-0">
                  <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                  {/* Order Items */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {existingOrderData.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            ₹{item.price} × {item.qty}
                          </p>
                        </div>
                        <div className="font-semibold text-gray-800">
                          ₹{item.price * item.qty}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Payment Info */}
                  <div className="mt-4 border-t pt-4 space-y-4">
                    {/* Paid Checkbox */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPaid"
                        checked={existingOrderData.isPaid}
                        onChange={(e) =>
                          setExistingOrderData((prev: any) => ({
                            ...prev,
                            isPaid: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="isPaid" className="text-sm font-medium">
                        Paid
                      </label>
                    </div>
                    {/* Payment Method Dropdown */}
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Payment Method
                      </label>
                      <select
                        value={existingOrderData.paymentMethod || ""}
                        onChange={(e) =>
                          setExistingOrderData((prev: any) => ({
                            ...prev,
                            paymentMethod: e.target.value,
                          }))
                        }
                        className="w-full border rounded-lg p-2 text-sm"
                      >
                        <option value="">Select Method</option>
                        <option value="CASH">Cash</option>
                        <option value="CARD">Card</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </div>
                  </div>
                  {/* Total */}
                  <div className="mt-4 border-t pt-4 flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      ₹{existingOrderData.total}
                    </span>
                  </div>
                </div>
                {/* Footer Buttons */}
                <div className="p-4 border-t flex justify-end space-x-3 bg-white">
                  <button
                    onClick={() => setExistingOrder(false)}
                    className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateOrder}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Update
                  </button>
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
