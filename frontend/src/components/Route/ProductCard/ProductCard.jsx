import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSell, MdOutlineLocalOffer } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();



  useEffect(() => {
    if (data && wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

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
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };


  if (!data) return null;

  return (
    <>
      <div className="group relative w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden flex flex-col h-full min-h-[350px]">

        {/* Image Display Section - Full Fill */}
        <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <Link
            to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
            className="w-full h-full"
          >
            <img
              src={data.images?.[0]?.url}
              alt={data.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </Link>

          {/* Quick View - Top Left */}
          <button
            className="absolute top-3 left-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all z-20"
            onClick={() => setOpen(!open)}
            title="Quick view"
          >
            <AiOutlineEye size={18} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* Discount Badge - Standardized */}
          {data.originalPrice > data.discountPrice && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-md z-10 uppercase tracking-tighter">
              {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
            </div>
          )}

          {/* Add to Cart/Wishlist Floating - Hidden or secondary in reference, keeping wish for UX */}
          <div className="absolute right-3 bottom-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            {click ? (
              <button
                className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-md hover:bg-red-50 transition-all border border-gray-100"
                onClick={() => removeFromWishlistHandler(data)}
              >
                <AiFillHeart size={16} className="text-red-500" />
              </button>
            ) : (
              <button
                className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-md hover:bg-gray-50 transition-all border border-gray-100"
                onClick={() => addToWishlistHandler(data)}
              >
                <AiOutlineHeart size={16} className="text-gray-400" />
              </button>
            )}
            <button
              className="w-8 h-8 bg-brand-teal text-white rounded-lg flex items-center justify-center shadow-md hover:bg-brand-teal-dark transition-all"
              onClick={() => addToCartHandler(data._id)}
            >
              <AiOutlineShoppingCart size={16} />
            </button>
          </div>
        </div>

        {/* Floating Actions Hub Removed from here - moved into image container above */}

        {/* Info Content Section - Reference Matched Layout */}
        <div className="p-4 flex-1 flex flex-col bg-white dark:bg-gray-800">
          {data?.shop && (
            <div className="mb-2">
              <div className="inline-flex items-center gap-1.5 bg-brand-teal/10 px-2 py-0.5 rounded-md border border-brand-teal/5">
                <span className="w-1 h-1 rounded-full bg-brand-teal"></span>
                <span className="text-[10px] font-black uppercase tracking-tight text-brand-teal">
                  {data.shop.name}
                </span>
              </div>
            </div>
          )}

          <div className="mb-2">
            <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
              <h4 className="text-[14px] font-bold text-gray-800 dark:text-gray-100 truncate hover:text-brand-teal transition-colors" title={data.name}>
                {data.name}
              </h4>
            </Link>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black text-gray-900 dark:text-white">
                Rs {data.discountPrice?.toLocaleString() || data.originalPrice?.toLocaleString()}
              </span>
              {data.originalPrice > data.discountPrice && (
                <span className="text-[12px] text-gray-400 line-through font-medium">
                  Rs {data.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-brand-teal uppercase tracking-tight">
                {data?.stock || 0} in stock
              </span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">•</span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                {data?.sold_out || 0} sold
              </span>
            </div>
          </div>
        </div>

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
