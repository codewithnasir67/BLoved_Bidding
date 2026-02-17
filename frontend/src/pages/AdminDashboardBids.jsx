import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllBids from "../components/Admin/AllBids";

const AdminDashboardBids = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex bg-[#111827]">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={7} />
          </div>
          <div className="w-full justify-center flex">
            <AllBids />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardBids;
