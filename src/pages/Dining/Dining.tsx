import { useEffect, useState } from "react";
import { OrderStatus } from "../../constants/OrderStatus";
import { OrderType } from "../../constants/OrderTypes";
import { getAxios, postAxios } from "../../services/AxiosService";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DiningOrderModal from "../../components/Dining/DiningOrderModal";
import TableCard from "../../components/Dining/TableCard";
import { toast } from "react-toastify";

// Interface
interface BlockTableData {
  blockId: number;
  blockName: string;
  tableId: number;
  tableName: string;
  orderId: number;
  status: OrderStatus;
  type: OrderType;
  totalAmount: number;
}

const Dining = () => {
  const [tables, setTables] = useState<BlockTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [order, setOrder] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [existingOrderData, setExistingOrderData] = useState<any>(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const User = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  if (User && User.isRegistered != 1) {
    navigate("/restaurantregister");
  } else if (User && (!User.expiresAt || User.expiresAt < Date.now())) {
    navigate("/subscription");
  }

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response: any = await getAxios(
        "/dining/getblocksandtableswithorders",
        {
          restuarent: User.restuarent,
        }
      );
      const data = response.data[0];
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to fetch tables. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response: any = await getAxios("/items/categories/getall", {
        restuarent: User.restuarent,
      });
      const data = response.data[0];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories. Please try again.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [newOrder]);

  const fetchFilteredItems = async () => {
    try {
      setItemsLoading(true);
      const response: any = await getAxios("/items/getall", {
        category: selectedCategory,
        restuarent: User.restuarent,
        start: 0,
        limit: 50,
      });

      const data: any = response.data[0];
      setItems(data);
    } catch (error) {
      console.error("Error fetching filtered items:", error);
      toast.error("Failed to fetch items. Please try again.");
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

  const onCardClick = (id: number) => {
    setSelectedCategory(id);
  };

  useEffect(() => {
    setTotal(order.reduce((sum, item) => sum + item.price * item.qty, 0));
  }, [order]);

  const handlePlaceOrder = async (orderData: any) => {
    try {
      const orderPayload = {
        block: selectedBlock,
        table: selectedTable,
        totalAmount: orderData.total,
        status: OrderStatus.ORDERED, // Start with ORDERED status for dining
        type: OrderType.DINEIN,
        isPaid: false, // No payment required initially
        paymentMethod: orderData.paymentMethod,
        createdBy: User.id,
        startTime: orderData.startTime,
        restuarent: User.restuarent,
        items: orderData.items.map((item: any) => ({
          id: item.id,
          quantity: item.qty,
          price: item.price,
        })),
      };

      const res = await postAxios("/orders/createorder", orderPayload);
      if (res) {
        toast.success("Dining order created successfully!");
        fetchTables();
        setOrder([]);
        setNewOrder(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    }
  };

  const handleGetOrderDetails = async (orderId: number) => {
    try {
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
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details. Please try again.");
    }
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
    totalAmount: number
  ) => {
    try {
      setIsUpdatingStatus(true);
      const updateData: any = {
        orderId,
        modifiedBy: User.id,
        status: newStatus,
        totalAmount: totalAmount,
      };

      // Set end time when order is completed
      if (newStatus === OrderStatus.COMPLETED) {
        updateData.endTime = new Date();
      }

      await postAxios("/orders/updateorder", updateData);

      toast.success(`Order status updated to ${newStatus.toLowerCase()}`);
      fetchTables();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEditOrder = async (orderId: number) => {
    try {
      const res: any = await getAxios("/orders/getorderdetails", {
        orderId,
        restuarent: User.restuarent,
      });

      // The API now returns the order items directly
      const orderItems = res.data || [];
      console.log(orderItems);
      const orderData = {
        id: orderId,
        orderitems: orderItems,
        totalAmount: orderItems[0].totalAmount,
        status: orderItems[0].status,
      };

      setExistingOrderData(orderData);

      // Set up the order for editing
      const formattedOrderItems = orderItems.map((item: any) => ({
        id: item.item,
        name: item.name,
        price: parseFloat(item.price),
        qty: item.quantity,
      }));

      setOrder(formattedOrderItems);
      setTotal(orderData.totalAmount);
      setIsEditMode(true);
      setNewOrder(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details. Please try again.");
    }
  };

  const handleUpdateExistingOrder = async (orderData: any) => {
    try {
      // Update the order items
      let obj = {
        orderId: existingOrderData.id,
        restuarent: User.restuarent,
        items: orderData.items.map((item: any) => ({
          id: item.id,
          quantity: item.qty,
          price: item.price,
        })),
        modifiedBy: User.id,
      };
      await postAxios("/orders/updateorderitems", obj);

      // Update the order total
      await postAxios("/orders/updateorder", {
        orderId: existingOrderData.id,
        totalAmount: orderData.total,
        paymentMode: orderData.paymentMethod,
        modifiedBy: User.id,
        status: existingOrderData.status,
      });

      toast.success("Order updated successfully!");
      setNewOrder(false);
      setOrder([]);
      setSelectedCategory(null);
      setIsEditMode(false);
      fetchTables();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🍽️ Dining Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage tables, orders, and dining operations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Live Status
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-[90vh]">
        {/* Left Section - Blocks (80%) */}
        {loading ? (
          <div className=" flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className=" overflow-y-auto pr-4">
            {(() => {
              // Group tables by block
              const groupedTables = tables.reduce(
                (acc: any, table: BlockTableData) => {
                  if (!acc[table.blockId]) {
                    acc[table.blockId] = {
                      blockId: table.blockId,
                      blockName: table.blockName,
                      tables: [],
                    };
                  }
                  acc[table.blockId].tables.push(table);
                  return acc;
                },
                {}
              );

              return Object.values(groupedTables).map((block: any) => (
                <div key={block.blockId} className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {block.blockName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {block.tables.map((table: BlockTableData) => (
                      <TableCard
                        key={`${table.blockId}-${table.tableId}`}
                        table={table}
                        onTableClick={(table) => {
                          if (table.orderId && table.orderId > 0) {
                            handleGetOrderDetails(table.orderId);
                          } else {
                            setNewOrder(true);
                            setSelectedBlock(table.blockId);
                            setSelectedTable(table.tableId);
                          }
                        }}
                        onEditOrder={handleEditOrder}
                        onStatusChange={handleStatusChange}
                        isUpdatingStatus={isUpdatingStatus}
                      />
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      <DiningOrderModal
        isOpen={newOrder}
        onClose={() => {
          setNewOrder(false);
          setIsEditMode(false);
          setOrder([]);
          setSelectedCategory(null);
        }}
        onSubmit={isEditMode ? handleUpdateExistingOrder : handlePlaceOrder}
        categories={categories}
        items={items}
        itemsLoading={itemsLoading}
        onCategorySelect={onCardClick}
        onItemAdd={handleAddItem}
        onItemIncrease={handleIncrease}
        onItemDecrease={handleDecrease}
        selectedCategory={selectedCategory}
        order={order}
        total={total}
        tableInfo={{
          tableNumber: selectedTable?.toString() || "",
          blockName:
            tables.find((b) => b.blockId === selectedBlock)?.blockName || "",
        }}
        isEditMode={isEditMode}
        existingOrderData={existingOrderData}
      />
    </div>
  );
};
export default Dining;
