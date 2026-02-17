import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { RiAuctionLine } from "react-icons/ri";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.removeItem("cartItems");
        localStorage.removeItem("wishlistItems");
        dispatch({ type: "clearCart" });
        dispatch({ type: "clearWishlist" });
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const MenuItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div
      className={`relative flex items-center cursor-pointer w-full mb-2 p-3.5 rounded-2xl transition-all duration-300 group ${isActive
        ? "bg-brand-teal text-white shadow-xl shadow-brand-teal/20"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-white rounded-r-full" />
      )}
      <Icon size={22} className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-brand-teal"} transition-colors`} />
      <span className={`pl-3 font-bold text-sm uppercase tracking-wide 800px:block hidden`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-white dark:border-gray-700 flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold bg-gradient-to-r from-brand-teal to-brand-purple bg-clip-text text-transparent mb-2">
          My Account
        </h3>
        <div className="h-1 w-12 bg-gradient-to-r from-brand-teal to-brand-purple rounded-full"></div>
      </div>

      <MenuItem
        icon={RxPerson}
        label="Profile"
        isActive={active === 1}
        onClick={() => setActive(1)}
      />

      <MenuItem
        icon={HiOutlineShoppingBag}
        label="Orders"
        isActive={active === 2}
        onClick={() => setActive(2)}
      />

      <MenuItem
        icon={HiOutlineReceiptRefund}
        label="Refunds"
        isActive={active === 3}
        onClick={() => setActive(3)}
      />

      <MenuItem
        icon={AiOutlineMessage}
        label="Inbox"
        isActive={active === 4}
        onClick={() => setActive(4)}
      />

      <MenuItem
        icon={MdOutlineTrackChanges}
        label="Track Order"
        isActive={active === 5}
        onClick={() => setActive(5)}
      />

      <MenuItem
        icon={HiOutlineCurrencyDollar}
        label="My Bids"
        isActive={active === 9}
        onClick={() => setActive(9)}
      />

      <MenuItem
        icon={RiAuctionLine}
        label="My Requests"
        isActive={active === 10}
        onClick={() => setActive(10)}
      />

      <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

      <MenuItem
        icon={RiLockPasswordLine}
        label="Change Password"
        isActive={active === 6}
        onClick={() => setActive(6)}
      />

      <MenuItem
        icon={TbAddressBook}
        label="Address"
        isActive={active === 7}
        onClick={() => setActive(7)}
      />



      <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

      <div
        className="flex items-center cursor-pointer w-full p-3 rounded-xl transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={22} />
        <span className="pl-3 font-medium 800px:block hidden">
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
