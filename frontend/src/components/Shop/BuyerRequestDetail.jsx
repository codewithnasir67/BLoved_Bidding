import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import {
    RiAuctionLine,
    RiMoneyDollarCircleLine,
    RiTimeLine,
    RiArrowLeftLine,
    RiUserLine,
    RiFileTextLine,
    RiSendPlaneLine
} from "react-icons/ri";

const BuyerRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { seller } = useSelector((state) => state.seller);
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        axios
            .get(`${server}/product/get-product/${id}`, { withCredentials: true })
            .then((res) => {
                setProduct(res.data.product);
                setIsLoading(false);
            })
            .catch((error) => {
                toast.error("Failed to load request details.");
                setIsLoading(false);
            });
    }, [id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!bidAmount) {
            toast.error("Please enter a bid amount.");
            return;
        }
        if (Number(bidAmount) <= 0) {
            toast.error("Bid amount must be a positive number.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${server}/bid/seller-bid`,
                { productId: id, bidAmount },
                { withCredentials: true }
            );
            toast.success("Bid placed successfully!");
            // Refresh product data to show newly added bid
            setProduct(response.data.product || product);
            setBidAmount("");

            // Refetch the updated product
            const updatedProduct = await axios.get(`${server}/product/get-product/${id}`, { withCredentials: true });
            setProduct(updatedProduct.data.product);

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateTimeRemaining = (endTime) => {
        if (!endTime) return "N/A";
        const end = new Date(endTime);
        const now = new Date();
        const diff = end - now;
        if (diff <= 0) return "Ended";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h ${mins}m remaining`;
        return `${mins}m remaining`;
    };

    if (isLoading) {
        return <div className="w-full flex justify-center py-20"><Loader /></div>;
    }

    if (!product) {
        return <div className="w-full flex justify-center py-20 text-gray-500">Request not found.</div>;
    }

    return (
        <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in text-gray-800 dark:text-white">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-teal hover:underline mb-6 group">
                <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to Feed</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                            Buyer Request
                        </span>
                        <h1 className="text-3xl font-bold font-Poppins text-gray-900 dark:text-white mb-3">{product.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5"><RiUserLine /> Request by User</span>
                            <span className="flex items-center gap-1.5"><RiTimeLine /> {calculateTimeRemaining(product.auctionEndTime)}</span>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    {product.images && product.images.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">Reference Images</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                                        <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300"><RiFileTextLine /> Description</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    </div>
                </div>

                {/* Right Column: Bidding Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
                        <h3 className="text-xl font-bold font-Poppins text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <RiAuctionLine className="text-brand-teal" /> Place Your Bid
                        </h3>

                        {/* Price Info */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <span className="text-sm text-gray-500">Buyer's Budget</span>
                                <span className="text-2xl font-bold text-brand-teal">Rs {(product.startingPrice || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <span className="text-sm text-gray-500">Current Best Offer</span>
                                <span className="text-xl font-bold text-gray-800 dark:text-white">Rs {(product.currentPrice || product.startingPrice || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <span className="text-sm text-gray-500">Active Bids</span>
                                <span className="text-xl font-bold">{product.bids?.length || 0}</span>
                            </div>
                        </div>

                        {/* Bid Form */}
                        <form onSubmit={handleBidSubmit}>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Your Offer (Rs)</label>
                            <div className="relative mb-4">
                                <span className="absolute left-4 top-3.5 text-gray-400 font-bold">Rs</span>
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="Enter your offer"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none font-semibold"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-teal/30 disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : <><RiSendPlaneLine /> Submit Bid</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerRequestDetail;
