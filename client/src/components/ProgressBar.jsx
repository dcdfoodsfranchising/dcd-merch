import React from 'react';

const ProgressBar = ({ currentStep = 2 }) => {
  // currentStep: 1 = Cart, 2 = Checkout, 3 = Order
  return (
    <div className="flex items-start mb-16">
      <div className="w-full">
        <div className="flex items-center w-full">
          <div className={`w-8 h-8 shrink-0 mx-[-1px] ${currentStep >= 1 ? 'bg-red-600' : 'bg-slate-300'} p-1.5 flex items-center justify-center rounded-full`}>
            <span className="text-sm text-white font-semibold">1</span>
          </div>
          <div className={`w-full h-[3px] mx-4 rounded-lg ${currentStep > 1 ? 'bg-red-600' : 'bg-slate-300'}`}></div>
        </div>
        <div className="mt-2 mr-4">
          <h6 className={`text-sm font-semibold ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Cart</h6>
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center w-full">
          <div className={`w-8 h-8 shrink-0 mx-[-1px] ${currentStep >= 2 ? 'bg-red-600' : 'bg-slate-300'} p-1.5 flex items-center justify-center rounded-full`}>
            <span className="text-sm text-white font-semibold">2</span>
          </div>
          <div className={`w-full h-[3px] mx-4 rounded-lg ${currentStep > 2 ? 'bg-red-600' : 'bg-slate-300'}`}></div>
        </div>
        <div className="mt-2 mr-4">
          <h6 className={`text-sm font-semibold ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Checkout</h6>
        </div>
      </div>
      <div>
        <div className="flex items-center">
          <div className={`w-8 h-8 shrink-0 mx-[-1px] ${currentStep === 3 ? 'bg-red-600' : 'bg-slate-300'} p-1.5 flex items-center justify-center rounded-full`}>
            <span className="text-sm text-white font-semibold">3</span>
          </div>
        </div>
        <div className="mt-2">
          <h6 className={`text-sm font-semibold ${currentStep === 3 ? 'text-slate-900' : 'text-slate-400'}`}>Order</h6>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;