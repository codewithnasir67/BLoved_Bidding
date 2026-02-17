import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { HiOutlineCreditCard, HiOutlineCash, HiOutlineShieldCheck, HiOutlineArrowRight } from "react-icons/hi";
import { toast } from "react-toastify";
import { server } from "../../server";
import { clearCart } from "../../redux/actions/cart";
const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(data);
  }, []);

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(`${server}/payment/process`, paymentData, config);
      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const finalOrder = {
            cart: orderData.cart.map(item => ({
              ...item,
              shopId: item.shopId || item.shop
            })),
            shippingAddress: orderData.shippingAddress,
            user: user,
            totalPrice: orderData.totalPrice,
            orderType: orderData.cart.some(item => item.isAuctionItem) ? 'auction' : 'cart',
            bidId: orderData?.bidId,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              type: "Credit Card",
            }
          };

          await axios.post(`${server}/order/create-order`, finalOrder, config);
          toast.success("Order successful!");

          // Clear cart logic
          dispatch(clearCart());
          localStorage.setItem("latestOrder", JSON.stringify([]));

          navigate("/order/success");
        }
      }
    } catch (error) {
      toast.error(error.message || "Payment failed");
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    if (!orderData || !orderData.cart) {
      toast.error("Order data is missing. Please try again.");
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const finalOrder = {
        cart: orderData.cart.map(item => ({
          ...item,
          shopId: item.shopId || item.shop
        })),
        shippingAddress: orderData.shippingAddress,
        user: user,
        totalPrice: orderData.totalPrice,
        orderType: orderData.cart.some(item => item.isAuctionItem) ? 'auction' : 'cart',
        bidId: orderData?.bidId,
        paymentInfo: { type: "Cash On Delivery" }
      };

      await axios.post(`${server}/order/create-order`, finalOrder, config);
      toast.success("Order successful!");

      // Clear cart logic
      dispatch(clearCart());
      localStorage.setItem("latestOrder", JSON.stringify([]));

      navigate("/order/success");
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || error.message || "Error creating order");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 dark:bg-transparent py-4 animate-fadeIn">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          <div className="flex-1">
            <PaymentInfo
              user={user}
              paymentHandler={paymentHandler}
              cashOnDeliveryHandler={cashOnDeliveryHandler}
            />
          </div>
          <div className="w-full lg:w-[400px]">
            <CartData orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({ user, paymentHandler, cashOnDeliveryHandler }) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
          <HiOutlineShieldCheck size={22} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h3>
      </div>

      <div className="space-y-4">
        {/* Credit Card Option */}
        <div
          onClick={() => setSelect(1)}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all group
            ${select === 1
              ? 'border-brand-teal bg-brand-teal/5'
              : 'border-gray-100 dark:border-gray-700/50 hover:border-brand-teal/30'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                ${select === 1 ? 'bg-brand-teal text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'}`}>
                <HiOutlineCreditCard size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Credit / Debit Card</h4>
                <p className="text-sm text-gray-500">Secure payment via Stripe</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${select === 1 ? 'border-brand-teal bg-white' : 'border-gray-300'}`}>
              {select === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-teal" />}
            </div>
          </div>

          {select === 1 && (
            <form className="space-y-6 animate-fadeIn mt-6 pt-6 border-t border-brand-teal/10" onSubmit={paymentHandler}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Name on Card</label>
                  <input
                    required
                    placeholder={user?.name}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-3 px-5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Expiry Date</label>
                  <div className="w-full bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 transition-all focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal">
                    <CardExpiryElement options={{ style: { base: { fontSize: "16px", color: "#444" } } }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Card Number</label>
                  <div className="w-full bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 transition-all focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal">
                    <CardNumberElement options={{ style: { base: { fontSize: "16px", color: "#444" } } }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">CVV</label>
                  <div className="w-full bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 transition-all focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal">
                    <CardCvcElement options={{ style: { base: { fontSize: "16px", color: "#444" } } }} />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-brand-teal text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-teal/20 hover:shadow-2xl hover:bg-brand-teal-dark transition-all transform flex items-center justify-center gap-3 group"
              >
                <span>Confirm Payment</span>
                <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* Cash on Delivery Option */}
        <div
          onClick={() => setSelect(3)}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all group
            ${select === 3
              ? 'border-brand-teal bg-brand-teal/5'
              : 'border-gray-100 dark:border-gray-700/50 hover:border-brand-teal/30'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                ${select === 3 ? 'bg-brand-teal text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'}`}>
                <HiOutlineCash size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Cash on Delivery</h4>
                <p className="text-sm text-gray-500">Pay when your order arrives</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${select === 3 ? 'border-brand-teal bg-white' : 'border-gray-300'}`}>
              {select === 3 && <div className="w-2.5 h-2.5 rounded-full bg-brand-teal" />}
            </div>
          </div>

          {select === 3 && (
            <form className="animate-fadeIn mt-6 pt-6 border-t border-brand-teal/10" onSubmit={cashOnDeliveryHandler}>
              <button
                type="submit"
                className="w-full py-4 bg-brand-teal text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-teal/20 hover:shadow-2xl hover:bg-brand-teal-dark transition-all transform flex items-center justify-center gap-3 group"
              >
                <span>Confirm Selection</span>
                <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const subTotalPrice = orderData?.subTotalPrice || 0;
  const shipping = orderData?.shipping || 0;
  const totalPrice = orderData?.totalPrice || 0;
  const discountPrice = orderData?.discountPrice || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Order Summary</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
          <span className="font-medium">Subtotal</span>
          <span className="font-bold text-gray-900 dark:text-white">Rs {subTotalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
          <span className="font-medium">Shipping</span>
          <span className="font-bold text-gray-900 dark:text-white">Rs {shipping.toLocaleString()}</span>
        </div>
        {discountPrice > 0 && (
          <div className="flex justify-between items-center text-green-500">
            <span className="font-medium">Discount</span>
            <span className="font-bold">- Rs {discountPrice.toLocaleString()}</span>
          </div>
        )}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
          <span className="text-2xl font-black text-brand-teal">Rs {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Your payment data is encrypted and secure. We do not store sensitive card information.
        </p>
      </div>
    </div>
  );
};

export default Payment;
