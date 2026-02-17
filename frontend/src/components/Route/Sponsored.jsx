import React from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
  const brands = [
    {
      name: "Sony",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png",
      description: "Electronics & Gaming"
    },
    {
      name: "Dell",
      logo: "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png",
      description: "Computers & Laptops"
    },
    {
      name: "Samsung",
      logo: "https://1000logos.net/wp-content/uploads/2017/06/Samsung-Logo.png",
      description: "Mobile & Electronics"
    },
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
      description: "Pixel & Technology"
    },
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
      description: "iPhone, iPad & Mac"
    }
  ];

  return (
    <div className={`${styles.section} py-12 mb-12`}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Trusted Brands
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Shop preloved items from top technology brands
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 cursor-pointer group"
          >
            <div className="w-full h-20 flex items-center justify-center mb-4">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              {brand.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {brand.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsored;
