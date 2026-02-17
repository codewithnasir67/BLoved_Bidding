import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { IoLocationOutline } from "react-icons/io5";
import { FiPhone, FiPackage, FiLogOut, FiEdit } from "react-icons/fi";
import { MdOutlineStarRate, MdDateRange } from "react-icons/md";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
      setData(res.data.shop);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    })
  }, [dispatch, id])

  const logoutHandler = async () => {
    axios
      .get(`${server}/shop/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.removeItem("cartItems");
        localStorage.removeItem("wishlistItems");
        dispatch({ type: "clearCart" });
        dispatch({ type: "clearWishlist" });
        window.location.reload(true);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0);

  const averageRating = data.averageRating || (totalRatings / totalReviewsLength || 0);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-xl">
      {/* Decorative Header */}
      <div className="w-full h-24 bg-gradient-to-br from-brand-teal/80 to-brand-teal-dark relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center -mt-12 relative z-10 px-6">
        <div className="p-1 px-1 bg-white dark:bg-gray-800 rounded-full shadow-lg">
          <img
            src={`${data.avatar?.url}`}
            alt={data.name}
            className="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-gray-800"
          />
        </div>
        <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white text-center">{data.name}</h3>
        {data.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed italic line-clamp-3">
            "{data.description}"
          </p>
        )}
      </div>

      {/* Stats Divider */}
      <div className="grid grid-cols-2 gap-4 px-6 py-6 border-b border-gray-50 dark:border-gray-700/50">
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Products</p>
          <p className="text-lg font-bold text-brand-teal">{products?.length || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Rating</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-lg font-bold text-brand-teal">{averageRating.toFixed(1)}</p>
            <MdOutlineStarRate className="text-amber-400 text-sm" />
          </div>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="px-6 py-6 space-y-5">
        <InfoItem
          icon={<IoLocationOutline size={18} />}
          label="Location"
          value={data.address}
        />
        <InfoItem
          icon={<FiPhone size={16} />}
          label="Contact"
          value={data.phoneNumber}
        />
        <InfoItem
          icon={<MdDateRange size={18} />}
          label="Member Since"
          value={data?.createdAt?.slice(0, 10)}
        />
      </div>

      {/* Owner Actions */}
      {isOwner && (
        <div className="px-6 pb-8 flex flex-col gap-3">
          <Link to="/settings" className="group">
            <div className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold h-11 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-teal/20 group-hover:scale-[1.02]">
              <FiEdit size={16} />
              <span>Edit Shop Profile</span>
            </div>
          </Link>
          <button
            onClick={logoutHandler}
            className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold h-11 rounded-xl flex items-center justify-center gap-2 transition-all border border-red-100 dark:border-red-900/20"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Helper component for layout consistency
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 p-1.5 bg-brand-teal/5 dark:bg-brand-teal/10 text-brand-teal rounded-lg">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold truncate">{value || "Not provided"}</p>
    </div>
  </div>
);

export default ShopInfo;
