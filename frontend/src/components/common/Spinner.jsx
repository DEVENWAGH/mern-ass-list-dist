import React from "react";

const Spinner = ({ size = "default", center = true }) => {
  // Size variations
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    default: "h-12 w-12 border-2",
    large: "h-16 w-16 border-3",
  };

  const spinnerClass = `animate-spin rounded-full ${sizeClasses[size]} border-t-blue-600 border-blue-200`;

  // If center is true, center the spinner on the page
  if (center) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  // Otherwise just return the spinner
  return <div className={spinnerClass}></div>;
};

export default Spinner;
