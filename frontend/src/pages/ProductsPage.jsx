import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { AiOutlineInbox } from "react-icons/ai";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState("Newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let sortedData = allProducts ? [...allProducts] : [];

    if (categoryData !== null) {
      sortedData = sortedData.filter((i) => i.category === categoryData);
    }

    // Sorting Logic
    if (sortBy === "Price: Low to High") {
      sortedData.sort((a, b) => {
        const priceA = a.currentPrice || a.originalPrice || 0;
        const priceB = b.currentPrice || b.originalPrice || 0;
        return priceA - priceB;
      });
    } else if (sortBy === "Price: High to Low") {
      sortedData.sort((a, b) => {
        const priceA = a.currentPrice || a.originalPrice || 0;
        const priceB = b.currentPrice || b.originalPrice || 0;
        return priceB - priceA;
      });
    } else if (sortBy === "Newest") {
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Best Selling") {
      sortedData.sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0));
    } else if (sortBy === "Oldest") {
      sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setData(sortedData);
  }, [allProducts, categoryData, sortBy]);

  const sortOptions = [
    { label: "Newest First", value: "Newest" },
    { label: "Price: Low to High", value: "Price: Low to High" },
    { label: "Price: High to Low", value: "Price: High to Low" },
    { label: "Best Selling", value: "Best Selling" },
    { label: "Oldest First", value: "Oldest" },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" onClick={() => setIsDropdownOpen(false)}>
          <Header activeHeading={3} />
          <br />
          <br />

          {/* Page Header */}
          <div className={`${styles.section} pt-8 mb-6 flex justify-between items-center`}>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize font-sans leading-tight">
              {categoryData ? categoryData : "All Products"}
            </h1>

            {/* Custom Sorting Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-5 rounded-full leading-tight focus:outline-none focus:ring-2 focus:ring-brand-teal/20 shadow-sm text-sm font-semibold cursor-pointer transition-all duration-300 hover:border-brand-teal hover:shadow-md hover:text-brand-teal hover:bg-gray-50 dark:hover:bg-gray-700 min-w-[180px]"
              >
                <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                <svg className={`fill-current h-4 w-4 ml-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-fade-in-down">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-200 
                                    ${sortBy === option.value ? 'bg-brand-teal/10 text-brand-teal font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-teal'}
                                `}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className={`${styles.section}`}>
            {data && data.length > 0 ? (
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12">
                {data.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full p-8 mb-6">
                  <AiOutlineInbox size={80} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Products Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                  {categoryData
                    ? `We couldn't find any products in the "${categoryData}" category.`
                    : "We couldn't find any products at the moment."}
                </p>
              </div>
            )}
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
