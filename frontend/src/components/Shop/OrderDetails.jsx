import React, { useEffect, useState } from "react";
import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineClipboardList,
  HiOutlineRefresh
} from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import styles from "../../styles/styles";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const data = orders?.find((item) => item._id === id);

  useEffect(() => {
    if (data) {
      setStatus(data.status || "Processing");
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center animate-fadeIn">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <HiOutlineShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order not found</h2>
        <Link to="/dashboard-orders" className="mt-4 text-brand-teal font-bold hover:underline">
          Back to Orders List
        </Link>
      </div>
    );
  }

  const shopItems = data.cart.filter(item => {
    const itemShopId = item.shopId || (item.shop && item.shop._id) || (item.item && item.item.shopId);
    return String(itemShopId) === String(seller._id);
  });

  const shopTotal = shopItems.reduce((total, item) => {
    const product = item?.item || item;
    const price = item?.price || product?.discountPrice || product?.price;
    return total + (price * (item.qty || 1));
  }, 0);

  const orderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );

      toast.success("Order status updated successfully!");
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating order status");
    }
  };

  const statusOptions = [
    "Processing",
    "Transferred to delivery partner",
    "Shipping",
    "On the way",
    "Delivered",
  ];

  const currentStatusIndex = statusOptions.indexOf(data.status);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] dark:bg-gray-900/50 p-4 md:p-8 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard-orders"
              className="p-3 bg-white dark:bg-gray-800 hover:bg-brand-teal hover:text-white rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-gray-700 group"
            >
              <HiOutlineArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Order Details</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: #{data?._id?.slice(-10)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(data?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {data?.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Info & Items */}
          <div className="lg:col-span-2 space-y-8">

            {/* Status Update Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HiOutlineRefresh className="text-brand-teal" />
                Update Order Status
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-6 text-gray-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal transition-all appearance-none cursor-pointer"
                >
                  {statusOptions.slice(currentStatusIndex).map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
                <button
                  onClick={orderUpdateHandler}
                  disabled={data?.status === "Delivered"}
                  className="px-8 py-4 bg-brand-teal text-white font-bold rounded-2xl shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Update Status
                </button>
              </div>
              {data?.status === "Delivered" && (
                <p className="text-xs text-brand-teal font-bold mt-3 uppercase tracking-widest pl-1">Order has been successfully delivered</p>
              )}
            </div>

            {/* Items Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-0 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <HiOutlineShoppingBag className="text-brand-teal" />
                  Shop Items ({shopItems.length})
                </h3>
                <span className="text-xl font-black text-brand-teal tracking-tighter">Rs {shopTotal.toLocaleString()}</span>
              </div>

              <div className="p-6 space-y-6">
                {shopItems.map((item, index) => {
                  const product = item?.item || item;
                  const price = item?.price || product?.discountPrice || product?.price;
                  const images = product?.images || item?.images;

                  return (
                    <div key={index} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-gray-900 overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0">
                        <img
                          src={images?.[0]?.url}
                          alt={product?.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-teal transition-colors">{product?.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-gray-400">Rs {price?.toLocaleString()}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Qty: {item.qty}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <span className="font-black text-gray-900 dark:text-white tracking-tight whitespace-nowrap">
                          Rs {(price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Shipping */}
          <div className="space-y-8">
            {/* Customer Details */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HiOutlineUser className="text-brand-teal" />
                Customer Info
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal font-black text-xl">
                  {data?.user?.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{data?.user?.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{data?.user?.email}</p>
                  <p className="text-sm text-brand-teal font-bold mt-0.5">{data?.user?.phoneNumber}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 dark:border-gray-700 space-y-4">
                <div className="flex gap-3">
                  <HiOutlineLocationMarker className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                    {data?.shippingAddress ? (
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                        {data.shippingAddress.address1}, {data.shippingAddress.address2 && `${data.shippingAddress.address2}, `}
                        <br />
                        {data.shippingAddress.city}, {data.shippingAddress.state || data.shippingAddress.country}
                        <br />
                        {data.shippingAddress.zipCode}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No address provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HiOutlineCreditCard className="text-brand-teal" />
                Payment Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Method</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{data?.paymentInfo?.type || "Cash on Delivery"}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg ${data?.paymentInfo?.status === 'Succeeded' ? 'bg-teal-50 text-brand-teal' : 'bg-amber-50 text-amber-600'}`}>
                      {data?.paymentInfo?.status || "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Shop Payout</span>
                    <span className="text-lg font-black text-brand-teal tracking-tighter">Rs {shopTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <HiOutlineClipboardList className="text-gray-400" size={20} />
                  <p className="text-[11px] font-bold text-gray-500 uppercase leading-relaxed tracking-wider">
                    Make sure to update the status once the order is shipped to notify the customer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
