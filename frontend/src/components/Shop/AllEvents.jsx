import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineCalendar, AiOutlineCheckCircle, AiOutlineStock, AiOutlinePlus, AiOutlineCloseCircle, AiOutlineWarning } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsShop());
  }, [dispatch]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("All Events Report", 14, 15);

    const tableColumn = ["Event ID", "Name", "Price", "Stock", "Sold Out"];
    const tableRows = [];

    events.forEach((item) => {
      const eventData = [
        item._id,
        item.name,
        `Rs ${item.discountPrice}`,
        item.stock,
        item.sold_out,
      ];
      tableRows.push(eventData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("events_report.pdf");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id))
        .then(() => {
          toast.success("Event deleted successfully");
          dispatch(getAllEventsShop(seller._id));
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Error deleting event");
        });
    }
  };

  const columns = [
    { field: "id", headerName: "Event ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      renderCell: (params) => (
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {params.value}
        </span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 110,
      flex: 0.6,
      renderCell: (params) => (
        <span className="font-semibold text-brand-teal whitespace-nowrap">
          {params.value}
        </span>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 90,
      flex: 0.5,
      renderCell: (params) => {
        const stock = params.value;
        let colorClass = "";
        let bgColorClass = "";
        let Icon = null;
        let text = "";

        if (stock === 0) {
          colorClass = "text-red-600 dark:text-red-400";
          bgColorClass = "bg-red-100 dark:bg-red-900/30";
          Icon = AiOutlineCloseCircle;
          text = "Out of Stock";
        } else if (stock <= 5) {
          colorClass = "text-orange-600 dark:text-orange-400";
          bgColorClass = "bg-orange-100 dark:bg-orange-900/30";
          Icon = AiOutlineWarning;
          text = `Low Stock (${stock})`;
        } else {
          colorClass = "text-green-600 dark:text-green-400";
          bgColorClass = "bg-green-100 dark:bg-green-900/30";
          Icon = AiOutlineCheckCircle;
          text = `In Stock (${stock})`;
        }

        return (
          <span className={`${colorClass} ${bgColorClass} px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm border border-current/10`}>
            {Icon && <Icon size={14} />}
            {text}
          </span>
        );
      }
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 110,
      flex: 0.6,
    },
    {
      field: "actions",
      flex: 1,
      minWidth: 130,
      headerName: "Actions",
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-3">
            <Link to={`/event/${params.id}`}>
              <div className="p-2 rounded-full bg-gray-100 hover:bg-brand-teal text-gray-600 hover:text-white transition-all duration-300 shadow-sm">
                <AiOutlineEye size={18} />
              </div>
            </Link>
            <div
              onClick={() => handleDelete(params.id)}
              className="p-2 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
            >
              <AiOutlineDelete size={18} />
            </div>
          </div>
        );
      },
    },
  ];

  const rows = [];
  events &&
    events.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: "Rs. " + item.discountPrice.toLocaleString(),
        stock: item.stock,
        sold: item?.sold_out,
      });
    });

  const totalStock = events?.reduce((acc, curr) => acc + curr.stock, 0) || 0;
  const totalSold = events?.reduce((acc, curr) => acc + (curr.sold_out || 0), 0) || 0;

  return (
    <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h3 className="text-[32px] font-Poppins text-gray-800 dark:text-white font-bold tracking-tight">
            All Events
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage your special promotional events.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard-create-event">
            <button
              className="bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-brand-teal/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <AiOutlinePlus size={20} />
              Create Event
            </button>
          </Link>
          <button
            onClick={downloadPDF}
            className="bg-white dark:bg-gray-800 text-brand-teal border border-brand-teal hover:bg-brand-teal hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-sm"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-teal/10 rounded-xl text-brand-teal">
              <AiOutlineCalendar size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Events</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{events?.length || 0}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-xl text-purple-600">
              <AiOutlineStock size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Stock</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{totalStock}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 rounded-xl text-orange-600">
              <AiOutlineCheckCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Items Sold</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{totalSold}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <Loader />
          </div>
        ) : rows.length === 0 ? (
          <div className="w-full flex flex-col justify-center items-center py-20">
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
              <AiOutlineCalendar className="text-gray-300" size={60} />
            </div>
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No events created yet</p>
            <Link to="/dashboard-create-event" className="mt-4 text-brand-teal font-semibold hover:underline">
              Launch your first event
            </Link>
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
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
