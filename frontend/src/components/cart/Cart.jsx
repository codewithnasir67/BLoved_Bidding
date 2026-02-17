import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus, HiCheck } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart, toggleCartItemSelection, resetCartItemSelection } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCartItemSelection());
  }, [dispatch]);

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const selectedItems = cart?.filter((item) => item.selected);

  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div
      className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50"
      onClick={() => setOpenCart(false)}
    >
      <div
        className="fixed top-0 right-0 h-full w-[80%] 800px:w-[350px] bg-white dark:bg-gray-900 flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-teal to-brand-teal-dark p-5 flex justify-between items-center text-white shadow-md">
          <div className="flex items-center gap-2">
            <IoBagHandleOutline size={25} />
            <h5 className="text-[18px] font-bold">Shopping Cart ({cart?.length || 0})</h5>
          </div>
          <RxCross1
            size={25}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setOpenCart(false)}
          />
        </div>

        {cart && cart.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <IoBagHandleOutline size={50} className="text-brand-teal" />
            </div>
            <h5 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h5>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
            <div className="w-full">
              <Link to="/products" onClick={() => setOpenCart(false)}>
                <button className="w-full bg-brand-teal text-white py-3 rounded-full font-bold shadow-lg hover:bg-brand-teal-dark transition-colors">Start Shopping</button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
              {cart &&
                cart.map((i, index) => (
                  <CartSingle
                    key={index}
                    data={i}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
            </div>

            <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 shadow-lg">
              <Link to={selectedItems.length > 0 ? "/checkout" : "#"}>
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] rounded-full shadow-lg transition-all duration-300 ${selectedItems.length > 0
                    ? "bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:shadow-xl hover:scale-[1.02]"
                    : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    }`}
                  onClick={(e) => {
                    if (selectedItems.length === 0) {
                      e.preventDefault();
                      toast.error("Please select at least one item to checkout!");
                    }
                  }}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (Rs{totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;
  const dispatch = useDispatch();

  const increment = (data) => {
    if (data.stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  const handleSelectionToggle = () => {
    dispatch(toggleCartItemSelection(data._id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex items-center relative group">
      {/* Checkbox */}
      {/* Custom Circular Checkbox */}
      <div className="mr-3" onClick={handleSelectionToggle}>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${data.selected ? 'bg-brand-teal border-brand-teal shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-transparent hover:border-brand-teal'
          }`}>
          {data.selected && <HiCheck size={16} className="text-white transform scale-100 transition-transform duration-200" />}
        </div>
      </div>

      <RxCross1
        className="cursor-pointer absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 placeholder-opacity-0"
        title="Remove Item"
        onClick={() => removeFromCartHandler(data)}
      />

      <div className="w-[80px] h-[80px] flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
        <Link to={`/product/${data._id}`}>
          <img
            src={`${data?.images[0]?.url}`}
            alt=""
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex-1 px-3">
        <Link to={`/product/${data._id}`}>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1 hover:text-brand-teal transition-colors cursor-pointer">
            {data.name}
          </h1>
        </Link>
        <h4 className="font-bold text-brand-teal text-[16px] mb-2">
          Rs{data.discountPrice}
        </h4>

        <div className="flex items-center gap-3">
          <div
            className={`bg-gray-200 dark:bg-gray-700 rounded-full w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors`}
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={14} className="text-gray-600 dark:text-gray-300" />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{data.qty}</span>
          <div
            className={`bg-brand-teal rounded-full w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:bg-brand-teal-dark transition-colors shadow-sm`}
            onClick={() => increment(data)}
          >
            <HiPlus size={14} color="#fff" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
