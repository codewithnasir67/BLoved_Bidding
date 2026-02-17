import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import Loader from "../Layout/Loader";
import styles from "../../styles/styles";
import CountDown from "./CountDown.jsx";
import {
  RiAuctionLine,
  RiHandCoinLine,
  RiTimeLine,
  RiUserVoiceLine,
  RiHistoryLine,
  RiArrowRightLine,
  RiCopperCoinLine,
  RiShoppingCartLine
} from "react-icons/ri";

const LiveAuctions = () => {
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
    const interval = setInterval(fetchAuctions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data } = await axios.get(`${server}/auction/active`);
      // Filter out buyer requests from the public live auctions feed
      const activeAuctions = data.products.filter(p => !p.isBuyerRequest);
      setAuctions(activeAuctions);
      const initialBidAmounts = {};
      data.products.forEach(product => {
        initialBidAmounts[product._id] = (product.currentPrice || product.startingPrice) + product.incrementValue;
      });
      setBidAmounts(initialBidAmounts);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching auctions");
      setLoading(false);
    }
  };

  const handleBidSubmit = async (productId) => {
    try {
      if (!user && !seller) {
        toast.error("Please login to place a bid");
        return navigate("/login");
      }

      const bidAmount = bidAmounts[productId];
      const product = auctions.find(p => p._id === productId);

      if (!bidAmount) {
        toast.error("Please enter a bid amount");
        return;
      }

      const minBidAmount = (product.currentPrice || product.startingPrice) + product.incrementValue;
      if (bidAmount < minBidAmount) {
        toast.error(`Bid must be at least Rs${minBidAmount}`);
        return;
      }

      let endpoint = `${server}/bid`;

      if (product.isBuyerRequest) {
        if (!seller) {
          toast.error("Only sellers can bid on requests");
          return;
        }
        endpoint = `${server}/bid/seller-bid`;
      } else {
        if (!user) {
          toast.error("Please login as User to bid");
          return;
        }
      }

      setLoading(true);
      const response = await axios.post(
        endpoint,
        {
          productId,
          bidAmount: parseFloat(bidAmount)
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Bid placed successfully!");
        await fetchAuctions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing bid");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (productId) => {
    try {
      if (!user) {
        toast.error("Please login to buy");
        return navigate("/login");
      }

      const product = auctions.find(p => p._id === productId);
      if (!product) {
        toast.error("Product not found");
        return;
      }

      const buyNowPrice = product.buyNowPrice;

      // Check if buy now price exists
      if (!buyNowPrice) {
        toast.error("Buy now is not available for this auction");
        return;
      }

      // Format the order data with a cart array for compatibility
      const orderData = {
        totalPrice: buyNowPrice,
        subTotalPrice: buyNowPrice,
        shipping: 0,
        discountPrice: 0,
        cart: [{
          _id: product._id,
          name: product.name,
          description: product.description,
          price: buyNowPrice,
          discountPrice: buyNowPrice,
          qty: 1,
          images: product.images,
          shopId: product.shopId,
        }],
        user,
        isBuyNow: true
      };

      // Store order data in localStorage
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/checkout");

    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing purchase");
    }
  };

  const handleBidAmountChange = (productId, value) => {
    setBidAmounts(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Enhanced Hero Section */}
          <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-10 mb-8 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-brand-purple/5 rounded-full blur-3xl"></div>

            <div className={`${styles.section} relative z-10`}>
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-3 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-100 dark:border-red-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Live & Active</span>
                </div>
                <h1 className="text-[32px] md:text-[42px] font-black text-gray-900 dark:text-white leading-tight font-Poppins mb-3">
                  Bids are <span className="text-brand-teal italic">Flowing!</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-xl font-medium mb-6">
                  Real-time competitive bidding on premium items. Place your bid now and win big before the timer hits zero.
                </p>
                <button
                  className="bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-brand-teal/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 animate-bounce-slow"
                  onClick={() => navigate("/create-request")}
                >
                  <RiAuctionLine size={20} />
                  Create Auction Request
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.section}`}>
            {auctions.length === 0 ? (
              <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-20 flex flex-col items-center justify-center min-h-[400px] text-center relative overflow-hidden animate-fade-in">
                <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-full mb-6 border border-gray-100 dark:border-gray-800">
                  <RiAuctionLine className="text-gray-300 dark:text-gray-600" size={64} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 font-Poppins">The Floor is Empty</h3>
                <p className="text-gray-400 dark:text-gray-500 max-w-sm mb-6">No live auctions at the moment. Please stay tuned for our upcoming premium collections.</p>
                <button
                  className="text-brand-teal font-bold hover:underline transition-all"
                  onClick={() => navigate("/create-request")}
                >
                  Want something specific? Post a Request
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {auctions.map((product, index) => (
                  <div
                    key={product._id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image & Countdown Section */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isBuyerRequest ? (
                          <div className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            REQUEST
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            LIVE
                          </div>
                        )}
                      </div>

                      {/* Floating Countdown */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-2 px-4 shadow-xl">
                        <div className="flex items-center justify-center gap-2 text-white">
                          <RiTimeLine size={14} className="text-orange-400" />
                          <div className="font-bold text-sm tracking-widest">
                            <CountDown endTime={product.auctionEndTime} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1.5">
                        <h3
                          className="text-base font-bold text-gray-800 dark:text-gray-100 leading-tight truncate block cursor-pointer hover:text-brand-teal transition-colors"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          {product.name}
                        </h3>
                        {product.bids?.length > 0 && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-1.5 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
                            <RiUserVoiceLine size={9} />
                            <span>{product.bids.length}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mb-4 font-medium leading-relaxed block">
                        {product.description}
                      </p>

                      {/* Price Section */}
                      <div className="flex items-end justify-between mb-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Current Bid</span>
                          <span className="text-lg font-black text-brand-teal leading-none">
                            Rs {product.currentPrice?.toLocaleString() || product.startingPrice?.toLocaleString()}
                          </span>
                        </div>
                        {product.buyNowPrice && (
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Buy Now</span>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Rs {product.buyNowPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Bid Interaction Section */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 group/input">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">Rs</span>
                            <input
                              type="number"
                              value={bidAmounts[product._id] || ''}
                              placeholder={`${(product.currentPrice || product.startingPrice) + product.incrementValue}`}
                              className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                              onChange={(e) => handleBidAmountChange(product._id, e.target.value)}
                            />
                          </div>
                          <button
                            className="bg-brand-teal hover:bg-brand-teal-dark text-white p-2 rounded-lg transition-all duration-300 shadow-lg shadow-brand-teal/20 active:scale-95 disabled:opacity-50 group/bid"
                            onClick={() => handleBidSubmit(product._id)}
                            disabled={loading}
                          >
                            <RiArrowRightLine size={18} className="group-hover/bid:translate-x-1 transition-transform" />
                          </button>
                        </div>

                        {product.buyNowPrice && (
                          <button
                            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-[1.5px] border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-3 py-2 rounded-lg font-bold text-[10px] transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-wider"
                            onClick={() => handleBuyNow(product._id)}
                            disabled={loading}
                          >
                            <RiShoppingCartLine size={13} />
                            Instant Buy
                          </button>
                        )}
                      </div>

                      {/* Recent Bids Preview */}
                      {product.bids && product.bids.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                          <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-2">
                            <RiHistoryLine size={10} />
                            <span>Recent Activity</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {product.bids.slice(-2).reverse().map((bid, i) => (
                              <div key={i} className="flex items-center justify-between text-[10px] font-semibold">
                                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                  <RiUserVoiceLine size={10} className="text-gray-300" />
                                  Bid placed
                                </span>
                                <span className="text-brand-teal">Rs {bid.amount.toLocaleString()}</span>
                              </div>
                            ))}
                            {product.bids.length > 2 && (
                              <div
                                className="text-center mt-1 cursor-pointer hover:text-brand-teal transition-colors"
                                onClick={() => navigate(`/product/${product._id}`)}
                              >
                                <span className="text-gray-400 text-lg leading-none hover:text-brand-teal">...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LiveAuctions;
