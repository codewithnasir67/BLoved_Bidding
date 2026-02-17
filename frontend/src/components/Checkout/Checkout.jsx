import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { State, City } from "country-state-city";
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiOutlineUser, HiOutlineTag, HiOutlineArrowRight, HiOutlineHome } from "react-icons/hi";
import { toast } from "react-toastify";
import { server } from "../../server";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const selectedCart = useMemo(() => cart?.filter((item) => item.selected), [cart]);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const latestOrder = localStorage.getItem("latestOrder");
    if (latestOrder) {
      try {
        const data = JSON.parse(latestOrder);

        // Validation: Check if this is a stale order
        let isValidOrder = false;

        if (data.bidId) {
          // Auction orders are always valid to resume
          isValidOrder = true;
        } else if (data.cart && selectedCart && selectedCart.length > 0) {
          // For cart orders, check if items match the current selected cart
          // We create a simple signature of the cart based on Item IDs and Quantities
          const storedCartSignature = data.cart.map(i => `${i._id}-${i.qty}`).sort().join('|');
          const currentCartSignature = selectedCart.map(i => `${i._id}-${i.qty}`).sort().join('|');

          if (storedCartSignature === currentCartSignature) {
            isValidOrder = true;
          }
        } else if (!selectedCart || selectedCart.length === 0) {
          // If current cart is empty but we have data (maybe unlikely on checkout page), treat as valid or stale? 
          // Usually access to checkout is restricted if cart empty. 
          // Let's assume if no current cart, maybe we shouldn't show old data.
          isValidOrder = false;
        }

        if (isValidOrder) {
          setOrderData(data);

          // Populate address fields if they exist
          if (data.shippingAddress) {
            setAddress1(data.shippingAddress.address1 || "");
            setAddress2(data.shippingAddress.address2 || "");
            setZipCode(data.shippingAddress.zipCode || "");
            setProvince(data.shippingAddress.state || "");
            setCity(data.shippingAddress.city || "");
          }

          // Populate user details if overridden
          if (data.user) {
            if (data.user.name) setName(data.user.name);
            if (data.user.phoneNumber) setPhoneNumber(data.user.phoneNumber);
          }
        } else {
          // If stale, clear it so we don't show wrong "Subtotal" or "Address"
          localStorage.removeItem("latestOrder");
          setOrderData(null);
        }
      } catch (error) {
        console.error("Error parsing latestOrder:", error);
      }
    }
  }, [selectedCart]);

  useEffect(() => {
    if (user && !name) setName(user.name || "");
    if (user && !phoneNumber) setPhoneNumber(user.phoneNumber || "");
  }, [user]);

  const subTotalPrice = orderData?.subTotalPrice !== undefined ? Number(orderData.subTotalPrice) : (selectedCart?.length > 0 ? selectedCart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  ) : 0);

  const shipping = orderData?.shipping !== undefined ? Number(orderData.shipping) : (subTotalPrice * 0.1);

  const discountValue = couponCodeData ? Number(discountPrice) : 0;

  const totalPrice = orderData?.totalPrice !== undefined ? Number(orderData.totalPrice) : Number((subTotalPrice + shipping - discountValue).toFixed(2));

  const paymentSubmit = () => {
    if (address1 === "" || zipCode === null || province === "" || city === "") {
      toast.error("Please fill in all required shipping fields!");
      return;
    }
    const shippingAddress = { address1, address2, zipCode, country: "Pakistan", city, state: province };

    if (orderData) {
      const finalOrderData = {
        ...orderData,
        subTotalPrice,
        shipping,
        totalPrice,
        discountPrice: discountValue,
        shippingAddress,
        bidId: orderData.bidId,
        user: {
          ...orderData.user,
          name: name,
          phoneNumber: phoneNumber
        }
      };
      localStorage.setItem("latestOrder", JSON.stringify(finalOrderData));
    } else {
      const cartOrderData = {
        cart: selectedCart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user: {
          ...user,
          name: name,
          phoneNumber: phoneNumber
        },
      };
      localStorage.setItem("latestOrder", JSON.stringify(cartOrderData));
    }
    navigate("/payment");
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode) return;

    try {
      const { data } = await axios.get(`${server}/coupon/get-coupon-value/${couponCode}`);
      if (data.couponCode) {
        // Use orderData cart if it exists (for bids/buy-now), otherwise use regular selected cart
        const currentCart = orderData ? orderData.cart : selectedCart;
        const isCouponValid = currentCart && currentCart.filter((item) => item.shopId === data.couponCode.shopId || item.shop === data.couponCode.shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon not valid for these items");
        } else {
          const eligiblePrice = isCouponValid.reduce((acc, item) => {
            const price = item.discountPrice || item.price;
            return acc + (item.qty || 1) * price;
          }, 0);
          const discount = (eligiblePrice * data.couponCode.value) / 100;
          setDiscountPrice(discount);
          setCouponCodeData(data.couponCode);
          toast.success("Coupon applied!");
        }
      } else {
        toast.error("Invalid coupon code");
      }
    } catch (error) {
      toast.error("Error applying coupon");
    }
    setCouponCode("");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 dark:bg-transparent py-4 animate-fadeIn">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* Left Column: Shipping Form */}
          <div className="flex-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <HiOutlineLocationMarker size={22} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 pl-12 pr-4 text-gray-600 dark:text-gray-400 font-medium focus:ring-2 focus:ring-brand-teal/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Zip Code</label>
                  <input
                    type="number"
                    placeholder="e.g. 54000"
                    value={zipCode || ""}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Province</label>
                  <select
                    className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    <option value="">Choose Province</option>
                    {State && State.getStatesOfCountry("PK").map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">City</label>
                  <select
                    className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Choose City</option>
                    {province && City && City.getCitiesOfState("PK", province).map((item) => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Address Line 1</label>
                  <input
                    type="text"
                    required
                    placeholder="House number and street name"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, etc."
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 px-5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-4">
                <button
                  className="flex items-center gap-2 text-brand-teal font-bold hover:gap-3 transition-all outline-none"
                  onClick={() => setUserInfo(!userInfo)}
                >
                  <HiOutlineHome size={20} />
                  <span>{userInfo ? "Enter address manually" : "Choose from saved addresses"}</span>
                </button>

                {userInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    {user?.addresses?.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setAddress1(item.address1);
                          setAddress2(item.address2);
                          setZipCode(item.zipCode);
                          setProvince(item.state || item.country);
                          setCity(item.city);
                        }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all group
                          ${address1 === item.address1
                            ? 'border-brand-teal bg-brand-teal/5'
                            : 'border-gray-100 dark:border-gray-700 hover:border-brand-teal/30'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900 dark:text-white capitalize">{item.addressType}</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                            ${address1 === item.address1 ? 'border-brand-teal bg-white' : 'border-gray-300'}`}>
                            {address1 === item.address1 && <div className="w-2 h-2 rounded-full bg-brand-teal" />}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.address1}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Order Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">Rs {subTotalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-gray-900 dark:text-white">Rs {shipping.toLocaleString()}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between items-center text-green-500">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">- Rs {discountValue.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-brand-teal">Rs {Number(totalPrice).toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={handleCouponSubmit} className="space-y-4 mb-8">
                <div className="relative">
                  <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-brand-teal text-brand-teal rounded-2xl font-bold text-sm tracking-wide hover:bg-brand-teal hover:text-white transition-all active:scale-[0.98]"
                >
                  Apply Coupon
                </button>
              </form>

              <button
                onClick={paymentSubmit}
                className="w-full py-4 bg-brand-teal text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-teal/20 hover:shadow-2xl hover:bg-brand-teal-dark transition-all transform flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                <span>Go to Payment</span>
                <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="mt-4 text-[11px] text-center text-gray-400 dark:text-gray-500 px-4">
                By proceeding, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
