import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight, AiOutlineReload, AiOutlineCheckCircle, AiOutlineUndo, AiOutlineSync } from "react-icons/ai";

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const refundOrders = orders && orders.filter((item) => item.status === "Processing refund" || item.status === "Refund Success");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => {
        const status = params.row.status;
        let colorClass = "";
        let bgColorClass = "";
        let Icon = null;

        if (status === "Refund Success") {
          colorClass = "text-green-600 dark:text-green-400";
          bgColorClass = "bg-green-100 dark:bg-green-900/30";
          Icon = AiOutlineCheckCircle;
        } else {
          colorClass = "text-orange-600 dark:text-orange-400";
          bgColorClass = "bg-orange-100 dark:bg-orange-900/30";
          Icon = AiOutlineSync;
        }

        return (
          <span className={`${colorClass} ${bgColorClass} px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm border border-current/10`}>
            {Icon && <Icon size={14} className={status !== "Refund Success" ? "animate-spin-slow" : ""} />}
            {status}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "total",
      headerName: "Total Amount",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <span className="font-semibold text-brand-teal">
          {params.value}
        </span>
      ),
    },
    {
      field: "action",
      flex: 0.6,
      minWidth: 130,
      headerName: "Details",
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white rounded-lg transition-all duration-300 font-bold text-xs group shadow-sm">
              <span>View Details</span>
              <AiOutlineArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        );
      },
    },
  ];

  const row = [];
  refundOrders &&
    refundOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "Rs " + item.totalPrice.toLocaleString(),
        status: item.status,
      });
    });

  const processingRefunds = refundOrders?.filter(o => o.status === "Processing refund").length || 0;
  const successRefunds = refundOrders?.filter(o => o.status === "Refund Success").length || 0;

  return (
    <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in text-gray-800 dark:text-white">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-[32px] font-Poppins font-bold tracking-tight">
          Refund Claims
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track returned items and refund requests.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-teal/10 rounded-xl text-brand-teal">
              <AiOutlineUndo size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Requests</p>
              <h4 className="text-2xl font-bold">{refundOrders?.length || 0}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 rounded-xl text-orange-600">
              <AiOutlineReload size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Processing</p>
              <h4 className="text-2xl font-bold">{processingRefunds}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-xl text-green-600">
              <AiOutlineCheckCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Resolved</p>
              <h4 className="text-2xl font-bold">{successRefunds}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <Loader />
          </div>
        ) : row.length === 0 ? (
          <div className="w-full flex flex-col justify-center items-center py-24">
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
              <AiOutlineUndo className="text-gray-300" size={60} />
            </div>
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No refund requests found</p>
          </div>
        ) : (
          <div className="w-full">
            <DataGrid
              rows={row}
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

export default AllRefundOrders;

