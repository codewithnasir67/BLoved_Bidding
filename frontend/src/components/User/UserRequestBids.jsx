import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineEye, AiOutlineUnorderedList } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { RiAuctionLine, RiHandCoinLine, RiUserVoiceLine, RiTimeLine } from "react-icons/ri";

const UserRequestBids = ({ isProfile }) => {
    const { user } = useSelector((state) => state.user);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${server}/product/my-requests`, { withCredentials: true });
                setRequests(data.products || []);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load your requests");
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const columns = [
        {
            field: "image",
            headerName: "Image",
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <img src={params.row.image} alt="Product" className="w-[50px] h-[50px] object-cover rounded-lg shadow-sm border border-gray-100" />
                )
            }
        },
        {
            field: "name",
            headerName: "Request Title",
            minWidth: 180,
            flex: 1.2,
            renderCell: (params) => <span className="font-semibold text-gray-700 dark:text-gray-200">{params.value}</span>
        },
        {
            field: "price",
            headerName: "Your Budget",
            minWidth: 120,
            flex: 0.8,
            renderCell: (params) => (
                <div className="flex items-center gap-1 font-bold text-brand-teal">
                    {params.value}
                </div>
            )
        },
        {
            field: "bids",
            headerName: "Bids Received",
            minWidth: 130,
            flex: 0.7,
            renderCell: (params) => (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800">
                    <RiUserVoiceLine size={14} />
                    {params.value} Offers
                </div>
            )
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 120,
            flex: 0.8,
            renderCell: (params) => {
                const isEnded = new Date(params.row.endTime) < new Date();
                return isEnded ? (
                    <span className="text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md text-xs font-bold uppercase">Ended</span>
                ) : (
                    <span className="text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md text-xs font-bold uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                    </span>
                );
            }
        },
        {
            field: "action",
            headerName: "View Offers",
            type: "number",
            minWidth: 130,
            flex: 0.6,
            renderCell: (params) => {
                return (
                    <Link to={`/product/${params.id}`}>
                        <Button
                            className="!bg-brand-teal hover:!bg-brand-teal-dark !text-white !px-4 !py-1.5 !rounded-lg !text-xs !font-bold !shadow-sm transition-all flex items-center gap-2"
                        >
                            <AiOutlineEye size={16} /> View
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const rows = [];
    requests && requests.forEach((item) => {
        rows.push({
            id: item._id,
            image: item.images[0]?.url,
            name: item.name,
            price: "Rs " + item.startingPrice,
            bids: item.bids.length,
            endTime: item.auctionEndTime,
        });
    });

    return (
        <div className={`w-full ${!isProfile ? 'bg-gray-50/30 dark:bg-transparent min-h-screen px-4 md:px-8 py-8' : 'py-2'} animate-fadeIn`}>
            <div className="flex flex-col gap-8 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-[28px] font-black text-gray-900 dark:text-white font-Poppins tracking-tight">
                            My <span className="text-brand-teal">Requests</span>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Manage your buying requests and review offers from sellers.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <RiAuctionLine className="text-brand-teal" size={20} />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Request Manager</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                <AiOutlineUnorderedList size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Requests</p>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">{requests.length}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                <RiUserVoiceLine size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Offers</p>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {requests.reduce((acc, curr) => acc + (curr.bids?.length || 0), 0)}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                <RiHandCoinLine size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Budget</p>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                                    Rs {requests.reduce((acc, curr) => acc + (curr.startingPrice || 0), 0).toLocaleString()}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DataGrid Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-[400px] gap-4">
                            <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
                            <p className="text-gray-400 font-medium animate-pulse">Loading your requests...</p>
                        </div>
                    ) : requests.length > 0 ? (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            autoHeight
                            rowHeight={80}
                            headerHeight={50}
                            className="!border-none"
                        />
                    ) : (
                        <div className="flex flex-col justify-center items-center h-[400px] gap-6 p-8 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-200 dark:text-gray-700">
                                <RiAuctionLine size={40} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Requests Found</h4>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                                    You haven't posted any buyer requests yet. Create one to get offers from sellers!
                                </p>
                                <Link to="/create-request">
                                    <Button className="!bg-brand-teal hover:!bg-brand-teal-dark !text-white !px-8 !py-3 !rounded-xl !font-bold !shadow-lg shadow-brand-teal/20 transition-all active:scale-95">
                                        Create New Request
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserRequestBids;
