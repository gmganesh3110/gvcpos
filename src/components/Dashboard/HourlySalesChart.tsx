import React from "react";
import { FaChartBar } from "react-icons/fa";

type HourlySales = {
  hour: string;
  orders: number;
  revenue: number;
};

interface HourlySalesChartProps {
  data: HourlySales[];
  maxItems?: number;
  className?: string;
}

const HourlySalesChart: React.FC<HourlySalesChartProps> = ({
  data,
  maxItems = 6,
  className = ""
}) => {
  const maxRevenue = Math.max(...data.map(item => item.revenue));

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Hourly Sales</h3>
        <FaChartBar className="text-blue-500 text-xl" />
      </div>
      <div className="space-y-4">
        {data.slice(0, maxItems).map((hour) => (
          <div key={hour.hour} className="flex items-center">
            <div className="w-16 text-sm text-gray-600">{hour.hour}</div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(hour.revenue / maxRevenue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-20 text-sm text-gray-600 text-right">₹{hour.revenue}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlySalesChart;
