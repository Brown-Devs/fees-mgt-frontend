import React from "react";

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
      
      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold text-[#001f3f]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {children}

        {buttonText && (
          <button
            onClick={onButtonClick}
            className="px-5 py-2.5 bg-[#001f3f] hover:bg-[#001933]
                       text-white rounded-xl shadow-md hover:shadow-lg
                       transition-all duration-200 ease-in-out"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
