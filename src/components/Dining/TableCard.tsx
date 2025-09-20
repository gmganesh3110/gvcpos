import React from "react";
import {
  FaPlus,
  FaEdit,
  FaClock,
  FaUtensils,
  FaReceipt,
  FaCheckCircle,
  FaCheck,
} from "react-icons/fa";
import { OrderStatus } from "../../constants/OrderStatus";
import { OrderType } from "../../constants/OrderTypes";
import TableStatusManager from "./TableStatusManager";

interface TableCardProps {
  table: {
    blockId: number;
    blockName: string;
    tableId: number;
    tableName: string;
    orderId?: number;
    status?: OrderStatus;
    type?: OrderType;
    totalAmount?: number;
    startTime?: Date;
    endTime?: Date;
  };
  onTableClick: (table: any) => void;
  onEditOrder: (orderId: number) => void;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  isUpdatingStatus?: boolean;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  onTableClick,
  onEditOrder,
  onStatusChange,
  isUpdatingStatus = false,
}) => {
  const isAvailable = table.status === OrderStatus.AVAILABLE || !table.status;
  const hasOrder = table.orderId && table.orderId > 0;

  const getStatusConfig = (status: OrderStatus | undefined) => {
    switch (status) {
      case OrderStatus.ORDERED:
        return {
          bg: "bg-yellow-500",
          text: "text-white",
          label: "Ordered",
          icon: FaUtensils,
          pulse: false,
        };
      case OrderStatus.SERVED:
        return {
          bg: "bg-blue-500",
          text: "text-white",
          label: "Served",
          icon: FaCheck,
          pulse: false,
        };
      case OrderStatus.BILLED:
        return {
          bg: "bg-purple-500",
          text: "text-white",
          label: "Billed",
          icon: FaReceipt,
          pulse: false,
        };
      case OrderStatus.COMPLETED:
        return {
          bg: "bg-green-500",
          text: "text-white",
          label: "Completed",
          icon: FaCheckCircle,
          pulse: false,
        };
      default:
        return {
          bg: "bg-gray-200",
          text: "text-gray-600",
          label: "Available",
          icon: FaPlus,
          pulse: false,
        };
    }
  };

  const config = getStatusConfig(table.status);
  const IconComponent = config.icon;

  const formatTime = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderDuration = () => {
    if (!table.startTime) return "";
    const start = new Date(table.startTime);
    const end = table.endTime ? new Date(table.endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  return (
    <div
      onClick={() => onTableClick(table)}
      className="group relative bg-white rounded-lg p-4 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden min-h-[240px]"
    >
      {/* Header */}
      <div className="flex justify-center items-center mb-3">
        <div className="bg-blue-600 text-white px-3 py-1 rounded font-semibold text-sm">
          {table.tableName}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col items-center justify-center flex-1">
        {isAvailable ? (
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center h-16 w-16 rounded-full mb-3 ${config.bg}`}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
              Available
            </p>
            <p className="text-xs text-gray-500 mt-1">Click to start order</p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Status Icon */}
            <div
              className={`flex items-center justify-center h-14 w-14 rounded-full mb-3 ${config.bg}`}
            >
              <IconComponent className="h-5 w-5 text-white" />
            </div>

            {/* Order Information */}
            {hasOrder && (
              <div className="text-center mb-3">
                <p className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mb-1">
                  Order #{table.orderId}
                </p>
                <p className="text-base font-semibold text-gray-800">
                  ₹{table.totalAmount}
                </p>
                {table.startTime && (
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1">
                    <FaClock className="text-xs" />
                    <span>{formatTime(table.startTime)}</span>
                    <span>•</span>
                    <span>{getOrderDuration()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Status Manager */}
            {hasOrder &&
              table.status &&
              table.status !== OrderStatus.AVAILABLE && (
                <div className="w-full">
                  <TableStatusManager
                    currentStatus={table.status}
                    orderId={table.orderId!}
                    onStatusChange={onStatusChange}
                    isUpdating={isUpdatingStatus}
                    totalAmount={table.totalAmount!}
                  />
                </div>
              )}

            {/* Edit Button */}
            {hasOrder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditOrder(table.orderId!);
                }}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <FaEdit className="text-xs" />
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;
