import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineReload } from "react-icons/ai";
import {
    RiAuctionLine,
    RiMoneyDollarCircleLine,
    RiUserSearchLine,
    RiArrowRightLine
} from "react-icons/ri";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import { server } from "../../server";
import Loader from "../Layout/Loader";

const ShopAllBuyerRequests = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        setIsLoading(true);
        axios
            .get(`${server}/product/get-buyer-requests`, { withCredentials: true })
            .then((res) => {
                setIsLoading(false);
                setData(res.data.products);
            })
            .catch((error) => {
                setIsLoading(false);
            });
    };

    const columns = [
        {
            field: "id",
            headerName: "Request ID",
            minWidth: 150,
            flex: 0.7,
            renderCell: (params) => (
                <span className="text-gray-500 font-mono text-xs">{params.value}</span>
            )
        },
        {
            field: "name",
            headerName: "Request Name",
            minWidth: 200,
            flex: 1.4,
            renderCell: (params) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{params.value}</span>
                </div>
            )
        },
        {
            field: "price",
            headerName: "Budget / Price",
            minWidth: 150,
            flex: 0.8,
            renderCell: (params) => (
                <span className="font-bold text-brand-teal text-base">
                    {params.value}
                </span>
            )
        },
        {
            field: "bids",
            headerName: "Active Bids",
            type: "number",
            minWidth: 120,
            flex: 0.5,
            renderCell: (params) => (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full w-fit">
                    <span className="font-bold text-sm">{params.value}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wide">Bids</span>
                </div>
            )
        },
        {
            field: "action",
            headerName: "Action",
            flex: 0.8,
            minWidth: 150,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/dashboard-buyer-request/${params.id}`} className="group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-brand-teal hover:text-white border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-300 shadow-sm group-hover:border-brand-teal">
                            <span className="text-sm font-semibold">View & Bid</span>
                            <RiArrowRightLine className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </Link>
                );
            },
        },
    ];

    const rows = [];

    data &&
        data.forEach((item) => {
            rows.push({
                id: item._id,
                name: item.name,
                price: "Rs " + (item.currentPrice || item.startingPrice).toLocaleString(),
                bids: item.bids ? item.bids.length : 0,
            });
        });

    return (
        <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in text-gray-800 dark:text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-[32px] font-Poppins font-bold tracking-tight text-gray-900 dark:text-white">
                        Buyer Requests Feed
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <RiUserSearchLine className="text-brand-teal" />
                        Browse live requests from buyers and place your bids.
                    </p>
                </div>
                <button
                    onClick={fetchRequests}
                    disabled={isLoading}
                    className="bg-white dark:bg-gray-800 text-brand-teal border border-brand-teal hover:bg-brand-teal hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                    <AiOutlineReload className={`${isLoading ? 'animate-spin' : ''}`} size={20} />
                    Refresh Feed
                </button>
            </div>

            {/* Stats Overview (Optional but adds richness) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-brand-teal/10 rounded-xl text-brand-teal">
                            <RiAuctionLine size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active Requests</p>
                            <h4 className="text-2xl font-bold">{data.length}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up shadow-lg shadow-gray-200/50 dark:shadow-none" style={{ animationDelay: '0.2s' }}>
                {isLoading ? (
                    <div className="w-full flex justify-center py-20">
                        <Loader />
                    </div>
                ) : rows.length === 0 ? (
                    <div className="w-full flex flex-col justify-center items-center py-24 px-4 text-center">
                        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
                            <RiUserSearchLine className="text-gray-300" size={60} />
                        </div>
                        <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No requests found</p>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs">Buyers haven't posted any requests yet. Check back later!</p>
                    </div>
                ) : (
                    <div className="w-full">
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            autoHeight
                            className="border-none"
                            style={{
                                backgroundColor: 'transparent',
                                fontSize: '14px',
                                color: 'inherit',
                                border: 'none'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopAllBuyerRequests;
