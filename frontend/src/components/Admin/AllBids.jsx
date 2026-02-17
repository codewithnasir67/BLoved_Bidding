import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllBids = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${server}/bid/admin-all-bids`, {
          withCredentials: true,
        });
        setBids(data.bids);
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    };
    getAllBids();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Bid ID",
      minWidth: 150,
      flex: 0.7
    },
    {
      field: "productName",
      headerName: "Product Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "bidAmount",
      headerName: "Bid Amount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "bidderName",
      headerName: "Bidder",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "sellerName",
      headerName: "Seller",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "createdAt",
      headerName: "Bid Date",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  bids &&
    bids.forEach((item) => {
      row.push({
        id: item._id,
        productName: item.product?.name || "Product Removed",
        bidAmount: "Rs" + item.bidAmount,
        bidderName: item.buyer?.name || "Unknown",
        sellerName: item.seller?.name || "Unknown",
        createdAt: new Date(item.createdAt).toLocaleString(),
      });
    });

  return (
    <div className="w-full p-8 bg-[#111827]">
      <div className="w-full bg-[#1f2937] shadow-xl rounded-2xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-wide">
            All Bids
            <span className="block text-sm font-medium text-gray-400 mt-1">Monitor all bidding activity</span>
          </h3>
        </div>

        <div className="w-full h-[70vh] rounded-xl overflow-hidden">
          <DataGrid
            rows={row}
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
                borderBottom: "none !important",
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
  );
};

export default AllBids;
