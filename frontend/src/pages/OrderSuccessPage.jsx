import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineShoppingBag } from "react-icons/hi";

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-1">
        <Success />
      </div>
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-fadeIn">
      <CheckoutSteps active={3} />

      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
          {/* Subtle Background Element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-teal" />

          <div className="relative z-10">
            <Lottie options={defaultOptions} width={240} height={240} />

            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4">
              Order Placed Successfully!
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto">
              Your order has been confirmed and is being processed. Thank you for shopping with BLoved Bidding!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/profile?active=5"
                className="flex items-center justify-center gap-2 py-4 px-8 bg-brand-teal text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark active:scale-[0.98]"
              >
                Track Your Order
                <HiOutlineArrowRight size={20} />
              </Link>

              <Link
                to="/products"
                className="flex items-center justify-center gap-2 py-4 px-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold transition-all hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98]"
              >
                <HiOutlineShoppingBag size={20} />
                Continue Shopping
              </Link>
            </div>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                A confirmation email has been sent to your registered email address with all order details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
