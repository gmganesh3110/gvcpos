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

const Dining = () => {
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
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [mostOrderedItems, setMostOrderedItems] = useState<any[]>([]);

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
      setItemsLoading(true);
      const response: any = await postAxios("/items/getall", {
        categoryId: selectedCategory,
        start: 0,
        limit: 50,
      });
      const data: any = response.data[0];
      if (!selectedCategory) {
        setMostOrderedItems(data);
      }
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
    console.log("getStatusConfig", status);
    switch (status) {
      case OrderStatus.AVAILABLE:
        return {
          bg: "bg-blue-300",
          text: "text-white",
          label: "Available",
        };
      case OrderStatus.INPROGRESS:
        return {
          bg: "bg-blue-100",
          text: "text-red-700",
          label: "In Progress",
        };
      case OrderStatus.BILLED:
        return { bg: "bg-amber-100", text: "text-green-700", label: "Billed" };
      case OrderStatus.COMPLETED:
        return { bg: "bg-gray-100", text: "text-gray-600", label: "Completed" };
      default:
        return {
          bg: "bg-[#B9E9E9]",
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
      status: OrderStatus.INPROGRESS,
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
    const rawItems = res.data[0];
    if (rawItems.length > 0) {
      const orderSummary = {
        orderId: rawItems[0].orderid,
        total: Number(rawItems[0].totalAmount),
        type: rawItems[0].type,
        isPaid: rawItems[0].isPaid === 1,
        paymentMethod: rawItems[0].paymentMode,
        status: rawItems[0].status,
        items: rawItems.map((row: any) => ({
          id: row.itemid,
          name: row.name,
          price: Number(row.price),
          qty: row.quantity,
        })),
      };
      setExistingOrder(true);
      setOrderStatus(orderSummary.status);
      setIsPaid(orderSummary.isPaid);
      setPaymentMethod(orderSummary.paymentMethod);
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

  if (loading) return <Loader />;

  const handleUpdateOrder = async () => {
    try {
      await postAxios("/orders/updateorder", {
        orderId: existingOrderData.orderId,
        isPaid: isPaid,
        paymentMode: paymentMethod,
        modifiedBy: User.id,
        status: orderStatus || existingOrderData.status,
      });
      setExistingOrder(false);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAndPrint = () => {};
  const updateSaveAndPrint = () => {};

  return (
    <div className="container mx-auto px-4 py-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dining</h2>
      </div>

      <div className="flex gap-6 h-[90vh]">
        {/* Left Section - Blocks (80%) */}
        <div className="w-[80%] overflow-y-auto pr-4">
          {Object.entries(groupedTables).map(([blockName, blockTables]) => (
            <div key={blockName} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide">
                {blockName}
              </h3>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {blockTables.map((table) => {
                  const isAvailable =
                    table.orderId === null &&
                    table.status === OrderStatus.AVAILABLE;
                  const cfg = getStatusConfig(table.status!);

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
                      className="rounded-xl p-5 flex flex-col justify-between cursor-pointer border bg-white shadow hover:shadow-lg transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex justify-center items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {table.tableName}
                        </h3>
                      </div>

                      {/* Body */}
                      {isAvailable ? (
                        <div className="flex flex-col items-center justify-center flex-1">
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
                          <p className="text-sm font-semibold text-green-700">
                            Ready for Order
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center flex-1">
                          <p className={`text-base font-bold ${cfg.text}`}>
                            {cfg.label}
                          </p>
                          {table.orderId && (
                            <p className="text-sm text-gray-500 mt-1 font-medium">
                              Order #{table.orderId}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex justify-center items-center mt-4 text-sm">
                        {isAvailable ? (
                          <span className="text-gray-400 italic">
                            Available
                          </span>
                        ) : (
                          <span className="font-semibold text-red-600 text-base">
                            ₹{table.totalAmount ?? ""}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Section - Most Ordered Items (20%) */}
        <div className="w-[20%] bg-white border rounded-xl shadow p-2 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            ⭐ Most Ordered Items
          </h2>

          <div className="grid grid-cols-1 gap-5">
            {mostOrderedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg shadow-sm border bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
              >
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>

                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
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
                        className={`p-4 rounded-xl shadow bg-gradient-to-br cursor-pointer hover:scale-105 transition transform hover:shadow-md bg-gray-100 h-60 `}
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
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r bg-gray-200">
              <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
                🛒 View Order
              </h1>
              <button
                onClick={() => setExistingOrder(false)}
                className="text-gray-800 hover:text-gray-600 text-2xl"
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
                    {existingOrderData.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md border"
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
                          <span className="min-w-[24px] text-center">
                            {item.qty}
                          </span>
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
export default Dining;
