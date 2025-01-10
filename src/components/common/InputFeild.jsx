import React from "react";

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  width = "full", // default to full width
  height = "auto", // default to auto height
}) {
  // Define the styles based on width and height props
  const inputStyle = {
    width: width === "full" ? "100%" : width, // Handle full width or custom width
    height: height === "auto" ? "auto" : height, // Handle auto height or custom height
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        style={inputStyle}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

export default InputField;
