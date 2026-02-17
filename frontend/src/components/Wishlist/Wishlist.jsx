import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  }

  return (
    <div
      className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50"
      onClick={() => setOpenWishlist(false)}
    >
      <div
        className="fixed top-0 right-0 h-full w-[80%] 800px:w-[350px] bg-white dark:bg-gray-900 flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-teal to-brand-teal-dark p-5 flex justify-between items-center text-white shadow-md">
          <div className="flex items-center gap-2">
            <AiOutlineHeart size={25} />
            <h5 className="text-[18px] font-bold">My Wishlist ({wishlist?.length || 0})</h5>
          </div>
          <RxCross1
            size={25}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setOpenWishlist(false)}
          />
        </div>

        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <AiOutlineHeart size={50} className="text-red-500" />
            </div>
            <h5 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"> Your wishlist is empty!</h5>
            <p className="text-gray-500 text-sm mb-6">Find something you love and save it for later.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {wishlist &&
              wishlist.map((i, index) => (
                <CartSingle key={index} data={i} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex items-center relative group">
      <RxCross1
        className="cursor-pointer absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        title="Remove"
        onClick={() => removeFromWishlistHandler(data)}
      />

      <div className="w-[80px] h-[80px] flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <Link to={`/product/${data._id}`}>
          <img
            src={`${data?.images[0]?.url}`}
            alt=""
            className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>

      <div className="flex-1 px-3">
        <Link to={`/product/${data._id}`}>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-1 hover:text-brand-teal transition-colors cursor-pointer">{data.name}</h1>
        </Link>
        <h4 className="font-bold text-brand-teal text-[16px]">
          Rs{totalPrice}
        </h4>
      </div>

      <div
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-brand-teal hover:text-white cursor-pointer transition-colors"
        onClick={() => addToCartHandler(data)}
        title="Add to Cart"
      >
        <BsCartPlus size={20} />
      </div>
    </div>
  );
};

export default Wishlist;
