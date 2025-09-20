import React from "react";

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: "blue" | "green" | "purple" | "orange" | "red" | "indigo";
  onClick?: () => void;
  className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  color,
  onClick,
  className = ""
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700";
      case "green":
        return "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700";
      case "purple":
        return "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700";
      case "orange":
        return "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700";
      case "red":
        return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700";
      case "indigo":
        return "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getColorClasses(color)} text-white p-4 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center ${className}`}
    >
      <div className="text-xl mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default QuickActionButton;
