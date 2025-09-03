import React from "react";
import "./Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
