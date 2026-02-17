import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "jspdf-autotable";


const AllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllUsers());
  };
  // Function to Download PDF Report
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("All Users Report", 14, 15);

    const tableColumn = ["User ID", "Name", "Email", "Role", "Joined At"];
    const tableRows = [];

    users.forEach((item) => {
      const userData = [
        item._id,
        item.name,
        item.email,
        item.role,
        item.createdAt.slice(0, 10),
      ];
      tableRows.push(userData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("users_report.pdf");
  };
  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "joinedAt",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete User",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete size={20} className="text-gray-400 hover:text-red-500 transition-colors" />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  users &&
    users.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        joinedAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="w-full p-8 bg-[#111827]">
      <div className="w-full bg-[#1f2937] shadow-xl rounded-2xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-wide">
            All Users
            <span className="block text-sm font-medium text-gray-400 mt-1">Manage platform users</span>
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

        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center h-screen">
            <div className="w-[90%] 800px:w-[35%] min-h-[20vh] bg-[#1f2937] rounded-2xl shadow-2xl p-8 border border-gray-700">
              <div className="w-full flex justify-end cursor-pointer mb-4">
                <RxCross1 size={24} className="text-gray-400 hover:text-white transition-colors" onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-xl text-center font-bold text-white mb-8">
                Are you sure you want to delete this user?
              </h3>
              <div className="w-full flex items-center justify-center gap-4">
                <div
                  className="px-8 py-3 bg-gray-600 rounded-xl text-white font-bold cursor-pointer hover:bg-gray-500 transition-all"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </div>
                <div
                  className="px-8 py-3 bg-red-500 rounded-xl text-white font-bold cursor-pointer hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                  onClick={() => setOpen(false) || handleDelete(userId)}
                >
                  Confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
