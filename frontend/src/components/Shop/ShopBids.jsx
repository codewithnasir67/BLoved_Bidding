import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import {
  AiOutlineReload,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineLineChart,
  AiOutlineClockCircle,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineCloseSquare
} from "react-icons/ai";
import { RiAuctionLine } from "react-icons/ri";

const ShopBids = () => {
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
    fetchShopBids();
  }, [isSeller, dispatch, navigate]);

  const fetchShopBids = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/bid/seller`, {
        withCredentials: true,
      });

      if (!data || data.success === false) {
        toast.error(data?.message || "Failed to fetch bids");
        setBids([]);
        return;
      }

      const formattedBids = (data.bids || []).map((bid) => ({
        id: bid._id,
        productName: bid.product?.name || "Product Removed",
        productImage: bid.product?.images?.[0]?.url || "",
        buyerName: bid.buyer?.name || "Unknown User",
        buyerEmail: bid.buyer?.email || "N/A",
        bidAmount: bid.bidAmount || 0,
        currentPrice: bid.product?.currentPrice || bid.product?.startingPrice || 0,
        startingPrice: bid.product?.startingPrice || 0,
        status: bid.status || "pending",
        createdAt: new Date(bid.createdAt).toLocaleString(),
        product: bid.product || {},
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

  const handleBidAction = async (bidId, action) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${server}/bid/${bidId}/seller-status`,
        { status: action },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        toast.success(`Bid ${action} successfully`);
        fetchShopBids();
      } else {
        toast.error(data.message || `Failed to ${action} bid`);
      }
    } catch (error) {
      console.error("Error updating bid:", error);
      toast.error(error.response?.data?.message || `Error ${action}ing bid`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "product",
      headerName: "Product",
      minWidth: 200,
      flex: 1.2,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <img
            src={params.row.productImage}
            alt=""
            className="w-10 h-10 object-cover rounded-lg border border-gray-100 dark:border-gray-700"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
              {params.row.productName}
            </span>
            <span className="text-[12px] text-gray-500">
              Base: Rs.{params.row.startingPrice.toLocaleString()}
            </span>
          </div>
        </div>
      ),
    },
    {
      field: "buyer",
      headerName: "Buyer",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-gray-700 dark:text-gray-300">{params.row.buyerName}</span>
          <span className="text-xs text-gray-500 truncate max-w-[140px]">{params.row.buyerEmail}</span>
        </div>
      ),
    },
    {
      field: "bidAmount",
      headerName: "Bid Details",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const isHigher = params.row.bidAmount >= params.row.currentPrice;
        return (
          <div className="flex flex-col leading-tight">
            <span className={`font-bold ${isHigher ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
              Rs.{params.row.bidAmount.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500">
              Current: Rs.{params.row.currentPrice.toLocaleString()}
            </span>
          </div>
        );
      },
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
        } else if (status === "completed") {
          colorClass = "text-blue-600 dark:text-blue-400";
          bgColorClass = "bg-blue-100 dark:bg-blue-900/30";
          Icon = AiOutlineCheckCircle;
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
      headerName: "Bid Date",
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
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.row.status === "pending") {
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBidAction(params.row.id, "accepted")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all duration-300 font-bold text-xs shadow-sm border border-green-200 dark:border-green-800"
                title="Accept Bid"
              >
                <AiOutlineCheck size={14} />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleBidAction(params.row.id, "rejected")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold text-xs shadow-sm border border-red-200 dark:border-red-800"
                title="Reject Bid"
              >
                <AiOutlineClose size={14} />
                <span>Reject</span>
              </button>
            </div>
          );
        }
        return (
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded shadow-inner uppercase tracking-wider">No actions</span>
        );
      },
    },
  ];

  const pendingBids = bids.filter(b => b.status === "pending").length;
  const acceptedBids = bids.filter(b => b.status === "accepted").length;

  return (
    <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in text-gray-800 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-[32px] font-Poppins font-bold tracking-tight">
            Live Auction Bids
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage active bids on your auction items.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard-buyer-requests")}
            className="bg-brand-teal text-white border border-brand-teal hover:bg-brand-teal-dark font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm shadow-brand-teal/20"
          >
            <RiAuctionLine size={20} />
            Browse User Requests
          </button>
          <button
            onClick={fetchShopBids}
            disabled={loading}
            className="bg-white dark:bg-gray-800 text-brand-teal border border-brand-teal hover:bg-brand-teal hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <AiOutlineReload className={`${loading ? 'animate-spin' : ''}`} size={20} />
            Refresh Bids
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-teal/10 rounded-xl text-brand-teal">
              <RiAuctionLine size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Bids</p>
              <h4 className="text-2xl font-bold">{bids.length}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400">
              <AiOutlineClockCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Review</p>
              <h4 className="text-2xl font-bold">{pendingBids}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
              <AiOutlineLineChart size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Accepted Bids</p>
              <h4 className="text-2xl font-bold">{acceptedBids}</h4>
            </div>
          </div>
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
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No bids found yet</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">Bids will appear here once customers start bidding on your auction items.</p>
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

export default ShopBids;

