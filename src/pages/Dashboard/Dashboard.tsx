import { useEffect, useState } from "react";
import { OrderStatus } from "../../constants/OrderStatus";
import { OrderType } from "../../constants/OrderTypes";
import { postAxios } from "../../services/AxiosService";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";

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

  const User = useSelector((state: any) => state.auth.user);
  const filteredItems = selectedCategory
    ? items.filter((i) => i.categoryId === selectedCategory)
    : items;

  useEffect(() => {
    fetchTables();
  }, []);
  const fetchTables = async () => {
    try {
      const response: any = await postAxios(
        "/orders/getblocksandtableswithorders"
      );
      const data = response.data;
      // Transform the data to include mock values for demo
      const transformedTables = data[0].map((table: TableData) => ({
        ...table,
        totalAmount: table.orderId ? Math.floor(Math.random() * 100) + 20 : 0,
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
    console.log(order);
    console.log(selectedBlock);
    console.log(selectedTable);
    console.log(total);
    let orderData = {
      blockId: selectedBlock,
      tableId: selectedTable,
      totalAmount: total,
      status: OrderStatus.ORDERED,
      type: OrderType.DINE_IN,
      createdBy: User.id,
      items: order.map((item) => ({
        id: item.id,
        quantity: item.qty,
        price: item.price,
      })),
    };
    const res = await postAxios("/orders/createorder", orderData);
    console.log(res);
    if (res) {
      fetchTables();
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

  return (
    <div className="container mx-auto px-4 py-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
      </div>

      {Object.entries(groupedTables).map(([blockName, blockTables]) => (
        <div key={blockName} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {blockName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {blockTables.map((table) => {
              const statusConfig = getStatusConfig(table.status);
              const isAvailable =
                table.orderId === null &&
                table.status === OrderStatus.AVAILABLE;

              return (
                <div
                  key={`${table.blockId}-${table.tableId}`}
                  onClick={() => {
                    setNewOrder(true);
                    setSelectedBlock(table.blockId);
                    setSelectedTable(table.tableId);
                  }}
                  className={`bg-white rounded-lg shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-200 ${
                    isAvailable ? "border-2 border-dashed border-gray-300" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {table.tableName}
                    </h3>
                    {table.elapsedTime && (
                      <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          />
                        </svg>
                        {table.elapsedTime}
                      </span>
                    )}
                  </div>

                  {isAvailable ? (
                    <div className="flex flex-col items-center justify-center my-4 py-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-2">
                        <svg
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        Available
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`flex items-center justify-center my-4 p-3 rounded-lg ${statusConfig.bg}`}
                      >
                        <div className="text-center">
                          <p
                            className={`text-lg font-bold ${statusConfig.text}`}
                          >
                            {statusConfig.label}
                          </p>
                          {table.orderId && (
                            <p className="text-sm text-gray-500">
                              Order #{table.orderId}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              table.status === OrderStatus.ORDERED
                                ? "bg-blue-500 w-25%"
                                : table.status === OrderStatus.PREPARING
                                ? "bg-amber-500 w-50%"
                                : table.status === OrderStatus.READY
                                ? "bg-green-500 w-75%"
                                : table.status === OrderStatus.SERVED
                                ? "bg-purple-500 w-90%"
                                : "bg-gray-500 w-100%"
                            }`}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    {isAvailable ? (
                      <span className="text-gray-400">Ready for order</span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1.5">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 13v-2.26A4.97 4.97 0 0112.93 7h0a4.97 4.97 0 012.93 3.74A6.97 6.97 0 0017 16c0 .34.024.673.07 1h-4.14zM2.07 17a6.97 6.97 0 001.5-4.33A5 5 0 015 13v-2.26A4.97 4.97 0 012.07 7h0a4.97 4.97 0 01-2.93 3.74A6.97 6.97 0 00-1 16c0 .34-.024.673-.07 1h4.14z" />
                          </svg>
                          {table.guests}{" "}
                          {table.guests === 1 ? "Guest" : "Guests"}
                        </span>
                        {table.totalAmount && (
                          <span className="font-semibold text-gray-800">
                            ${table.totalAmount.toFixed(2)}
                          </span>
                        )}
                      </>
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
                <div className="">
                  <br />
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
    </div>
  );
};

export default Dashboard;
