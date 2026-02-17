import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import Ratings from "../Products/Ratings";

const AdminProductDetails = ({ data }) => {
    const [select, setSelect] = useState(0);

    // Use shop's direct rating if available, otherwise 0
    const averageRating = (data?.shop?.averageRating || 0).toFixed(2);

    return (
        <div className="w-full min-h-screen bg-[#111827] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {data ? (
                    <div className="bg-[#1f2937] rounded-3xl shadow-xl overflow-hidden border border-gray-700">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-12">

                            {/* Left Column: Image Gallery */}
                            <div className="space-y-6">
                                <div className="aspect-square bg-[#111827] rounded-2xl p-6 shadow-inner border border-gray-700 flex items-center justify-center relative overflow-hidden group">
                                    <img
                                        src={`${data && data.images[select]?.url}`}
                                        alt=""
                                        className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="grid grid-cols-5 gap-4">
                                    {data && data.images.map((i, index) => (
                                        <div
                                            key={index}
                                            className={`${select === index
                                                ? "border-2 border-teal-500 shadow-lg shadow-teal-500/20"
                                                : "border border-gray-700 opacity-60 hover:opacity-100"
                                                } cursor-pointer aspect-square rounded-xl overflow-hidden bg-[#111827] transition-all duration-300`}
                                            onClick={() => setSelect(index)}
                                        >
                                            <img
                                                src={`${i?.url}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                        {data.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider rounded-full border border-teal-500/20">
                                            ID: {data._id}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-600">
                                            {data.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <p className="text-gray-400 text-base leading-relaxed whitespace-pre-line mb-8 font-light">
                                        {data.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <div className="bg-[#111827] p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Price</p>
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-bold text-white tracking-tight leading-none">{data.discountPrice} Rs</span>
                                                {data.originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through mt-1">{data.originalPrice} Rs</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-[#111827] p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Stock</p>
                                            <span className={`text-xl font-bold ${data.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                                {data.stock} Units
                                            </span>
                                        </div>
                                        <div className="bg-[#111827] p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Sold</p>
                                            <span className="text-xl font-bold text-blue-400">{data.sold_out}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Shop Card */}
                                <div className="bg-[#111827] p-5 rounded-2xl border border-gray-700 flex items-center justify-between gap-4 group hover:border-gray-600 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={`${data?.shop?.avatar?.url}`}
                                                alt=""
                                                className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 group-hover:border-teal-500 transition-colors duration-300"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#111827]">
                                                {averageRating} ★
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                                                {data.shop.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">Verified Seller</p>
                                        </div>
                                    </div>
                                    <Link to={`/shop/preview/${data.shop._id}`}>
                                        <button className="px-5 py-2.5 bg-[#1f2937] hover:bg-teal-600 text-white text-sm font-semibold rounded-lg border border-gray-600 hover:border-teal-500 transition-all duration-300">
                                            View Shop
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="border-t border-gray-700 bg-[#1a2230] p-8 lg:p-12">
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                Customer Reviews
                                <span className="bg-gray-700 text-gray-300 text-xs py-1 px-2.5 rounded-full">{data.reviews?.length || 0}</span>
                            </h3>

                            {data && data.reviews && data.reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.reviews.map((item, index) => (
                                        <div key={index} className="bg-[#111827] p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.user.avatar?.url} alt="" className="w-10 h-10 rounded-full border border-gray-600" />
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{item.user.name}</h4>
                                                        <div className="flex mt-0.5">
                                                            <Ratings rating={item.rating} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                "{item.comment}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 bg-[#111827] rounded-3xl border border-gray-700 border-dashed opacity-70">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-500">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                    </div>
                                    <p className="text-gray-400 font-medium">No reviews yet</p>
                                    <p className="text-gray-600 text-sm mt-1">Be the first to review this product</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminProductDetails;
