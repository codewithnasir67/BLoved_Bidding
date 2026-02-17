import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { BiShieldQuarter } from "react-icons/bi";
import { RiAuctionFill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/hero-slide-1.png",
    "/hero-slide-2.png",
    "/hero-slide-3.png",
    "/hero-slide-4.png"
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full overflow-hidden ${styles.noramlFlex}`}
    >
      {/* Carousel Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 pointer-events-none ${currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          style={{
            backgroundImage: `url(${slide})`,
          }}
        >
          {/* Refined Gradient Overlay - Darker and richer for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/80 to-transparent dark:from-gray-950/90 dark:via-gray-900/80"></div>
        </div>
      ))}

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20 pointer-events-auto">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
              ? "bg-white w-8 shadow-glow"
              : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`${styles.section} w-[90%] 800px:w-[60%] relative z-10 flex flex-col justify-center h-full`}>
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-xs font-bold text-teal-100 uppercase tracking-widest">
              Premium Marketplace
            </span>
          </div>

          <h1
            className={`text-[42px] leading-[1.1] 800px:text-[72px] text-white font-[800] tracking-tight drop-shadow-xl mb-6 font-sans`}
          >
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-100 drop-shadow-sm">
              Preloved Shopping
            </span> Is Here
          </h1>
          <p className="pt-2 text-[16px] 800px:text-[20px] font-[400] text-gray-100 max-w-[600px] leading-relaxed drop-shadow-md border-l-4 border-teal-400 pl-4">
            Discover a curated auction experience for unique finds.
            Buy, sell, and bid with absolute confidence.
          </p>

          <div className="flex flex-wrap gap-6 mt-8 text-white/80 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <BiShieldQuarter className="text-teal-300 text-lg" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MdVerified className="text-teal-300 text-lg" />
              <span>Verified Sellers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RiAuctionFill className="text-teal-300 text-lg" />
              <span>Live Bidding</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="inline-block group">
              <button className="bg-white text-teal-900 font-bold text-[18px] px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-teal-50 transition-all duration-300 transform group-hover:-translate-y-1 flex items-center justify-center min-w-[200px]">
                Start Exploring
              </button>
            </Link>
            <Link to="/best-selling" className="inline-block group">
              <button className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-bold text-[18px] px-10 py-4 rounded-full transition-all duration-300 flex items-center justify-center min-w-[200px]">
                Best Sellings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
