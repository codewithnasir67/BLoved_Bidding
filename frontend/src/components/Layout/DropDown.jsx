import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { FaLaptop, FaTshirt, FaShoePrints, FaMobileAlt, FaGamepad, FaShoppingBag } from "react-icons/fa";
import { GiLipstick } from "react-icons/gi";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const categoryIcons = {
  "Computers and Laptops": <FaLaptop size={22} />,
  "cosmetics and body care": <GiLipstick size={22} />,
  "Accesories": <FaShoppingBag size={22} />,
  "Cloths": <FaTshirt size={22} />,
  "Shoes": <FaShoePrints size={22} />,
  "Mobile and Tablets": <FaMobileAlt size={22} />,
  "Music and Gaming": <FaGamepad size={22} />,
  "Others": <BiDotsHorizontalRounded size={22} />,
};

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
    window.location.reload();
  };
  return (
    <div className="absolute top-14 left-0 w-[250px] bg-white dark:bg-gray-800 z-40 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-down origin-top overflow-hidden">
      <div className="py-2">
        {categoriesData &&
          categoriesData.map((i, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-2.5 m-1 rounded-lg transition-all duration-200 hover:bg-brand-teal hover:text-white dark:hover:bg-brand-teal cursor-pointer group`}
              onClick={() => submitHandle(i)}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-brand-teal group-hover:bg-white/20 group-hover:text-white transition-all duration-200">
                {categoryIcons[i.title] || <BiDotsHorizontalRounded size={22} />}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-white transition-colors duration-200 select-none">
                {i.title}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DropDown;
