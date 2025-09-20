import React from "react";
import { 
  FaCheck, 
  FaUtensils, 
  FaReceipt, 
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";
import { OrderStatus } from "../../constants/OrderStatus";

interface TableStatusManagerProps {
  currentStatus: OrderStatus;
  orderId: number;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  isUpdating?: boolean;
  totalAmount: number;
}

const TableStatusManager: React.FC<TableStatusManagerProps> = ({
  currentStatus,
  orderId,
  onStatusChange,
  isUpdating = false,
  totalAmount
}) => {
  const statusFlow = [
    { status: OrderStatus.ORDERED, label: "Ordered", icon: FaUtensils, color: "bg-yellow-500" },
    { status: OrderStatus.SERVED, label: "Served", icon: FaCheck, color: "bg-blue-500" },
    { status: OrderStatus.BILLED, label: "Billed", icon: FaReceipt, color: "bg-purple-500" },
    { status: OrderStatus.COMPLETED, label: "Completed", icon: FaCheckCircle, color: "bg-green-500" }
  ];

  const getCurrentStatusIndex = () => {
    return statusFlow.findIndex(s => s.status === currentStatus);
  };

  const getNextStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const canUpdateStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    return currentIndex >= 0 && currentIndex < statusFlow.length - 1;
  };

  const handleStatusUpdate = () => {
    const nextStatus = getNextStatus();
    if (nextStatus && canUpdateStatus()) {
      onStatusChange(orderId, nextStatus.status,totalAmount);
    }
  };

  const currentStatusInfo = statusFlow.find(s => s.status === currentStatus);
  const nextStatus = getNextStatus();

  if (!currentStatusInfo) {
    return null;
  }

  const IconComponent = currentStatusInfo.icon;

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Current Status Display */}
      <div className={`flex items-center gap-2 px-3 py-1 rounded text-white ${currentStatusInfo.color}`}>
        <IconComponent className="text-xs" />
        <span className="font-medium text-xs">{currentStatusInfo.label}</span>
      </div>

      {/* Status Update Button */}
      {canUpdateStatus() && nextStatus && (
        <button
          onClick={handleStatusUpdate}
          disabled={isUpdating}
          className={`flex items-center gap-1 px-2 py-1 rounded text-white font-medium text-xs transition-colors duration-200 disabled:opacity-50 ${
            nextStatus.status === OrderStatus.SERVED ? 'bg-blue-500 hover:bg-blue-600' :
            nextStatus.status === OrderStatus.BILLED ? 'bg-purple-500 hover:bg-purple-600' :
            nextStatus.status === OrderStatus.COMPLETED ? 'bg-green-500 hover:bg-green-600' :
            'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {isUpdating ? (
            <>
              <FaSpinner className="animate-spin text-xs" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              {React.createElement(nextStatus.icon, { className: "text-xs" })}
              <span>Mark as {nextStatus.label}</span>
            </>
          )}
        </button>
      )}

      {/* Status Flow Indicator */}
      <div className="flex items-center space-x-1">
        {statusFlow.map((status, index) => {
          const isCompleted = index <= getCurrentStatusIndex();
          const isCurrent = status.status === currentStatus;
          const StatusIcon = status.icon;
          
          return (
            <div key={status.status} className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200 ${
                  isCompleted
                    ? `${status.color} text-white`
                    : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-1 ring-blue-400' : ''}`}
              >
                {isCompleted ? <StatusIcon className="text-xs" /> : index + 1}
              </div>
              {index < statusFlow.length - 1 && (
                <div
                  className={`w-4 h-0.5 mx-1 transition-colors duration-200 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Status Description */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {currentStatus === OrderStatus.ORDERED && "Order placed, preparing"}
          {currentStatus === OrderStatus.SERVED && "Food served to table"}
          {currentStatus === OrderStatus.BILLED && "Bill generated, payment pending"}
          {currentStatus === OrderStatus.COMPLETED && "Order complete, table available"}
        </p>
      </div>
    </div>
  );
};

export default TableStatusManager;
