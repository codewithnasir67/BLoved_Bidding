import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";
import { FiLayout, FiGrid, FiStar, FiCalendar } from "react-icons/fi";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);

  const allReviews = products?.reduce((acc, product) => {
    if (product.reviews && Array.isArray(product.reviews)) {
      return [...acc, ...product.reviews];
    }
    return acc;
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full">
      {/* Tabs and Dashboard Button Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
        <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
          <TabButton
            active={active === 1}
            onClick={() => setActive(1)}
            icon={<FiGrid />}
            label="Shop Products"
            count={products?.length}
          />
          <TabButton
            active={active === 2}
            onClick={() => setActive(2)}
            icon={<FiCalendar />}
            label="Running Events"
            count={events?.length}
          />
          <TabButton
            active={active === 3}
            onClick={() => setActive(3)}
            icon={<FiStar />}
            label="Shop Reviews"
            count={allReviews?.length}
          />
        </div>

        {isOwner && (
          <Link to="/dashboard">
            <div className="flex items-center gap-2 bg-gray-900 dark:bg-brand-teal text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-black dark:hover:bg-brand-teal-dark transition-all shadow-md shadow-gray-200 dark:shadow-none active:scale-95">
              <FiLayout size={18} />
              <span>Go Dashboard</span>
            </div>
          </Link>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-8">
        {active === 1 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-12">
            {products &&
              products.map((i, index) => (
                <ProductCard data={i} key={index} isShop={true} />
              ))}
            {products && products.length === 0 && (
              <EmptyState title="No Products Found" message="This shop hasn't listed any products yet." />
            )}
          </div>
        )}

        {active === 2 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-12">
            {events &&
              events.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
            {events && events.length === 0 && (
              <EmptyState title="No Running Events" message="Check back later for exciting events!" />
            )}
          </div>
        )}

        {active === 3 && (
          <div className="max-w-3xl">
            {allReviews && allReviews.length > 0 ? (
              <div className="space-y-4">
                {allReviews.map((item, index) => (
                  <ReviewCard key={index} item={item} formatDate={formatDate} />
                ))}
              </div>
            ) : (
              <EmptyState title="No Reviews Yet" message="Be the first to share your experience with this shop!" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const TabButton = ({ active, onClick, icon, label, count }) => (
  <div
    className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-all border-b-2 relative whitespace-nowrap group ${active ? "border-brand-teal text-brand-teal" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
    onClick={onClick}
  >
    <span className={`${active ? "text-brand-teal" : "text-gray-400 group-hover:text-gray-600"}`}>{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {count > 0 && (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-brand-teal/10 text-brand-teal" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
        }`}>
        {count}
      </span>
    )}
  </div>
);

const ReviewCard = ({ item, formatDate }) => (
  <div className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800">
    <div className="flex gap-4">
      <img
        src={item.user?.avatar?.url || "/default-avatar.png"}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-50 dark:ring-gray-700"
        alt={item.user?.name || "User"}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-gray-900 dark:text-white font-bold truncate">{item.user?.name || "Anonymous"}</h4>
          <span className="text-gray-400 text-xs font-medium shrink-0">
            {item.createdAt ? formatDate(item.createdAt) : ""}
          </span>
        </div>
        <div className="mt-1">
          <Ratings rating={item.rating} />
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed">
          {item.comment}
        </p>
        {item.productName && (
          <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700/50 flex items-center gap-2 text-xs">
            <span className="text-gray-400">Reviewed for:</span>
            <Link to={`/product/${item.product}`} className="text-brand-teal hover:underline font-bold">
              {item.productName}
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);

const EmptyState = ({ title, message }) => (
  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4">
      <FiGrid size={32} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm px-4">{message}</p>
  </div>
);

export default ShopProfileData;
