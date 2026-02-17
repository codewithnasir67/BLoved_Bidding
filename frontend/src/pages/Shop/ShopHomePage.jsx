import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopHomePage = () => {
  const { seller } = useSelector((state) => state.seller);
  const { id } = useParams();

  // Check if the current user is the owner of this shop
  const isOwner = seller?._id === id;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8 px-4 md:px-6">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-[28%] xl:w-[25%] lg:sticky lg:top-8 h-fit animate-slideInLeft">
            <ShopInfo isOwner={isOwner} />
          </div>

          {/* Main Content */}
          <div className="lg:w-[72%] xl:w-[75%] animate-fadeIn">
            <ShopProfileData isOwner={isOwner} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;