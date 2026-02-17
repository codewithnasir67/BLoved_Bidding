import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  // Click outside to close dropdown
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className={`${styles.section}`}>
          <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
            <div className="min-w-[180px] relative">
              <Link to="/">
                <img
                  src="/BB-Logo.png"
                  alt="BLoved-Bidding Logo"
                  className="h-[60px] object-contain"
                />
              </Link>
            </div>
            {/* search box */}
            <div className="w-[50%] relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-4 border-brand-teal dark:border-brand-teal-light border-[2px] rounded-full text-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-3 top-1.5 cursor-pointer text-brand-teal dark:text-brand-teal-light"
              />
              {searchData && searchTerm && searchData.length !== 0 ? (
                <div className="absolute min-h-[30vh] bg-white dark:bg-gray-800 shadow-xl rounded-lg z-[100] p-4 border border-gray-200 dark:border-gray-700">
                  {searchData &&
                    searchData.map((i, index) => {
                      return (
                        <Link to={`/product/${i._id}`} key={index}>
                          <div className="w-full flex items-start py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200">
                            <img
                              src={`${i.images[0]?.url}`}
                              alt=""
                              className="w-[40px] h-[40px] mr-[10px] object-cover rounded"
                            />
                            <div className="flex-1">
                              <h1 className="text-sm font-medium text-gray-900 dark:text-white">{i.name}</h1>
                              <p className="text-xs text-brand-teal dark:text-brand-teal-light font-semibold mt-1">
                                Rs {i.discountPrice || i.originalPrice}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/shop-create"
                className={`${styles.button} !rounded-full !w-[170px]`}
              >
                <h1 className="text-[#fff] flex items-center justify-center whitespace-nowrap">
                  Become Seller <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>

              <Link
                to="/auctions"
                className={`${styles.button} !rounded-full !w-[170px]`}
              >
                <h1 className="text-[#fff] flex items-center justify-center whitespace-nowrap">
                  Live Auctions
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${active === true ? "shadow-md fixed top-0 left-0 z-50 animate-slide-down" : "relative"
          } transition-all duration-300 hidden 800px:flex items-center justify-between w-full bg-gradient-to-r from-brand-teal to-brand-teal-dark dark:bg-gray-900 h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* categories */}
          {/* categories */}
          {/* categories */}
          <div ref={dropdownRef} onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[48px] w-[250px] hidden 1000px:block">
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-sans text-lg font-[600] select-none rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center">
                  <BiMenuAltLeft size={28} className="absolute top-2.5 left-3 text-brand-teal" />
                  <span className="ml-2">All Categories</span>
                </div>
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-4 top-3.5 cursor-pointer text-gray-500 hover:text-brand-teal transition-colors"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* navitems */}
          <div className={`${styles.noramlFlex}`}>
            <div className="relative cursor-pointer mr-[15px]">
              <Link to="/">
                <span className={`${activeHeading === 1 ? "text-brand-teal-dark font-extrabold bg-white shadow-md" : "text-white font-medium hover:bg-white/20"} px-6 py-2 rounded-full cursor-pointer transition-all duration-300`}>
                  Home
                </span>
              </Link>
            </div>
            <div className="relative cursor-pointer mr-[15px]">
              <Link to="/best-selling">
                <span className={`${activeHeading === 2 ? "text-brand-teal-dark font-extrabold bg-white shadow-md" : "text-white font-medium hover:bg-white/20"} px-6 py-2 rounded-full cursor-pointer transition-all duration-300`}>
                  Best Selling
                </span>
              </Link>
            </div>
            <div className="relative cursor-pointer mr-[15px]">
              <Link to="/products">
                <span className={`${activeHeading === 3 ? "text-brand-teal-dark font-extrabold bg-white shadow-md" : "text-white font-medium hover:bg-white/20"} px-6 py-2 rounded-full cursor-pointer transition-all duration-300`}>
                  Products
                </span>
              </Link>
            </div>
            <div className="relative cursor-pointer mr-[15px]">
              <Link to="/events">
                <span className={`${activeHeading === 4 ? "text-brand-teal-dark font-extrabold bg-white shadow-md" : "text-white font-medium hover:bg-white/20"} px-6 py-2 rounded-full cursor-pointer transition-all duration-300`}>
                  Events
                </span>
              </Link>
            </div>
            <div className="relative cursor-pointer mr-[15px]">
              <Link to="/auctions">
                <span className={`${activeHeading === 5 ? "text-brand-teal-dark font-extrabold bg-white shadow-md" : "text-white font-medium hover:bg-white/20"} px-6 py-2 rounded-full cursor-pointer transition-all duration-300`}>
                  Live Auctions
                </span>
              </Link>
            </div>
          </div>

          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-brand-coral w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-brand-coral w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
          }
      w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img
                src="/BB-Logo.png"
                alt="BLoved-Bidding Logo"
                className="h-[60px] object-contain"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />


            </div>
          </div>

          {/* cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>

        {/* header sidebar */}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span class="absolute right-0 top-0 rounded-full bg-brand-coral w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px relative]">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-brand-teal dark:border-brand-teal-light border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && (
                  <div className="absolute bg-[#fff] z-[100] shadow w-full left-0 p-3">
                    {searchData.map((i) => {
                      const d = i.name;

                      const Product_name = d.replace(/\s+/g, "-");
                      return (
                        <Link to={`/product/${Product_name}`}>
                          <div className="flex items-center">
                            <img
                              src={i.image_Url[0]?.url}
                              alt=""
                              className="w-[50px] mr-2"
                            />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative cursor-pointer mr-[15px]">
                <Link to="/">
                  <span className={`${activeHeading === 1 ? "text-brand-coral" : "text-gray-900 dark:text-white"} font-[500] px-6 cursor-pointer}`}>
                    Home
                  </span>
                </Link>
              </div>
              <div className="relative cursor-pointer mr-[15px]">
                <Link to="/best-selling">
                  <span className={`${activeHeading === 2 ? "text-brand-coral" : "text-gray-900 dark:text-white"} font-[500] px-6 cursor-pointer}`}>
                    Best Selling
                  </span>
                </Link>
              </div>
              <div className="relative cursor-pointer mr-[15px]">
                <Link to="/products">
                  <span className={`${activeHeading === 3 ? "text-brand-coral" : "text-gray-900 dark:text-white"} font-[500] px-6 cursor-pointer}`}>
                    Products
                  </span>
                </Link>
              </div>
              <div className="relative cursor-pointer mr-[15px]">
                <Link to="/events">
                  <span className={`${activeHeading === 4 ? "text-brand-coral" : "text-gray-900 dark:text-white"} font-[500] px-6 cursor-pointer}`}>
                    Events
                  </span>
                </Link>
              </div>
              <div className="relative cursor-pointer mr-[15px]">
                <Link to="/auctions">
                  <span className={`${activeHeading === 5 ? "text-brand-coral" : "text-gray-900 dark:text-white"} font-[500] px-6 cursor-pointer}`}>
                    Live Auctions
                  </span>
                </Link>
              </div>
              <div className={`${styles.button} ml-4 !rounded-full`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${user.avatar?.url}`}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
