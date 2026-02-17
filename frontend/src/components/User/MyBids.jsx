import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineEye, AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle, AiOutlineHistory } from "react-icons/ai";
import { FiTrendingUp, FiCheckCircle, FiClock } from "react-icons/fi";
import { MdOutlinePayments, MdOutlineGavel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Button, Tooltip, IconButton } from "@material-ui/core";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const MyBids = ({ isProfile }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/bid/user`, {
        withCredentials: true
      });
      console.log("My bids:", data);
      // Filter out bids that are on buyer requests (user's own or others')
      // Assuming user bids on auctions, but buyer requests are separate. 
      // Actually, "My Bids" usually shows bids I placed. 
      // If I placed a bid on a normal auction, keep it.
      // If I placed a bid on a buyer request (as a seller), that's handled in shop dashboard.
      // If this is the user dashboard, "My Bids" should only show bids on regular auctions.
      const regularBids = (data.bids || []).filter(bid => !bid.product?.isBuyerRequest);
      setBids(regularBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast.error(error.response?.data?.message || "Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptedBid = (bid) => {
    try {
      // Prepare order data for checkout without updating status yet
      const orderData = {
        totalPrice: bid.bidAmount,
        subTotalPrice: bid.bidAmount,
        shipping: 0,
        discountPrice: 0,
        cart: [{
          _id: bid.product._id,
          name: bid.product.name,
          price: bid.bidAmount,
          discountPrice: bid.bidAmount,
          qty: 1,
          images: bid.product.images,
          shopId: bid.product.shop,
          isAuctionItem: true,
        }],
        user,
        isAcceptedBid: true,
        bidId: bid._id // Pass bidId to track which bid this order is for
      };

      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/checkout");
    } catch (error) {
      console.error("Error setting up checkout:", error);
      toast.error("Failed to proceed to checkout. Please try again.");
    }
  };

  const columns = [
    {
      field: "productImage",
      headerName: "Product Image",
      minWidth: 100,
      flex: 0.7,
      renderCell: (params) => {
        return (
          <img
            src={params.row.product?.images[0]?.url || ""}
            alt="Product"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        );
      },
    },
    {
      field: "productName",
      headerName: "Product",
      minWidth: 180,
      flex: 1.4,
      renderCell: (params) => params.row.product?.name || "N/A",
    },
    {
      field: "basePrice",
      headerName: "Base Price",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => {
        return "Rs. " + (params.row.product?.startingPrice || 0);
      },
    },
    {
      field: "currentPrice",
      headerName: "Current Price",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => {
        return "Rs. " + (params.row.product?.currentPrice || params.row.product?.startingPrice || 0);
      },
    },
    {
      field: "bidAmount",
      headerName: "My Bid",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => {
        return "Rs. " + params.value;
      },
    },
    {
      field: "buyNowPrice",
      headerName: "Buy Now Price",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => {
        return "Rs. " + (params.row.product?.buyNowPrice || "N/A");
      },
    },
    {
      field: "createdAt",
      headerName: "Bid Date",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => {
        return (
          <div className="flex flex-col justify-center h-full">
            <span className="text-[13px] font-bold text-gray-800 dark:text-gray-200 leading-none mb-1">
              {new Date(params.value).toLocaleDateString()}
            </span>
            <span className="text-[11px] text-gray-400 font-medium leading-none">
              {new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status || "pending";
        const isCheckedOut = params.row.isCheckedOut;

        if (status === "accepted" && !isCheckedOut) {
          return (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold border border-green-100 dark:border-green-800">
                <AiOutlineCheckCircle size={14} />
                Accepted
              </span>
              <Tooltip title="Complete Purchase">
                <Button
                  onClick={() => handleAcceptedBid(params.row)}
                  className="!min-w-0 !p-1.5 !bg-brand-teal hover:!bg-brand-teal-dark !text-white !rounded-lg !shadow-sm hover:!shadow-md transition-all"
                >
                  <MdOutlinePayments size={16} />
                </Button>
              </Tooltip>
            </div>
          );
        }

        if (status === "completed" || (status === "accepted" && isCheckedOut)) {
          return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800">
              <AiOutlineHistory size={14} />
              Completed
            </span>
          );
        }

        if (status === "rejected") {
          return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-800">
              <AiOutlineCloseCircle size={14} />
              Rejected
            </span>
          );
        }

        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold border border-gray-100 dark:border-gray-700">
            <AiOutlineClockCircle size={14} />
            Pending
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "View",
      minWidth: 80,
      flex: 0.5,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.row.product?._id}`}>
            <Tooltip title="View Product">
              <IconButton className="hover:!bg-brand-teal/10 hover:!text-brand-teal transition-all">
                <AiOutlineEye size={20} />
              </IconButton>
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  const acceptedBids = bids.filter(b => b.status === "accepted" || b.status === "completed").length;
  const pendingBids = bids.filter(b => b.status === "pending").length;
  const totalInvestment = bids.reduce((acc, b) => acc + (b.bidAmount || 0), 0);

  return (
    <div className={`w-full ${!isProfile ? 'bg-gray-50/30 dark:bg-transparent min-h-screen px-4 md:px-8 py-8' : 'py-2'} animate-fadeIn`}>
      <div className="flex flex-col gap-8 max-w-[1600px] mx-auto">

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-[28px] font-black text-gray-900 dark:text-white font-Poppins tracking-tight">
              My <span className="text-brand-teal">Bids</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Track and manage your auction participation performance.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <MdOutlineGavel className="text-brand-teal" size={20} />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Active Participant</span>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group overflow-hidden relative">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                <FiTrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Participation</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">{bids.length} <span className="text-xs font-medium text-gray-400 ml-1">Bids Placed</span></h4>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/10 transition-all"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group overflow-hidden relative">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                <FiCheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accepted Bids</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">{acceptedBids} <span className="text-xs font-medium text-gray-400 ml-1">Successful</span></h4>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group overflow-hidden relative">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <FiClock size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Bid Value</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">Rs {totalInvestment.toLocaleString()}</h4>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all"></div>
          </div>
        </div>

        {/* DataGrid Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
              <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium animate-pulse">Fetching your bids...</p>
            </div>
          ) : bids.length > 0 ? (
            <div className="w-full">
              <DataGrid
                rows={bids}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                getRowId={(row) => row._id}
                className="!border-none"
                rowHeight={80}
                headerHeight={60}
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-[50vh] gap-6 p-8">
              <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-200 dark:text-gray-700">
                <MdOutlineGavel size={40} />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Bids Found</h4>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                  You haven't participated in any auctions yet. Explore live events and place your first bid!
                </p>
                <Link to="/live-auctions">
                  <Button className="!bg-brand-teal hover:!bg-brand-teal-dark !text-white !px-8 !py-3 !rounded-xl !font-bold !shadow-lg shadow-brand-teal/20 transition-all active:scale-95">
                    Explore Auctions
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

export default MyBids;
