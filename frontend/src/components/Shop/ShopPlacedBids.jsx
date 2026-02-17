import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineReload, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClockCircle, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { RiAuctionLine } from "react-icons/ri";

const ShopPlacedBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const { seller, isSeller } = useSelector((state) => state.seller);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isSeller) {
            const storedSeller = localStorage.getItem("seller");
            if (storedSeller) {
                dispatch({
                    type: "LoadSellerSuccess",
                    payload: JSON.parse(storedSeller)
                });
            } else {
                navigate("/shop-login");
            }
        }
        fetchPlacedBids();
    }, [isSeller, dispatch, navigate]);

    const fetchPlacedBids = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${server}/bid/seller-placed`, {
                withCredentials: true,
            });

            if (!data || data.success === false) {
                toast.error(data?.message || "Failed to fetch bids");
                setBids([]);
                return;
            }

            const formattedBids = (data.bids || []).map((bid) => ({
                id: bid._id,
                requestId: bid.product?._id,
                requestName: bid.product?.name || "Request Removed",
                requestImage: bid.product?.images?.[0]?.url || "",
                userName: bid.buyer?.name || "Unknown User",
                bidAmount: bid.bidAmount || 0,
                currentLowest: bid.product?.currentPrice || bid.product?.startingPrice || 0,
                status: bid.status || "pending",
                createdAt: new Date(bid.createdAt).toLocaleString(),
            }));

            setBids(formattedBids);
        } catch (error) {
            console.error("Error fetching bids:", error);
            if (error.response?.status === 401) {
                toast.error("Please login to your shop account");
                navigate("/shop-login");
            } else {
                toast.error(error.response?.data?.message || "Error fetching bids");
                setBids([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            field: "request",
            headerName: "Request Name",
            minWidth: 200,
            flex: 1.2,
            renderCell: (params) => (
                <div className="flex items-center gap-3">
                    <img
                        src={params.row.requestImage}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg border border-gray-100 dark:border-gray-700"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                            {params.row.requestName}
                        </span>
                        <span className="text-[12px] text-gray-500">
                            User: {params.row.userName}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            field: "bidAmount",
            headerName: "My Offer",
            minWidth: 130,
            flex: 0.8,
            renderCell: (params) => (
                <span className="font-bold text-brand-teal dark:text-brand-teal-light">
                    Rs.{params.row.bidAmount.toLocaleString()}
                </span>
            ),
        },
        {
            field: "currentLowest",
            headerName: "Current Lowest",
            minWidth: 130,
            flex: 0.8,
            renderCell: (params) => (
                <span className="text-gray-600 dark:text-gray-300">
                    Rs.{params.row.currentLowest.toLocaleString()}
                </span>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 120,
            flex: 0.6,
            renderCell: (params) => {
                const status = params.value;
                let colorClass = "";
                let bgColorClass = "";
                let Icon = AiOutlineClockCircle;

                if (status === "accepted") {
                    colorClass = "text-green-600 dark:text-green-400";
                    bgColorClass = "bg-green-100 dark:bg-green-900/30";
                    Icon = AiOutlineCheckCircle;
                } else if (status === "rejected") {
                    colorClass = "text-red-600 dark:text-red-400";
                    bgColorClass = "bg-red-100 dark:bg-red-900/30";
                    Icon = AiOutlineCloseCircle;
                } else {
                    colorClass = "text-amber-600 dark:text-amber-400";
                    bgColorClass = "bg-amber-100 dark:bg-amber-900/30";
                }

                return (
                    <span className={`${colorClass} ${bgColorClass} px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 capitalize shadow-sm border border-current/10`}>
                        <Icon size={14} />
                        {status}
                    </span>
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Date",
            minWidth: 150,
            flex: 0.8,
            renderCell: (params) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {params.value}
                </span>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 120,
            flex: 0.7,
            sortable: false,
            renderCell: (params) => {
                return (
                    <button
                        onClick={() => navigate(`/dashboard-buyer-request/${params.row.requestId}`)}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white rounded-lg transition-all duration-300 font-bold text-xs group shadow-sm border border-brand-teal/20"
                    >
                        <AiOutlineEye size={14} className="group-hover:scale-110 transition-transform" />
                        <span>View Request</span>
                    </button>
                );
            },
        },
    ];

    return (
        <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in text-gray-800 dark:text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-[32px] font-Poppins font-bold tracking-tight">
                        My Offers
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage offers you've placed on Buyer Requests.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard-buyer-requests")}
                        className="bg-brand-teal text-white border border-brand-teal hover:bg-brand-teal-dark font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm shadow-brand-teal/20"
                    >
                        <RiAuctionLine size={20} />
                        Browse Requests
                    </button>
                    <button
                        onClick={fetchPlacedBids}
                        disabled={loading}
                        className="bg-white dark:bg-gray-800 text-brand-teal border border-brand-teal hover:bg-brand-teal hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        <AiOutlineReload className={`${loading ? 'animate-spin' : ''}`} size={20} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up shadow-lg shadow-gray-200/50 dark:shadow-none" style={{ animationDelay: '0.4s' }}>
                {loading && bids.length === 0 ? (
                    <div className="w-full flex justify-center py-20">
                        <Loader />
                    </div>
                ) : bids.length === 0 ? (
                    <div className="w-full flex flex-col justify-center items-center py-24 px-4 text-center">
                        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
                            <RiAuctionLine className="text-gray-300" size={60} />
                        </div>
                        <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No offers placed yet</p>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs">Browse Buyer Requests to place your first offer.</p>
                    </div>
                ) : (
                    <div className="w-full">
                        <DataGrid
                            rows={bids}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            autoHeight
                            className="border-none"
                            style={{
                                backgroundColor: 'transparent',
                                fontSize: '14px',
                                color: 'inherit',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPlacedBids;
