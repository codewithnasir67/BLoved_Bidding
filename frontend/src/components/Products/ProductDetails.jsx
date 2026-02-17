import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";


const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Scroll to top when product page loads
    window.scrollTo(0, 0);

    dispatch(getAllProductsShop(data && data?.shop?._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist!");
      return;
    }
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      return;
    }
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const productAvg = totalRatings / totalReviewsLength || 0;

  // Use shop's direct rating if available, otherwise fall back to product reviews average
  const averageRating = (data?.shop?.averageRating || productAvg).toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop?._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const handleShopRating = async (rating) => {
    if (!isAuthenticated) {
      toast.error("Please login to rate this shop");
      return;
    }

    try {
      await axios.put(
        `${server}/shop/update-shop-rating`,
        {
          shopId: data.shop?._id,
          rating: rating,
        },
        { withCredentials: true }
      );
      toast.success("Thank you for rating this shop!");
      // Refresh shop data to show updated rating
      dispatch(getAllProductsShop(data.shop?._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  };
  const handleSendBid = () => {
    navigate("/BidPage", { state: { product: data } });
  };

  const isOwner = data && user && (data.user?._id === user._id || data.user === user._id);

  return (
    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen py-8">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          {/* Main Product Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-3xl">
            <div className="w-full py-8 px-6 800px:px-10">
              <div className="block w-full 800px:flex gap-8">
                <div className="w-full 800px:w-[35%]">
                  <div className="bg-gradient-to-br from-brand-teal/10 to-brand-purple/10 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md relative group">
                    <img
                      src={`${data && data.images[select]?.url}`}
                      alt=""
                      className="w-full h-48 object-contain rounded-lg"
                    />

                    {/* Left Arrow */}
                    {data && data.images.length > 1 && select > 0 && (
                      <button
                        onClick={() => setSelect(select - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-brand-teal dark:text-brand-teal-light p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    {/* Right Arrow */}
                    {data && data.images.length > 1 && select < data.images.length - 1 && (
                      <button
                        onClick={() => setSelect(select + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-brand-teal dark:text-brand-teal-light p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="w-full flex gap-2 mt-2 overflow-x-auto pb-1">
                    {data &&
                      data.images.map((i, index) => (
                        <div
                          key={index}
                          className={`${select === index
                            ? "border-2 border-brand-teal shadow-md scale-105"
                            : "border border-gray-200 hover:border-brand-teal-light dark:border-gray-600 dark:hover:border-brand-teal"
                            } cursor-pointer rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0`}
                        >
                          <img
                            src={`${i?.url}`}
                            alt=""
                            className="h-[60px] w-[60px] object-cover"
                            onClick={() => setSelect(index)}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="w-full 800px:w-[65%] pt-3 800px:pt-0">
                  <h1 className="text-xl 800px:text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-purple bg-clip-text text-transparent mb-2">
                    {data.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">{data.description}</p>

                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      {data.isBuyerRequest ? (
                        <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                          Budget: {data.startingPrice} Rs
                        </h4>
                      ) : (
                        <>
                          <h4 className="text-3xl font-bold text-gray-800 dark:text-white">
                            {data.discountPrice} Rs
                          </h4>
                          {data.originalPrice && (
                            <h3 className="text-xl text-gray-500 dark:text-gray-400 line-through">
                              {data.originalPrice} Rs
                            </h3>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  {!data.isBuyerRequest && (
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <button
                          className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-brand-teal dark:hover:text-brand-teal-light font-bold text-2xl transition duration-300"
                          onClick={decrementCount}
                        >
                          −
                        </button>
                        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-full px-8 py-2 min-w-[80px] text-center">
                          <span className="text-gray-800 dark:text-white font-semibold text-lg">
                            {count}
                          </span>
                        </div>
                        <button
                          className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-brand-teal dark:hover:text-brand-teal-light font-bold text-2xl transition duration-300"
                          onClick={incrementCount}
                        >
                          +
                        </button>
                      </div>
                      <div className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                        {click ? (
                          <AiFillHeart
                            size={32}
                            className="cursor-pointer"
                            onClick={() => removeFromWishlistHandler(data)}
                            color="#FF6B6B"
                            title="Remove from wishlist"
                          />
                        ) : (
                          <AiOutlineHeart
                            size={32}
                            className="cursor-pointer"
                            onClick={() => addToWishlistHandler(data)}
                            color="#14B8A6"
                            title="Add to wishlist"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col 800px:flex-row gap-4 mb-8">
                    {data.isBuyerRequest ? (
                      isOwner ? (
                        <div className="w-full bg-green-100 text-green-700 px-6 py-4 rounded-2xl font-bold text-center text-lg shadow-sm border border-green-200">
                          Request Status: Active
                        </div>
                      ) : (
                        <button
                          className="flex-1 bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                          onClick={handleSendBid}
                        >
                          <AiOutlineShoppingCart size={24} />
                          <span>Place Bid</span>
                        </button>
                      )
                    ) : (
                      <>
                        <button
                          className="flex-1 bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                          onClick={() => addToCartHandler(data._id)}
                        >
                          <AiOutlineShoppingCart size={24} />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          className="flex-1 bg-gradient-to-r from-brand-coral to-brand-coral-dark text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                          onClick={() => navigate('/auctions')}
                        >
                          <AiOutlineShoppingCart size={24} />
                          <span>Live Auction</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Seller Quick Info */}
                  {!data.isBuyerRequest && data?.shop && (
                    <div className="bg-gradient-to-r from-brand-teal/10 to-brand-purple/10 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg border-2 border-brand-teal/30 dark:border-brand-teal">
                      <div className="flex items-start gap-4">
                        <Link to={`/shop/preview/${data?.shop?._id}`}>
                          <img
                            src={`${data?.shop?.avatar?.url}`}
                            alt=""
                            className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-700 shadow-lg hover:scale-110 transition-transform duration-300"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link to={`/shop/preview/${data?.shop?._id}`}>
                            <h3 className="text-lg font-bold text-brand-teal dark:text-brand-teal-light hover:text-brand-teal-dark dark:hover:text-brand-teal transition-colors">
                              {data?.shop?.name}
                            </h3>
                          </Link>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2">
                              <Ratings
                                rating={averageRating}
                                isInteractive={isAuthenticated}
                                onRatingChange={handleShopRating}
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">({averageRating}/5)</span>
                            </div>
                            {isAuthenticated && (
                              <span className="text-xs text-brand-teal dark:text-brand-teal-light">
                                Click to rate this shop
                              </span>
                            )}
                          </div>
                          {data?.shop?.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                              {data?.shop?.description}
                            </p>
                          )}
                        </div>
                        <button
                          className="bg-gradient-to-r from-brand-coral to-brand-coral-dark text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                          onClick={handleMessageSubmit}
                        >
                          <AiOutlineMessage size={20} />
                          <span className="hidden 800px:inline">Message</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
            isOwner={isOwner}
          />

          {/* User's Buyer Request Bids Management */}


          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const BidItem = ({ bid, product, navigate, onStatusUpdate }) => {
  // Since bids structure inside Product is lean (just IDs often), 
  // ensure we populate it or fetch bids separately. 
  // Wait, Product model usually has array of objects for bids, but references. 
  // If `data.bids` contains full objects with `bidder` (Shop ID), we need to fetch Shop details or if populated.
  // The `getAllProductsShop` action might populate bids? Likely not fully.
  // Better approach: Fetch bids for this product separately using `getProductBids`.
  // But let's assume for now we use what we have or add a fetch inside Effect.

  // Actually, better to fetch bids for this product in ProductDetails if it's a request.

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
        {/* Display Shop Name for Seller Bids - Clickable Link */}
        <Link to={`/shop/preview/${bid.seller?._id}`}>
          <span className="text-brand-teal hover:underline cursor-pointer">
            {bid.seller?.name || bid.bidder?.name || "Seller"}
          </span>
        </Link>
      </td>
      <td className="p-4 font-bold text-brand-teal">Rs {bid.bidAmount}</td>
      <td className="p-4 text-sm text-gray-500">
        {new Date(bid.createdAt).toLocaleString('en-US', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${bid.status === 'accepted' ? 'bg-green-100 text-green-600' :
          bid.status === 'rejected' ? 'bg-red-100 text-red-600' :
            'bg-yellow-100 text-yellow-600'
          }`}>
          {bid.status || 'Pending'}
        </span>
      </td>
      <td className="p-4 text-right">
        {(!bid.status || bid.status === 'pending') && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => updateBidStatus(bid._id, 'accepted')}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
            >
              Accept
            </button>
            <button
              onClick={() => updateBidStatus(bid._id, 'rejected')}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
            >
              Reject
            </button>
          </div>
        )}
        {bid.status === 'accepted' && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                const orderData = {
                  cart: [{
                    _id: product._id,
                    name: product.name,
                    images: product.images,
                    price: bid.bidAmount,
                    discountPrice: bid.bidAmount, // Use bid amount as price
                    shop: bid.seller._id,
                    qty: 1,
                    isBid: true
                  }],
                  subTotalPrice: bid.bidAmount,
                  shipping: 0, // Assuming 0 for now or calculate
                  totalPrice: bid.bidAmount,
                  bidId: bid._id
                };
                // storing in local storage to be consistent with existing Checkout flow which reads from it
                localStorage.setItem("latestOrder", JSON.stringify(orderData));
                navigate("/checkout");
              }}
              className="bg-brand-teal hover:bg-brand-teal-dark text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1"
            >
              <AiOutlineShoppingCart /> Checkout
            </button>
          </div>
        )}

      </td>
    </tr>
  );

  async function updateBidStatus(bidId, status) {
    if (!bidId) {
      // If bidId is missing in the embedded array, we can't update.
      // The embedded bid object in Product might not have the Bid Collection _id.
      // Realistically, we should fetch from /bid/get-all-bids/:productId
      toast.error("Cannot update this bid directly.");
      return;
    }
    try {
      await axios.put(`${server}/bid/${bidId}/status`, { status }, { withCredentials: true });
      toast.success(`Bid ${status}`);
      onStatusUpdate(); // Refresh
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating bid");
    }
  }
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
  isOwner,
}) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(data.isBuyerRequest && isOwner ? 4 : 1);
  const [bids, setBids] = useState([]);

  // Fetch actual bids collection data if it's a buyer request
  useEffect(() => {
    if (data.isBuyerRequest) {
      axios.get(`${server}/bid/product/${data._id}`).then(res => {
        setBids(res.data.bids);
      }).catch(err => console.error(err));
    }
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-wrap justify-around border-b-2 border-gray-100 dark:border-gray-700">
          {!(data.isBuyerRequest && isOwner) && (
            <div className="relative flex-1 min-w-[150px]">
              <button
                className={`w-full py-6 px-4 text-center font-bold text-lg transition-all duration-300 ${active === 1
                  ? "text-brand-teal dark:text-brand-teal-light"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-teal dark:hover:text-brand-teal-light"
                  }`}
                onClick={() => setActive(1)}
              >
                Product Details
              </button>
              {active === 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal to-brand-teal-dark rounded-t-full" />
              )}
            </div>
          )}

          {!data.isBuyerRequest && (
            <div className="relative flex-1 min-w-[150px]">
              <button
                className={`w-full py-6 px-4 text-center font-bold text-lg transition-all duration-300 ${active === 2
                  ? "text-brand-teal dark:text-brand-teal-light"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-teal dark:hover:text-brand-teal-light"
                  }`}
                onClick={() => setActive(2)}
              >
                Product Reviews
              </button>
              {active === 2 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal to-brand-teal-dark rounded-t-full" />
              )}
            </div>
          )}

          {!data.isBuyerRequest && (
            <div className="relative flex-1 min-w-[150px]">
              <button
                className={`w-full py-6 px-4 text-center font-bold text-lg transition-all duration-300 ${active === 3
                  ? "text-brand-teal dark:text-brand-teal-light"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-teal dark:hover:text-brand-teal-light"
                  }`}
                onClick={() => setActive(3)}
              >
                Seller Information
              </button>
              {active === 3 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal to-brand-teal-dark rounded-t-full" />
              )}
            </div>
          )}

          {data.isBuyerRequest && isOwner && (
            <div className="relative flex-1 min-w-[150px]">
              <button
                className={`w-full py-6 px-4 text-center font-bold text-lg transition-all duration-300 ${active === 4
                  ? "text-brand-teal dark:text-brand-teal-light"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-teal dark:hover:text-brand-teal-light"
                  }`}
                onClick={() => setActive(4)}
              >
                Manage Offers
              </button>
              {active === 4 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal to-brand-teal-dark rounded-t-full" />
              )}
            </div>
          )}

        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Product Details Tab */}
          {active === 1 && (
            <div className="bg-gradient-to-br from-brand-teal/5 to-brand-purple/5 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg border-2 border-brand-teal/20 dark:border-brand-teal/40">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-purple bg-clip-text text-transparent mb-4">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {data.description}
              </p>
            </div>
          )}

          {/* Reviews Tab */}
          {active === 2 && (
            <div className="min-h-[40vh]">
              {data && data.reviews.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {data.reviews.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-brand-teal/5 to-brand-coral/5 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 shadow-lg border-2 border-brand-teal/20 dark:border-brand-teal/40 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex gap-4">
                        <img
                          src={`${item.user.avatar?.url}`}
                          alt=""
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg text-gray-800">
                              {item.user.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <Ratings rating={data?.ratings} />
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <h5 className="text-xl font-semibold text-gray-600">
                    No reviews yet
                  </h5>
                  <p className="text-gray-500 mt-2">Be the first to review this product!</p>
                </div>
              )}
            </div>
          )}

          {/* Seller Information Tab */}
          {active === 3 && (
            <div className="bg-gradient-to-br from-brand-teal/5 to-brand-purple/5 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg border-2 border-brand-teal/20 dark:border-brand-teal/40">
              <div className="block 800px:flex gap-8">
                {/* Seller Profile */}
                <div className="w-full 800px:w-[50%] mb-6 800px:mb-0">
                  <Link to={`/shop/preview/${data.shop?._id || ''}`}>
                    <div className="flex items-center gap-4 mb-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <img
                        src={`${data?.shop?.avatar?.url}`}
                        className="w-20 h-20 rounded-full border-4 border-brand-teal shadow-lg"
                        alt=""
                      />
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-coral bg-clip-text text-transparent">
                          {data.shop?.name || 'Seller'}
                        </h3>
                        <p className="text-brand-coral font-semibold text-lg flex items-center gap-1">
                          ⭐ {averageRating}/5 Ratings
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-3">About the Shop</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {data?.shop?.description && data.shop.description.trim() !== ""
                        ? data.shop.description
                        : "No description available for this shop."}
                    </p>
                  </div>
                </div>

                {/* Shop Statistics */}
                <div className="w-full 800px:w-[50%]">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-full p-4">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Joined On</p>
                          <h4 className="text-lg font-bold text-brand-purple dark:text-brand-purple/80">
                            {data.shop?.createdAt?.slice(0, 10)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Offers Tab */}
          {active === 4 && data.isBuyerRequest && isOwner && (
            <div className="bg-gradient-to-br from-brand-teal/5 to-brand-purple/5 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg border-2 border-brand-teal/20 dark:border-brand-teal/40">
              <h3 className="text-2xl font-bold font-Poppins text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <AiOutlineMessage className="text-brand-teal" />
                Manage Offers
              </h3>
              {bids && bids.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Seller Store</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Offer Amount</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Time</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {bids.map((bid, index) => (
                        <BidItem
                          key={index}
                          bid={bid}
                          product={data}
                          navigate={navigate}
                          onStatusUpdate={() => {
                            axios.get(`${server}/bid/product/${data._id}`).then(res => setBids(res.data.bids));
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl">
                  <p>No offers received for this request yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
