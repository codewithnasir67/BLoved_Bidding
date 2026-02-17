import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState('Processing');

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 80, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 100,
      flex: 1.4,
    },
    {
      field: "shopId",
      headerName: "Shop Id",
      minWidth: 80,
      flex: 1.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 70,
      flex: 0.6,
    },
    {
      field: "status",
      headerName: "status",
      type: "text",
      minWidth: 70,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Request given at",
      type: "number",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 80,
      flex: 0.6,
      renderCell: (params) => {

        return (
          <BsPencil
            size={20}
            className={`${params.row.status !== "Processing" ? 'hidden' : ''} mr-5 cursor-pointer text-gray-400 hover:text-teal-500 transition-colors`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(`${server}/withdraw/update-withdraw-request/${withdrawData.id}`, {
        sellerId: withdrawData.shopId,
      }, { withCredentials: true })
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "Rs " + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });
  return (
    <div className="w-full p-8 bg-[#111827]">
      <div className="w-full bg-[#1f2937] shadow-xl rounded-2xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-wide">
            Withdraw Requests
            <span className="block text-sm font-medium text-gray-400 mt-1">Manage payout requests</span>
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
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-[#1f2937] rounded-2xl shadow-2xl p-8 border border-gray-700">
            <div className="flex justify-end w-full mb-4">
              <RxCross1 size={25} className="text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-2xl text-center font-bold text-white mb-6">
              Update Withdraw Status
            </h1>
            <div className="w-full flex flex-col items-center">
              <select
                name=""
                id=""
                onChange={(e) => setWithdrawStatus(e.target.value)}
                className="w-[200px] h-[40px] border border-gray-600 rounded bg-gray-700 text-white px-2 focus:outline-none focus:border-teal-500 mb-6"
              >
                <option value={withdrawStatus}>{withdrawData.status}</option>
                <option value={withdrawStatus}>Succeed</option>
              </select>
              <button
                type="submit"
                className="px-8 py-3 bg-teal-500 rounded-xl text-white font-bold cursor-pointer hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
