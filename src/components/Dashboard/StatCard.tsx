import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growth?: number;
  growthLabel?: string;
  color: "blue" | "green" | "purple" | "orange" | "red" | "indigo";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  growth,
  growthLabel,
  color,
  className = ""
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          border: "border-blue-500",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        };
      case "green":
        return {
          border: "border-green-500",
          iconBg: "bg-green-100",
          iconColor: "text-green-600"
        };
      case "purple":
        return {
          border: "border-purple-500",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600"
        };
      case "orange":
        return {
          border: "border-orange-500",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600"
        };
      case "red":
        return {
          border: "border-red-500",
          iconBg: "bg-red-100",
          iconColor: "text-red-600"
        };
      case "indigo":
        return {
          border: "border-indigo-500",
          iconBg: "bg-indigo-100",
          iconColor: "text-indigo-600"
        };
      default:
        return {
          border: "border-gray-500",
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600"
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${colors.border} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth >= 0 ? (
                <FaArrowUp className="text-green-500 text-sm mr-1" />
              ) : (
                <FaArrowDown className="text-red-500 text-sm mr-1" />
              )}
              <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growth >= 0 ? '+' : ''}{growth}%
              </span>
              {growthLabel && (
                <span className="text-gray-500 text-sm ml-1">{growthLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={`${colors.iconBg} p-3 rounded-full`}>
          <div className={colors.iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
