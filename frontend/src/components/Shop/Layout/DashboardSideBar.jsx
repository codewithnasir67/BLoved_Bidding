import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { RiAuctionLine } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DashboardSideBar = ({ active }) => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      });
      toast.success("Log out successful!");
      window.location.reload(true);
      navigate("/shop-login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const menuItems = [
    { id: 1, label: "Dashboard", icon: <RxDashboard size={24} />, path: "/dashboard" },
    { id: 2, label: "All Orders", icon: <FiShoppingBag size={24} />, path: "/dashboard-orders" },
    { id: 3, label: "All Products", icon: <FiPackage size={24} />, path: "/dashboard-products" },
    { id: 5, label: "All Events", icon: <MdOutlineLocalOffer size={24} />, path: "/dashboard-events" },
    { id: 12, label: "All Bids (Received)", icon: <RiAuctionLine size={24} />, path: "/dashboard-bids" },
    { id: 13, label: "My Offers (Placed)", icon: <MdOutlineLocalOffer size={24} />, path: "/dashboard-my-bids" },
    { id: 7, label: "Withdraw Money", icon: <CiMoneyBill size={24} />, path: "/dashboard-withdraw-money" },
    { id: 8, label: "Shop Inbox", icon: <BiMessageSquareDetail size={24} />, path: "/dashboard-messages" },
    { id: 9, label: "Discount Codes", icon: <AiOutlineGift size={24} />, path: "/dashboard-coupouns" },
    { id: 10, label: "Refunds", icon: <HiOutlineReceiptRefund size={24} />, path: "/dashboard-refunds" },
    { id: 11, label: "Settings", icon: <CiSettings size={24} />, path: "/settings" },
  ];

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-sm overflow-y-scroll overflow-x-hidden sticky top-[80px] left-0 z-10 py-6 pl-4">
      {/* Header Section */}
      <div className="px-4 mb-6">
        <h5 className="text-[18px] font-[600] text-brand-teal dark:text-white pb-2 relative inline-block">
          My Account
          <span className="absolute bottom-0 left-0 w-[40px] h-[3px] bg-brand-teal rounded-full"></span>
        </h5>
      </div>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <div className="w-full px-2 mb-2" key={item.id}>
          <Link
            to={item.path}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative 
              ${active === item.id
                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-teal"
              }`}
          >
            {/* Active Notch Indicator */}
            {active === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[5px] bg-white rounded-r-md shadow-sm" />
            )}

            <span className="relative z-10">{item.icon}</span>
            <h5 className="hidden 800px:block pl-3 text-[15px] font-[600] uppercase relative z-10 transition-transform duration-200 group-hover:translate-x-1">
              {item.label}
            </h5>
          </Link>
        </div>
      ))}

      {/* Logout Section */}
      <div className="w-full px-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div
          onClick={logoutHandler}
          className="w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
        >
          <span className="relative z-10">
            <AiOutlineLogout size={24} />
          </span>
          <h5 className="hidden 800px:block pl-3 text-[15px] font-[600] uppercase relative z-10 transition-transform duration-200 group-hover:translate-x-1">
            Log Out
          </h5>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideBar;
