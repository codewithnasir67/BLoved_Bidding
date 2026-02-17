import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      return;
    }
    const isItemExists = cart && cart.find((i) => i._id === data._id);
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
  }
  return (
    <div
      className={`w-full block bg-gradient-to-br from-white via-white to-brand-teal/5 dark:from-gray-800 dark:via-gray-800 dark:to-brand-teal/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-brand-teal/10 dark:border-brand-teal/20 overflow-hidden relative group ${active ? "unset" : "mb-12"
        } lg:flex p-5 gap-8`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-brand-teal/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <div className="w-full lg:w-[40%] flex items-center justify-center">
        <img src={`${data.images[0]?.url}`} alt="" className="rounded-xl object-cover" />
      </div>
      <div className="w-full lg:w-[60%] flex flex-col justify-center mt-5 lg:mt-0">
        <h2 className="text-[25px] font-[700] text-gray-900 dark:text-gray-100 font-sans mb-3">{data.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-[16px] leading-relaxed mb-6">{data.description}</p>
        <div className="flex py-2 justify-between items-center mb-4">
          <div className="flex items-baseline gap-3">
            <h5 className="font-bold text-[24px] text-gray-900 dark:text-white font-Roboto">
              {data.discountPrice}Rs
            </h5>
            <h5 className="font-[500] text-[18px] text-red-400 line-through">
              {data.originalPrice}Rs
            </h5>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-sm shadow-md">
            {data.sold_out} SOLD
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center gap-4 relative z-10">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className="bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white font-bold rounded-full px-8 py-3 shadow-[0_10px_20px_rgba(6,182,212,0.2)] hover:shadow-[0_10px_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all duration-300">
              See Details
            </button>
          </Link>
          <button
            className="bg-transparent border-2 border-brand-teal text-brand-teal dark:text-brand-teal-light font-bold rounded-full px-8 py-2.5 hover:bg-brand-teal hover:text-white transition-all duration-300 shadow-sm"
            onClick={() => addToCartHandler(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
