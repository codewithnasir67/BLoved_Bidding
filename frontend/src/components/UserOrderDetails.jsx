import React, { useEffect, useState } from "react";
import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiStar
} from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const data = orders && orders.find((item) => item._id === id);

  if (!data) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center animate-fadeIn">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <HiOutlineShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order not found</h2>
        <Link to="/profile?active=2" className="mt-4 text-brand-teal font-bold hover:underline">
          Back to Order History
        </Link>
      </div>
    );
  }

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?.item?._id || selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user?._id));
        setComment("");
        setRating(1);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Error submitting review");
      });
  };

  const refundHandler = async () => {
    await axios.put(`${server}/order/order-refund/${id}`, {
      status: "Processing refund"
    }).then((res) => {
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user?._id));
    }).catch((error) => {
      toast.error(error?.response?.data?.message || "Error requesting refund");
    })
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-teal-50 text-brand-teal border-brand-teal/20";
      case "Processing":
      case "Shipping":
      case "On the way":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Refund Success":
        return "bg-green-50 text-green-600 border-green-200";
      case "Processing refund":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent py-4 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/profile?active=5"
              className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
            >
              <HiOutlineArrowLeft size={24} className="text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Order Details</h1>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">ID: #{data?._id?.slice(-10)}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border font-bold text-sm uppercase tracking-wider flex items-center gap-2 ${getStatusColor(data?.status)}`}>
            <div className={`w-2 h-2 rounded-full ${data?.status === 'Delivered' ? 'bg-brand-teal' : 'bg-current animate-pulse'}`} />
            {data?.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items & Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-brand-teal/5 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HiOutlineShoppingBag className="text-brand-teal" />
                Order Items ({data?.cart?.length})
              </h3>

              <div className="space-y-6">
                {data?.cart?.map((item, index) => {
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
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{product?.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Rs {price?.toLocaleString()} × {item?.qty}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-center gap-2">
                        <span className="font-bold text-brand-teal tracking-tight whitespace-nowrap text-lg">
                          Rs {(price * item?.qty).toLocaleString()}
                        </span>
                        {!item?.isReviewed && data?.status === "Delivered" && (
                          <button
                            onClick={() => { setOpen(true); setSelectedItem(item); }}
                            className="text-[11px] font-black uppercase tracking-widest text-brand-teal hover:underline"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Summary inside Items Card for mobile-like feel */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">Rs {data?.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-widest">Free</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-700/50">
                  <span className="text-lg font-black text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-brand-teal tracking-tighter">Rs {data?.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Refund Action Card */}
            {data?.status === "Delivered" && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-3xl p-6 border border-amber-100 dark:border-amber-900/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-amber-800 dark:text-amber-400">Not satisfied with your purchase?</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-500/80">You can request a refund for delivered items.</p>
                </div>
                <button
                  onClick={refundHandler}
                  className="px-6 py-3 bg-white dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all whitespace-nowrap active:scale-95"
                >
                  Request Refund
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Address & Payment Info */}
          <div className="space-y-8">
            {/* Address Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-brand-teal/5 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HiOutlineLocationMarker className="text-brand-teal" />
                Shipping
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <HiOutlineUser size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{data?.user?.name}</p>
                    <p className="text-sm text-gray-500">{data?.user?.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <HiOutlineTruck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {data?.shippingAddress?.address1} {data?.shippingAddress?.address2 && `, ${data?.shippingAddress?.address2}`}
                      <br />
                      {data?.shippingAddress?.city}, {data?.shippingAddress?.state || data?.shippingAddress?.country}
                      <br />
                      {data?.shippingAddress?.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-brand-teal/5 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HiOutlineCreditCard className="text-brand-teal" />
                Payment Info
              </h3>
              <div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${data?.paymentInfo?.status === 'Succeeded' ? 'text-brand-teal' : 'text-amber-500'}`}>
                      {data?.paymentInfo?.status || "Not Paid"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Method</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {data?.paymentInfo?.type || "Cash on Delivery"}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/user/track/order/${id}`}
                  className="mt-6 w-full py-4 bg-brand-teal text-white font-bold rounded-2xl shadow-lg shadow-brand-teal/20 hover:shadow-2xl hover:bg-brand-teal-dark transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  <HiOutlineTruck size={20} className="group-hover:translate-x-1 transition-transform" />
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Give a Review</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <RxCross1 size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex gap-4 items-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={(selectedItem?.item?.images || selectedItem?.images)?.[0]?.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{selectedItem?.item?.name || selectedItem?.name}</h4>
                  <p className="text-sm text-gray-500">Rs {selectedItem?.price || selectedItem?.discountPrice} × {selectedItem?.qty}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setRating(i)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      {rating >= i ? (
                        <HiStar size={36} className="text-amber-400" />
                      ) : (
                        <HiStar size={36} className="text-gray-200 dark:text-gray-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal transition-all font-medium resize-none"
                />
              </div>

              <button
                onClick={reviewHandler}
                className="w-full py-4 bg-brand-teal text-white font-bold rounded-2xl shadow-lg shadow-brand-teal/20 hover:shadow-2xl hover:scale-[1.01] active:scale-95 transition-all"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
