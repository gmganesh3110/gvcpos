import React, { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaSearch, 
  FaPlus, 
  FaMinus, 
  FaTrash, 
  FaPrint, 
  FaSave, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaQrcode,
  FaClock,
  FaBarcode,
  FaReceipt,
  FaShoppingCart,
  FaUtensils,
  FaTable
} from "react-icons/fa";
import { PaymentMode } from "../../constants/Paymodes";
import { OrderStatus } from "../../constants/OrderStatus";
import { OrderType } from "../../constants/OrderTypes";

interface DiningOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  categories: any[];
  items: any[];
  itemsLoading: boolean;
  onCategorySelect: (categoryId: number) => void;
  onItemAdd: (item: any) => void;
  onItemIncrease: (itemId: number) => void;
  onItemDecrease: (itemId: number) => void;
  selectedCategory: number | null;
  order: any[];
  total: number;
  tableInfo: {
    tableNumber: string;
    blockName: string;
  };
  isEditMode?: boolean;
  existingOrderData?: any;
}

const DiningOrderModal: React.FC<DiningOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  items,
  itemsLoading,
  onCategorySelect,
  onItemAdd,
  onItemIncrease,
  onItemDecrease,
  selectedCategory,
  order,
  total,
  tableInfo,
  isEditMode = false,
  existingOrderData
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>(PaymentMode.CASH);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filter items based on search or category
  const filteredItems = React.useMemo(() => {
    if (isSearching && searchTerm.trim()) {
      // When searching, show all items matching the search term regardless of category
      return items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (selectedCategory) {
      // When category is selected and not searching, filter by category
      return items.filter((i) => i.categoryId === selectedCategory);
    } else {
      // Show all items when no category selected and not searching
      return items;
    }
  }, [items, selectedCategory, searchTerm, isSearching]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(value.trim().length > 0);
    
    // Clear category selection when searching
    if (value.trim().length > 0) {
      onCategorySelect(null);
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    setSearchTerm("");
    setIsSearching(false);
    onCategorySelect(categoryId);
  };

  const handleSubmit = () => {
    if (!paymentMethod) {
      setShowPaymentSelection(true);
      return;
    }

    const orderData = {
      items: order,
      total,
      paymentMethod,
      orderType: OrderType.DINEIN,
      status: OrderStatus.ORDERED, // Start with ORDERED status for dining
      tableInfo,
      startTime: new Date(),
      isEditMode,
      existingOrderId: existingOrderData?.id
    };
    onSubmit(orderData);
  };

  const handlePrint = () => {
    // Print functionality
    console.log("Printing dining order...");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-7xl h-[98%] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modern Dining Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <FaUtensils className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditMode ? "Edit Dining Order" : "New Dining Order"}
                </h1>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-1">
                    <FaClock className="text-sm" />
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaTable className="text-sm" />
                    {tableInfo.blockName} - Table {tableInfo.tableNumber}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    DINE-IN
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors duration-200 backdrop-blur-sm"
                title="Print Order"
              >
                <FaPrint className="text-lg" />
              </button>
              <button
                onClick={onClose}
                className="bg-red-500/20 hover:bg-red-500/30 p-3 rounded-xl transition-colors duration-200 backdrop-blur-sm"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Categories & Items */}
          <div className="w-2/3 flex">
            {/* Categories Sidebar */}
            <div className="w-1/4 bg-gray-50 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                      !selectedCategory && !isSearching
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium">All Items</div>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                        selectedCategory === category.id && !isSearching
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-medium">{category.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 bg-white">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items by name..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-colors duration-200">
                    <FaBarcode className="text-lg" />
                  </button>
                </div>
                {isSearching && (
                  <div className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                    <FaSearch className="text-xs" />
                    Showing search results for "{searchTerm}"
                  </div>
                )}
              </div>

              <div className="p-4 h-[calc(100%-100px)] overflow-y-auto">
                {itemsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onItemAdd(item)}
                        className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                      >
                        <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <span className="text-4xl">🍽️</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                            ₹{item.price}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{item.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-lg transition-colors duration-200">
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Order Summary & Payment */}
          <div className="w-1/3 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* Order Items */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaReceipt className="text-green-500" />
                Order Items ({order.length})
              </h3>
              {order.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FaShoppingCart className="text-6xl mb-4" />
                  <p className="text-lg font-medium">No items added</p>
                  <p className="text-sm">Select items from the menu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {order.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        <button
                          onClick={() => onItemDecrease(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onItemDecrease(item.id)}
                            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm font-bold min-w-[30px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onItemIncrease(item.id)}
                            className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <span className="font-bold text-green-600">₹{item.price * item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary & Payment */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800">Payment Method *</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod(PaymentMode.CASH)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${
                      paymentMethod === PaymentMode.CASH
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <FaMoneyBillWave className="text-lg" />
                    <span className="text-xs font-medium">Cash</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod(PaymentMode.CARD)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${
                      paymentMethod === PaymentMode.CARD
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <FaCreditCard className="text-lg" />
                    <span className="text-xs font-medium">Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod(PaymentMode.UPI)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${
                      paymentMethod === PaymentMode.UPI
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <FaQrcode className="text-lg" />
                    <span className="text-xs font-medium">UPI</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod(PaymentMode.ONLINE)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${
                      paymentMethod === PaymentMode.ONLINE
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <FaCreditCard className="text-lg" />
                    <span className="text-xs font-medium">Online</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={order.length === 0}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 disabled:transform-none disabled:shadow-none"
                  >
                    <FaSave />
                    {isEditMode ? "Update Order" : "Place Order"}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <FaPrint />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiningOrderModal;
