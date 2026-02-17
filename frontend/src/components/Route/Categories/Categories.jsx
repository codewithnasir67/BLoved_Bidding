import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import ProductShowcase from "../ProductShowcase/ProductShowcase";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Product Showcase - Luxury Collection & Modern Classics */}
      <ProductShowcase />

      <div
        className="w-11/12 mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg mb-12"
        id="categories"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          <Link to="/products" className="text-brand-teal hover:text-brand-teal-dark font-medium flex items-center gap-2">
            View All <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5 lg:gap-6">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700 hover:border-brand-teal dark:hover:border-brand-teal-light"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-3 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-purple/20 dark:from-brand-teal/10 dark:to-brand-purple/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={i.image_Url}
                        className="w-16 h-16 object-contain"
                        alt={i.title}
                      />
                    </div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-teal dark:group-hover:text-brand-teal-light transition-colors duration-300">
                      {i.title}
                    </h5>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
