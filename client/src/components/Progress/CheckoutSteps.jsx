import React from 'react';

const CheckoutSteps = ({ step }) => {
  const steps = ['Cart', 'Details', 'Checkout'];

  return (
    <div className="flex justify-center items-center gap-4 my-4">
      {steps.map((label, index) => {
        const isActive = step === index + 1;
        const isCompleted = step > index + 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold 
              ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}`}>
              {index + 1}
            </div>
            <span className={`text-sm ${isCompleted || isActive ? 'text-black' : 'text-gray-400'}`}>
              {label}
            </span>
            {index !== steps.length - 1 && (
              <div className={`w-8 h-1 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
