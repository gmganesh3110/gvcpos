import React from "react";
import { FaTrash, FaPlus, FaMinus, FaReceipt, FaCalculator } from "react-icons/fa";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface OrderSummaryProps {
  order: OrderItem[];
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  onItemIncrease: (itemId: number) => void;
  onItemDecrease: (itemId: number) => void;
  onItemRemove: (itemId: number) => void;
  onClearOrder: () => void;
  onApplyDiscount: (discount: number) => void;
  onApplyTax: (tax: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  total,
  subtotal,
  discount,
  tax,
  onItemIncrease,
  onItemDecrease,
  onItemRemove,
  onClearOrder,
  onApplyDiscount,
  onApplyTax
}) => {
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const finalTotal = subtotal - discountAmount + taxAmount;

  return (
    <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FaReceipt className="text-blue-500" />
            Order Summary
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearOrder}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
              title="Clear Order"
            >
              <FaTrash className="text-sm" />
            </button>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
              {order.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 p-4 overflow-y-auto">
        {order.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaReceipt className="text-6xl mb-4" />
            <p className="text-lg font-medium">No items added</p>
            <p className="text-sm">Select items from the menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {order.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  {/* Item Image */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-lg">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">₹{item.price} each</span>
                      <span className="font-bold text-green-600">₹{item.price * item.qty}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onItemDecrease(item.id)}
                      className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="bg-white px-3 py-1 rounded-lg font-bold text-gray-800 min-w-[40px] text-center border border-gray-200">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onItemIncrease(item.id)}
                      className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <button
                    onClick={() => onItemRemove(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    title="Remove Item"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Totals */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount ({discount}%):</span>
              <span className="text-red-600 font-medium">-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({tax}%):</span>
              <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onApplyDiscount(10)}
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            10% Off
          </button>
          <button
            onClick={() => onApplyTax(18)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            +18% Tax
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
