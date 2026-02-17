import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineClipboardCheck,
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiCheck
} from "react-icons/hi";
import { MdOutlinePrecisionManufacturing } from "react-icons/md";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const getStatusIndex = (status) => {
    const statuses = [
      "Processing",
      "Transferred to delivery partner",
      "Shipping",
      "Received",
      "On the way",
      "Delivered",
    ];
    return statuses.indexOf(status);
  };

  const steps = [
    {
      title: "Order Placed",
      description: "We have received your order",
      icon: HiOutlineShoppingBag,
      status: "Processing",
    },
    {
      title: "Processing",
      description: "Your order is being prepared in the shop",
      icon: MdOutlinePrecisionManufacturing,
      status: "Processing",
    },
    {
      title: "In Transit",
      description: "Your order is with our delivery partner",
      icon: HiOutlineTruck,
      status: ["Transferred to delivery partner", "Shipping"],
    },
    {
      title: "Out for Delivery",
      description: "Our delivery person is on the way to you",
      icon: HiOutlineClipboardCheck,
      status: ["Received", "On the way"],
    },
    {
      title: "Delivered",
      description: "Order has been successfully delivered",
      icon: HiOutlineHome,
      status: "Delivered",
    },
  ];

  const currentStatusIndex = data ? getStatusIndex(data.status) : 0;

  // Handle special refund statuses
  const isRefund = data?.status === "Processing refund" || data?.status === "Refund Success";

  return (
    <div className="w-full min-h-[80vh] bg-gray-50/50 dark:bg-gray-900/50 py-12 px-4 md:px-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        {/* Back Button & Title */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/profile?active=5"
            className="flex items-center gap-2 text-gray-500 hover:text-brand-teal transition-colors group bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wider">Back to Orders</span>
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Track Order</h1>
            <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mt-1">Order #{id?.slice(-8)}</p>
          </div>
        </div>

        {isRefund ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl shadow-brand-teal/5 border border-gray-100 dark:border-gray-700 text-center space-y-4">
            <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto text-brand-teal mb-6">
              <HiOutlineClipboardCheck size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {data?.status === "Processing refund" ? "Refund in Progress" : "Refund Successful"}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {data?.status === "Processing refund"
                ? "Your refund request is being processed. It usually takes 3-5 business days."
                : "The refund has been successfully credited back to your original payment method."}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-brand-teal/5 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-bl-full -mr-10 -mt-10" />

            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;

                // Logic to determine if step is active or completed
                let isCompleted = false;
                let isActive = false;

                if (data?.status === "Delivered") {
                  isCompleted = true;
                } else {
                  const statusMap = {
                    "Processing": 1,
                    "Transferred to delivery partner": 2,
                    "Shipping": 2,
                    "Received": 3,
                    "On the way": 3,
                    "Delivered": 4
                  };
                  const stage = statusMap[data?.status] || 0;
                  isCompleted = index < stage;
                  isActive = index === stage;
                }

                return (
                  <div key={index} className="flex gap-6 md:gap-8 group">
                    {/* Stepper Visual */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg relative z-10
                        ${isCompleted ? 'bg-brand-teal text-white shadow-brand-teal/30 scale-110' :
                          isActive ? 'bg-white dark:bg-gray-700 text-brand-teal border-2 border-brand-teal animate-pulse' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}
                      >
                        {isCompleted ? <HiCheck size={24} /> : <Icon size={24} />}
                      </div>

                      {/* Connector Line */}
                      {index !== steps.length - 1 && (
                        <div className={`w-0.5 h-full my-2 transition-all duration-1000 delay-300
                          ${isCompleted ? 'bg-brand-teal shadow-[0_0_10px_rgba(45,183,184,0.5)]' : 'bg-gray-100 dark:bg-gray-700'}`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-8">
                      <h3 className={`text-lg font-bold transition-colors duration-300
                        ${isCompleted || isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
                      >
                        {step.title}
                      </h3>
                      <p className={`text-sm mt-1 transition-colors duration-300
                        ${isActive ? 'text-brand-teal font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {isActive ? (
                          <span className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
                            </span>
                            {data?.status === "Processing" ? "Processing in shop" :
                              data?.status === "Transferred to delivery partner" ? "With courier partner" :
                                data?.status === "Shipping" ? "In transit" :
                                  data?.status === "Received" ? "In your city" :
                                    data?.status === "On the way" ? "Out for delivery" :
                                      step.description}
                          </span>
                        ) : step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-widest font-bold">
          <p>We'll notify you when your order status changes</p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
