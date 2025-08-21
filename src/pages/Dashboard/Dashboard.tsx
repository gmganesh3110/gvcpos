import { useEffect, useState } from "react";
import { OrderStatus } from "../../constants/OrderStatus";
import { OrderType } from "../../constants/OrderTypes";
import { postAxios } from "../../services/AxiosService";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { PaymentMode } from "../../constants/Paymodes";
interface TableData {
  blockId: number;
  blockName: string;
  tableId: number;
  tableName: string;
  orderId: number | null;
  status: OrderStatus | null;
  type: OrderType | null;
  totalAmount?: number;
  guests?: number;
  elapsedTime?: string;
}
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
const getRandomGradient = () =>
  gradientColors[Math.floor(Math.random() * gradientColors.length)];
const Dashboard = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [order, setOrder] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [existingOrder, setExistingOrder] = useState(false);
  const [existingOrderData, setExistingOrderData] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<"ORDERED" | null>(null);
  const User = useSelector((state: any) => state.auth.user);
  const filteredItems = selectedCategory
    ? items.filter((i) => i.categoryId === selectedCategory)
    : items;
  useEffect(() => {
    fetchTables();
  }, []);
  const fetchTables = async () => {
    try {
      setLoading(true);
      const response: any = await postAxios(
        "/orders/getblocksandtableswithorders"
      );
      const data = response.data;
      // Transform the data to include mock values for demo
      const transformedTables = data[0].map((table: TableData) => ({
        ...table,
        totalAmount: table.totalAmount,
        guests: table.orderId ? Math.floor(Math.random() * 6) + 1 : 0,
        elapsedTime: table.orderId
          ? `${Math.floor(Math.random() * 30)}:${Math.floor(Math.random() * 60)
              .toString()
              .padStart(2, "0")}`
          : null,
      }));
      setLoading(false);
      setTables(transformedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };
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
  const getStatusConfig = (status: OrderStatus | null) => {
    switch (status) {
      case OrderStatus.ORDERED:
        return { bg: "bg-blue-50", text: "text-blue-600", label: "Ordered" };
      case OrderStatus.PREPARING:
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          label: "Preparing",
        };
      case OrderStatus.READY:
        return { bg: "bg-green-50", text: "text-green-600", label: "Ready" };
      case OrderStatus.SERVED:
        return { bg: "bg-purple-50", text: "text-purple-600", label: "Served" };
      case OrderStatus.COMPLETED:
        return { bg: "bg-gray-50", text: "text-gray-600", label: "Completed" };
      default:
        return {
          bg: "bg-orange-100",
          text: "text-blue-500",
          label: "Available",
        };
    }
  };
  const onCardClick = (id: number) => {
    setSelectedCategory(id);
  };
  useEffect(() => {
    setTotal(order.reduce((sum, item) => sum + item.price * item.qty, 0));
  }, [order]);
  const handlePlaceOrder = async () => {
    let orderData = {
      blockId: selectedBlock,
      tableId: selectedTable,
      totalAmount: total,
      status: OrderStatus.ORDERED,
      type: OrderType.DINEIN,
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
      fetchTables();
      setOrder([]);
      setNewOrder(false);
    }
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
  const groupedTables = tables.reduce((acc, table) => {
    if (!acc[table.blockName]) {
      acc[table.blockName] = [];
    }
    acc[table.blockName].push(table);
    return acc;
  }, {} as Record<string, TableData[]>);
  if (loading) {
    return <Loader />;
  }

  const handleUpdateOrder = async () => {
    try {
      await postAxios("/orders/updateorder", {
        orderId: existingOrderData.orderId,
        isPaid: existingOrderData.isPaid,
        paymentMode: existingOrderData.paymentMethod,
        modifiedBy: User.id,
        status: existingOrderData.status,
      });
      setExistingOrder(false);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
      </div>
      {Object.entries(groupedTables).map(([blockName, blockTables]) => (
        <div key={blockName} className="mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">
            {blockName}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {blockTables.map((table) => {
              const statusConfig = getStatusConfig(table.status);
              const isAvailable =
                table.orderId === null &&
                (table.status === OrderStatus.AVAILABLE ||
                  table.status === OrderStatus.COMPLETED);

              // Background colors based on status
              const statusBg: any = {
                [OrderStatus.AVAILABLE]:
                  "from-green-50 to-green-100 border-green-200",
                [OrderStatus.ORDERED]:
                  "from-blue-50 to-blue-100 border-blue-200",
                [OrderStatus.PREPARING]:
                  "from-amber-50 to-amber-100 border-amber-200",
                [OrderStatus.READY]:
                  "from-purple-50 to-purple-100 border-purple-200",
                [OrderStatus.SERVED]:
                  "from-pink-50 to-pink-100 border-pink-200",
                [OrderStatus.COMPLETED]:
                  "from-gray-50 to-gray-100 border-gray-200",
              };

              return (
                <div
                  key={`${table.blockId}-${table.tableId}`}
                  onClick={() => {
                    if (table.orderId) {
                      handleGetOrderDetails(table.orderId);
                    } else {
                      setNewOrder(true);
                      setSelectedBlock(table.blockId);
                      setSelectedTable(table.tableId);
                    }
                  }}
                  className={`rounded-2xl p-5 flex flex-col justify-between cursor-pointer 
              transform transition-all duration-300 hover:scale-105 hover:shadow-2xl 
              bg-gradient-to-br ${statusBg[table.status!]}`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {table.tableName}
                    </h3>
                    {!isAvailable && (
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          statusBg[table.status!]
                        }`}
                      >
                        {statusConfig.label}
                      </span>
                    )}
                  </div>

                  {/* Available Card */}
                  {isAvailable ? (
                    <div className="flex flex-col items-center justify-center my-6 py-6 rounded-xl bg-white shadow-inner border border-green-100">
                      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-3">
                        <svg
                          className="h-7 w-7 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-green-600">
                        Available
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Status Card */}
                      <div
                        className={`flex items-center justify-center w-full max-w-xs mx-auto px-5 py-3 rounded-xl shadow ${statusConfig.bg}`}
                      >
                        <div className="text-center">
                          <p
                            className={`text-lg font-bold ${statusConfig.text}`}
                          >
                            {statusConfig.label}
                          </p>
                          {table.orderId && (
                            <p className="text-sm text-gray-700">
                              Order #{table.orderId}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 w-full max-w-xs mx-auto">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                              table.status === OrderStatus.ORDERED
                                ? "bg-blue-500 w-1/4"
                                : table.status === OrderStatus.PREPARING
                                ? "bg-amber-500 w-1/2"
                                : table.status === OrderStatus.READY
                                ? "bg-green-500 w-3/4"
                                : table.status === OrderStatus.SERVED
                                ? "bg-purple-500 w-[90%]"
                                : "bg-gray-400 w-full"
                            }`}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                    {isAvailable ? (
                      <span className="text-gray-400 italic">
                        Ready for order
                      </span>
                    ) : (
                      <span className="font-semibold text-red-700 text-lg">
                        ${table.totalAmount ?? "0.00"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

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

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Status
                        </label>
                        <select
                          value={orderStatus!}
                          onChange={(e) => setOrderStatus(e.target.value! as "ORDERED")}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Order Status</option>
                          <option value={OrderStatus.ORDERED}>Ordered</option>
                          <option value={OrderStatus.COMPLETED}>Completed</option>
                          <option value={OrderStatus.CANCELLED}>Cancelled</option>
                        </select>
                      </div>
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
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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

                  {/* Order Items with scroll */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
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
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Order Status
                      </label>
                      <select
                        value={existingOrderData.status || ""}
                        onChange={(e) =>
                          setExistingOrderData((prev: any) => ({
                            ...prev,
                            status: e.target.value as OrderStatus,
                          }))
                        }
                        className="w-full border rounded-lg p-2 text-sm"
                      >
                        <option value="">Select Status</option>
                        <option value={OrderStatus.ORDERED}>Ordered</option>
                        <option value={OrderStatus.PREPARING}>Preparing</option>
                        <option value={OrderStatus.READY}>Ready</option>
                        <option value={OrderStatus.SERVED}>Served</option>
                        <option value={OrderStatus.COMPLETED}>Completed</option>
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
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
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
export default Dashboard;
