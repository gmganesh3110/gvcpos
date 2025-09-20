import React from "react";
import { FaUtensils, FaArrowUp, FaArrowDown } from "react-icons/fa";

type TopSellingItem = {
  name: string;
  quantity: number;
  revenue: number;
  growth: number;
};

interface TopSellingItemsProps {
  data: TopSellingItem[];
  maxItems?: number;
  className?: string;
}

const TopSellingItems: React.FC<TopSellingItemsProps> = ({
  data,
  maxItems = 5,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Top Selling Items</h3>
        <FaUtensils className="text-green-500 text-xl" />
      </div>
      <div className="space-y-4">
        {data.slice(0, maxItems).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-500">{item.quantity} sold</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-800">₹{item.revenue}</div>
              <div className={`text-sm flex items-center ${item.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {item.growth > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(item.growth)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingItems;
