import React from 'react';
import { HiCheck, HiOutlineShoppingBag, HiOutlineCreditCard, HiOutlineBadgeCheck } from 'react-icons/hi';

const CheckoutSteps = ({ active }) => {
    const steps = [
        { id: 1, title: 'Shipping', icon: HiOutlineShoppingBag },
        { id: 2, title: 'Payment', icon: HiOutlineCreditCard },
        { id: 3, title: 'Success', icon: HiOutlineBadgeCheck },
    ];

    return (
        <div className='w-full flex justify-center py-12'>
            <div className="w-[95%] md:w-[60%] lg:w-[45%] flex items-center justify-between relative px-2">
                {/* Progress Line Background */}
                <div className="absolute top-[22px] left-[10%] right-[10%] h-[2px] bg-gray-100 dark:bg-gray-800 -z-0" />

                {/* Active Progress Line */}
                <div
                    className="absolute top-[22px] left-[10%] h-[2px] bg-brand-teal transition-all duration-500 ease-in-out -z-0"
                    style={{ width: active === 1 ? '0%' : active === 2 ? '40%' : '80%' }}
                />

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = active > step.id;
                    const isActive = active === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                            <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 group
                  ${isCompleted
                                        ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20'
                                        : isActive
                                            ? 'bg-white dark:bg-gray-800 text-brand-teal shadow-xl border-2 border-brand-teal'
                                            : 'bg-white dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-2 border-gray-100 dark:border-gray-700'
                                    }`}
                            >
                                {isCompleted ? (
                                    <HiCheck size={24} className="animate-in zoom-in duration-300" />
                                ) : (
                                    <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
                                )}
                            </div>
                            <div className="absolute -bottom-7 w-max">
                                <span
                                    className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300
                    ${isActive || isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}
                  `}
                                >
                                    {step.title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutSteps;