import React from "react";
import { FiShoppingBag, FiLogOut } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting, AiOutlineMoneyCollect } from "react-icons/ai";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminSideBar = ({ active }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: "Dashboard", icon: <RxDashboard size={24} />, path: "/admin/dashboard" },
    { id: 2, name: "All Orders", icon: <FiShoppingBag size={24} />, path: "/admin-orders" },
    { id: 3, name: "All Sellers", icon: <GrWorkshop size={24} color={active === 3 ? "cyan" : "white"} />, path: "/admin-sellers" }, // GrIcon color handling might be tricky, keeping consistent size
    { id: 4, name: "All Users", icon: <HiOutlineUserGroup size={24} />, path: "/admin-users" },
    { id: 5, name: "All Products", icon: <BsHandbag size={24} />, path: "/admin-products" },
    { id: 6, name: "All Events", icon: <MdOutlineLocalOffer size={24} />, path: "/admin-events" },
    { id: 7, name: "All Bids", icon: <AiOutlineMoneyCollect size={24} />, path: "/admin-bids" },
    { id: 8, name: "Withdraw Request", icon: <CiMoneyBill size={24} />, path: "/admin-withdraw-request" },
    { id: 9, name: "Settings", icon: <AiOutlineSetting size={24} />, path: "/admin/profile" },
  ];

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/user/admin-logout`, {
        withCredentials: true,
      });
      toast.success("Admin Log out successful!");
      navigate("/admin-login");
      window.location.reload(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      <div className="w-[80px] 800px:w-[330px] h-[calc(100vh-80px)] bg-[#111827] shadow-xl fixed top-[80px] left-0 z-10 text-white flex flex-col justify-between overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.id}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${active === item.id
                ? "bg-gradient-to-r from-teal-500/20 to-teal-900/10 text-teal-400 border-r-4 border-teal-500"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <span className={`${active === item.id ? "text-teal-400" : "text-gray-400 group-hover:text-white"}`}>
                {/* Clone element to override color prop if needed, or rely on parent color class */}
                {React.cloneElement(item.icon, { color: "currentColor" })}
              </span>
              <h5 className="hidden 800px:block pl-3 text-[16px] font-[500]">
                {item.name}
              </h5>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div
            className="flex items-center p-3 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
            onClick={logoutHandler}
          >
            <FiLogOut size={24} />
            <h5 className="hidden 800px:block pl-3 text-[16px] font-[500]">Log Out</h5>
          </div>
        </div>
      </div>
      {/* Spacer to maintain layout flow since the main sidebar is fixed */}
      <div className="w-[80px] 800px:w-[330px] h-full shrink-0 text-transparent pointer-events-none select-none">.</div>
    </>
  );
};

export default AdminSideBar;
