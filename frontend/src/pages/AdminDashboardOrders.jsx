import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { Button } from "@material-ui/core";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const rows = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, curr) => acc + curr.qty, 0),
        total: item?.totalPrice + " Rs",
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  // Function to generate and download the PDF report
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Orders Report", 14, 15);

    const tableColumn = ["Order ID", "Status", "Items Qty", "Total", "Order Date"];
    const tableRows = [];

    adminOrders.forEach((item) => {
      const orderData = [
        item._id,
        item.status,
        item.cart.reduce((acc, curr) => acc + curr.qty, 0),
        item.totalPrice + " Rs",
        item.createdAt.slice(0, 10),
      ];
      tableRows.push(orderData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("admin_orders_report.pdf");
  };

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>
          <div className="w-full min-h-screen p-8 bg-[#111827]">
            <div className="w-full bg-[#1f2937] shadow-xl rounded-2xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white tracking-wide">
                  All Orders
                  <span className="block text-sm font-medium text-gray-400 mt-1">Track platform transactions</span>
                </h3>
                <Button
                  variant="contained"
                  className="!bg-teal-500 !text-white !font-bold !rounded-xl !px-6 !py-2 hover:!bg-teal-600 shadow-lg shadow-teal-500/20"
                  onClick={downloadPDF}
                >
                  Download Report
                </Button>
              </div>

              <div className="w-full h-[70vh] rounded-xl overflow-hidden">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  autoHeight
                  className="!text-gray-300 !border-none"
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#374151 !important",
                      color: "#fff !important",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      borderBottom: "none !important",
                    },
                    "& .MuiDataGrid-row": {
                      borderBottom: "1px solid #374151 !important",
                      "&:hover": {
                        backgroundColor: "#374151 !important",
                      },
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none !important",
                      color: "#d1d5db !important",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      backgroundColor: "#1f2937 !important",
                      color: "#fff !important",
                      borderTop: "1px solid #374151 !important",
                    },
                    "& .MuiTablePagination-root": {
                      color: "#fff !important",
                    },
                    "& .MuiTablePagination-caption": {
                      color: "#fff !important",
                    },
                    "& .MuiTablePagination-selectLabel": {
                      color: "#fff !important",
                    },
                    "& .MuiTablePagination-displayedRows": {
                      color: "#fff !important",
                    },
                    "& .MuiTablePagination-actions": {
                      color: "#fff !important",
                    },
                    "& .MuiTablePagination-select": {
                      color: "#fff !important",
                    },
                    "& .MuiTablePagination-selectIcon": {
                      fill: "#fff !important",
                    },
                    "& .MuiIconButton-root": {
                      color: "#fff !important",
                    },
                    "& .MuiSvgIcon-root": {
                      fill: "#fff !important",
                    },
                    "& .Mui-disabled": {
                      color: "rgba(255, 255, 255, 0.3) !important",
                    },
                    "& .Mui-disabled .MuiSvgIcon-root": {
                      fill: "rgba(255, 255, 255, 0.3) !important",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
