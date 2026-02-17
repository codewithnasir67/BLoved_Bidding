import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import axios from "axios";
import { server } from "../../../server";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  //   const [select, setSelect] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
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

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full md:w-[90%] lg:w-[70%] h-[90vh] md:h-auto md:max-h-[85vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row">

            {/* Close Button */}
            <div
              className="absolute right-4 top-4 z-50 p-2 bg-gray-100 dark:bg-gray-700 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
              onClick={() => setOpen(false)}
            >
              <RxCross1 size={20} />
            </div>

            {/* Left Side - Image */}
            <div className="w-full md:w-[45%] h-[40vh] md:h-auto bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center p-8 relative">
              <img
                src={`${data.images && data.images[0]?.url}`}
                alt={data.name}
                className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
              {/* Sold Badge */}
              <div className="absolute top-6 left-6 bg-brand-teal/10 dark:bg-brand-teal/20 backdrop-blur-md border border-brand-teal/20 px-3 py-1.5 rounded-full">
                <span className="text-brand-teal dark:text-brand-teal-light text-xs font-bold uppercase tracking-wide">
                  {data?.sold_out} Sold
                </span>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="w-full md:w-[55%] h-full overflow-y-auto p-6 md:p-10 flex flex-col">

              {/* Product Info */}
              <div className="mb-6">
                <Link to={`/shop/preview/${data.shop._id}`} className="inline-block mb-3">
                  <div className="flex items-center gap-2 group">
                    <img
                      src={`${data.shop?.avatar?.url}`}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 group-hover:border-brand-teal/30 transition-colors"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-teal transition-colors">
                        {data.shop.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {data?.ratings} Ratings
                      </p>
                    </div>
                  </div>
                </Link>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {data.name}
                </h1>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4 mb-6">
                  {data.description}
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <h4 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {data.discountPrice} <span className="text-base font-normal text-gray-500">Rs</span>
                  </h4>
                  {data.originalPrice > 0 && (
                    <h3 className="text-lg text-gray-400 line-through font-medium">
                      {data.originalPrice} Rs
                    </h3>
                  )}
                  {data.originalPrice > 0 && (
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                      {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full p-1 w-max">
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold text-lg"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-gray-800 dark:text-white text-lg">
                      {count}
                    </span>
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold text-lg"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  {/* Wishlist */}
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
                  >
                    {click ? (
                      <AiFillHeart size={28} className="text-red-500 bounce-animation" />
                    ) : (
                      <AiOutlineHeart size={28} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    )}
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-red-500 transition-colors">
                      {click ? "In Wishlist" : "Add to Wishlist"}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <button
                    className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => addToCartHandler(data._id)}
                  >
                    Add to Cart <AiOutlineShoppingCart size={20} />
                  </button>

                  <button
                    className="w-full h-12 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 transition-all duration-300"
                    onClick={handleMessageSubmit}
                  >
                    Send Message <AiOutlineMessage size={20} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
