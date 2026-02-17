import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineGlobal,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      {/* Newsletter Section - Enhanced Premium Design */}
      <div className="relative bg-gradient-to-r from-brand-teal via-brand-teal-dark to-brand-purple py-16 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left Content */}
            <div className="text-center md:text-left md:w-1/2 space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
                <span className="w-2 h-2 bg-brand-coral rounded-full animate-pulse"></span>
                <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">Newsletter</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Join Our Community of <br className="hidden md:block" />
                <span className="text-brand-coral">Smart Shoppers</span>
              </h2>
              <p className="text-teal-50/80 text-base md:text-lg max-w-md">
                Where every item tells a story. Subscribe for exclusive updates, deals, and sustainable shopping tips.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
                </div>
                <p className="text-white/70 text-sm">
                  <span className="font-bold text-white">5,000+</span> subscribers
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div className="w-full md:w-auto md:flex-1 md:max-w-md">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
                <form className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      className="w-full px-5 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-coral shadow-lg transition-all duration-300 pr-12"
                    />
                    <AiOutlineMail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-brand-coral to-brand-coral-dark hover:from-brand-coral-dark hover:to-brand-coral text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2 group"
                  >
                    <span>Subscribe Now</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <p className="text-white/60 text-xs text-center">
                    🔒 We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-teal-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/">
              <img src="/BB-Logo.png" alt="Logo" className="h-12 w-auto mb-4 brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              "Where Preloved Finds a New Home" - Discover sustainable shopping with trust, excitement, and unbeatable value.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-teal transition-colors duration-300">
                <AiFillFacebook size={20} className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-teal transition-colors duration-300">
                <AiOutlineTwitter size={20} className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-teal transition-colors duration-300">
                <AiFillInstagram size={20} className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-teal transition-colors duration-300">
                <AiFillYoutube size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerProductLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-brand-teal transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-teal transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Shop</h3>
            <ul className="space-y-3">
              {footercompanyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-brand-teal transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-teal transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <AiOutlineGlobal className="text-brand-teal mt-1 flex-shrink-0" size={20} />
                <div>
                  <span className="block text-gray-400 text-sm">Website:</span>
                  <a href="https://BLovedBidding.com" className="text-white hover:text-brand-teal transition-colors text-sm font-medium">BLovedBidding.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AiOutlineMail className="text-brand-teal mt-1 flex-shrink-0" size={20} />
                <div>
                  <span className="block text-gray-400 text-sm">Email:</span>
                  <a href="mailto:BLoved.bidding@gmail.com" className="text-white hover:text-brand-teal transition-colors text-sm font-medium">BLoved.bidding@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AiOutlinePhone className="text-brand-teal mt-1 flex-shrink-0" size={20} />
                <div>
                  <span className="block text-gray-400 text-sm">Phone:</span>
                  <a href="tel:+923420855308" className="text-white hover:text-brand-teal transition-colors text-sm font-medium">+92 342 0855308</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} BLoved Bidding. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              {/* Payment Icons Placeholder */}
              <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[8px] text-gray-800 font-bold">VISA</div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[8px] text-gray-800 font-bold">MC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
