import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { IoIosArrowForward, IoMdSettings } from "react-icons/io";
import { HiOutlineUser } from "react-icons/hi";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-[80px] bg-white dark:bg-gray-900 shadow-sm sticky top-0 left-0 z-30 flex items-center justify-between px-4 md:px-8 border-b border-gray-100 dark:border-gray-800">
      <div>
        <Link to="/dashboard">
          <img src="/BB-Logo.png" alt="BLoved-Bidding Logo" className="h-14 w-auto object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* View Profile Button */}
        <Link to="/settings" className="hidden sm:flex items-center gap-2 text-brand-teal font-semibold hover:text-brand-teal-dark transition-colors bg-brand-teal/10 px-4 py-2 rounded-full">
          <HiOutlineUser size={18} />
          <span>View Profile</span>
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{seller.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Seller</p>
          </div>
          <Link to={`/shop/${seller._id}`}>
            <img
              src={`${seller.avatar?.url}`}
              alt={seller.name}
              className="w-[45px] h-[45px] rounded-full object-cover border-2 border-brand-teal p-[1px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
