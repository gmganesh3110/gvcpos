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
      const data = response.data.data;
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
      const data: any = response.data.data;
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
      });
      const data = response.data.data;
      setOrders(data);
      setTotalCount(response.data.total);
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
        quantity: item.quantity,
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
  const updateSaveAndPrint = async () => {
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

  const handleGetOrderDetails = async (orderId: number) => {
    const res: any = await postAxios("/orders/getorderdetails", { orderId });

    setExistingOrder(true);
    setExistingOrderData(res.data);
  };
  const handleSaveAndPrint = async () => {};
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Orders</h2>
        <button
          onClick={() => setNewOrder(true)}
          className="px-4 py-2 rounded-md bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
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
            className="px-4 py-2 rounded-md bg-blue-500 text-white flex items-center justify-center gap-2 hover:bg-blue-600 w-full"
          >
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="flex justify-center items-center h-120">
          <Loader />
        </div>
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
                          className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-blue-500 cursor-pointer"
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
          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-2 border text-sm font-medium rounded-l-md ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {(() => {
            const pages: (number | string)[] = [];
            const showRange = 2; // how many pages around current

            if (totalPages <= 7) {
              // show all if small
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1); // first page

              if (page > showRange + 2) pages.push("..."); // left dots

              for (
                let i = Math.max(2, page - showRange);
                i <= Math.min(totalPages - 1, page + showRange);
                i++
              ) {
                pages.push(i);
              }

              if (page < totalPages - (showRange + 1)) pages.push("..."); // right dots

              pages.push(totalPages); // last page
            }

            return pages.map((p, i) =>
              p === "..." ? (
                <span
                  key={i}
                  className="px-3 py-2 border-t border-b text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={i}
                  onClick={() => setPage(p as number)}
                  className={`px-3 py-2 border-t border-b text-sm font-medium ${
                    page === p
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-2 border text-sm font-medium rounded-r-md ${
              page === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r bg-gray-200 text-white">
              <h1 className="text-2xl text-blue-500 font-bold">🛒 New Order</h1>
              <button
                onClick={() => setNewOrder(false)}
                className="text-black hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div className="flex flex-1 overflow-hidden bg-gray-200">
              {/* Left Side */}
              <div className="w-[20%] grid  border-r bg-gray-200">
                <div className="h-[100%] p-4 grid grid-cols-1 gap-4 overflow-y-auto">
                  {categories.map((cat: any) => (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-xl shadow  cursor-pointer hover:scale-105 transition transform hover:shadow-lg bg-gray-100`}
                      onClick={() => onCardClick(cat.id)}
                    >
                      <p className="font-semibold text-black text-center">
                        {cat.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[50%] flex  border-r bg-gray-200">
                {/* Categories */}
                {/* Items */}
                {itemsLoading ? (
                  <div className="flex w-full items-center justify-between h-full">
                    <Loader />
                  </div>
                ) : (
                  <div className="h-[100%] p-4 grid grid-cols-3 gap-4 overflow-y-auto">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl shadow bg-gradient-to-br cursor-pointer hover:scale-105 transition transform hover:shadow-md bg-gray-100`}
                        onClick={() => handleAddItem(item)}
                      >
                        <div className="relative w-full h-32 bg-gradient-to-br rounded-t-3xl overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No Image
                            </span>
                          )}
                        </div>

                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm mt-1">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                )}
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
                  {/* Total & Buttons */}
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center mb-4 text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">₹{total}</span>
                    </div>

                    {/* New Buttons Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
                        onClick={handlePlaceOrder}
                      >
                        💾 Save
                      </button>
                      <button
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
                        onClick={handleSaveAndPrint}
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
      {existingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[95%] h-[90%] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-500 to-blue-600">
              <h1 className="text-2xl text-white font-bold flex items-center gap-2">
                🛒 View Order
              </h1>
              <button
                onClick={() => setExistingOrder(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
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
                          <p className="text-sm text-gray-500">₹{item.item.price}</p>
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
