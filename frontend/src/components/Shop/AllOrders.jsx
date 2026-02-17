import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight, AiOutlineShopping, AiOutlineDollar, AiOutlineCheckCircle, AiOutlineLoading, AiOutlineCloseCircle, AiOutlineSync } from "react-icons/ai";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const [processedOrders, setProcessedOrders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop());
  }, [dispatch]);

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      const processed = orders.map((order) => {
        const shopItems = order.cart.filter(item => item.shopId === seller._id);
        const shopTotal = shopItems.reduce((total, item) => {
          return total + (item.discountPrice || item.price) * (item.qty || 1);
        }, 0);

        return {
          id: order._id,
          names: shopItems.map(i => i.item?.name || i.name).join(", "),
          status: order.status || "Processing",
          itemsQty: shopItems.length || 0,
          total: shopTotal,
          createdAt: new Date(order.createdAt).toLocaleDateString()
        };
      });
      setProcessedOrders(processed);
    }
  }, [orders, seller._id]);

  const columns = [
    { field: "names", headerName: "Product Name", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.row.status;
        let colorClass = "";
        let bgColorClass = "";
        let Icon = null;

        if (status === "Delivered") {
          colorClass = "text-green-600 dark:text-green-400";
          bgColorClass = "bg-green-100 dark:bg-green-900/30";
          Icon = AiOutlineCheckCircle;
        } else if (status === "Processing") {
          colorClass = "text-blue-600 dark:text-blue-400";
          bgColorClass = "bg-blue-100 dark:bg-blue-900/30";
          Icon = AiOutlineSync;
        } else if (status === "Shipping") {
          colorClass = "text-orange-600 dark:text-orange-400";
          bgColorClass = "bg-orange-100 dark:bg-orange-900/30";
          Icon = AiOutlineLoading;
        } else if (status === "Cancelled") {
          colorClass = "text-red-600 dark:text-red-400";
          bgColorClass = "bg-red-100 dark:bg-red-900/30";
          Icon = AiOutlineCloseCircle;
        } else {
          colorClass = "text-gray-600 dark:text-gray-400";
          bgColorClass = "bg-gray-100 dark:bg-gray-800";
          Icon = AiOutlineSync;
        }

        return (
          <span className={`${colorClass} ${bgColorClass} px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm border border-current/10`}>
            {Icon && <Icon size={14} className={status === "Shipping" ? "animate-spin-slow" : ""} />}
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
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          Rs {params.value.toLocaleString()}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 130,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white rounded-lg transition-all duration-300 font-bold text-xs group shadow-sm">
              <span>Details</span>
              <AiOutlineArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        );
      },
    },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Shop Orders Report", 14, 15);

    const tableColumn = ["Order ID", "Status", "Items Qty", "Total", "Order Date"];
    const tableRows = [];

    orders.forEach((item) => {
      const orderData = [
        item._id,
        item.status,
        item.cart.filter(item => item.shopId === seller._id).length || 0,
        item.cart.reduce((total, item) => {
          if (item.shopId === seller._id) {
            return total + (item.discountPrice || item.price) * (item.qty || 1);
          }
          return total;
        }, 0),
        new Date(item?.createdAt).toLocaleString()
      ];
      tableRows.push(orderData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("shop_orders_report.pdf");
  };

  const totalSales = processedOrders.reduce((acc, curr) => acc + curr.total, 0);
  const totalItems = processedOrders.reduce((acc, curr) => acc + curr.itemsQty, 0);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-[32px] font-Poppins text-gray-800 dark:text-white font-bold tracking-tight">
                All Orders
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your shop's orders efficiently.</p>
            </div>
            <button
              onClick={downloadPDF}
              className="bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-brand-teal/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              Download Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-teal/10 rounded-xl text-brand-teal">
                  <AiOutlineShopping size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{processedOrders.length}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-100 rounded-xl text-purple-600">
                  <AiOutlineShopping size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Items Sold</p>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{totalItems}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-100 rounded-xl text-orange-600">
                  <AiOutlineDollar size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Sales</p>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">Rs {totalSales.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {processedOrders.length === 0 ? (
              <div className="w-full flex flex-col justify-center items-center py-20">
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
                  <AiOutlineShopping className="text-gray-300" size={60} />
                </div>
                <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No orders found yet</p>
              </div>
            ) : (
              <div className="w-full">
                <DataGrid
                  rows={processedOrders}
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
      )}
    </>
  );
};

export default AllOrders;

