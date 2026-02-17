import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios.get(`${server}/event/admin-all-events`, { withCredentials: true }).then((res) => {
      setEvents(res.data.events);
    })
  }, []);
  // Function to Download PDF Report
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("All Events Report", 14, 15);

    const tableColumn = ["Event ID", "Name", "Price", "Stock", "Sold Out"];
    const tableRows = [];

    events.forEach((item) => {
      const eventData = [item._id, item.name, `Rs ${item.discountPrice}`, item.stock, item.sold_out];
      tableRows.push(eventData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("events_report.pdf");
  };
  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} className="text-gray-400 hover:text-teal-500 transition-colors" />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Rs " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
      });
    });


  return (
    <div className="w-full p-8 bg-[#111827]">
      <div className="w-full bg-[#1f2937] shadow-xl rounded-2xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-wide">
            All Events
            <span className="block text-sm font-medium text-gray-400 mt-1">Manage platform events</span>
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
      </div>
    </div>
  );
};


export default AllEvents;
