import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlinePlus, AiOutlinePercentage, AiOutlineTag, AiOutlineClose } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-all-shop-coupons`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupouns(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const handleDelete = async (id) => {
    axios.delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true }).then((res) => {
      toast.success("Coupon code deleted succesfully!");
      // Refresh the list instead of full reload for better ux
      setCoupouns((prev) => prev.filter((item) => item._id !== id));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        // Refresh the list
        setCoupouns((prev) => [...prev, res.data.couponCode]);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1.4,
      renderCell: (params) => (
        <span className="font-semibold text-gray-700 dark:text-gray-200 bg-brand-teal/5 px-3 py-1 rounded-lg border border-brand-teal/10">
          {params.value}
        </span>
      ),
    },
    {
      field: "price",
      headerName: "Discount Value",
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <span className="font-bold text-orange-600 dark:text-orange-400">
          {params.value}
        </span>
      ),
    },
    {
      field: "Delete",
      flex: 0.6,
      minWidth: 100,
      headerName: "Action",
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div
            onClick={() => handleDelete(params.id)}
            className="p-2 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
          >
            <AiOutlineDelete size={18} />
          </div>
        );
      },
    },
  ];

  const row = [];
  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
      });
    });

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
                Discount Codes
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage your shop's promotional coupons.</p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-brand-teal/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <AiOutlinePlus size={20} />
              Create Coupon
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-teal/10 rounded-xl text-brand-teal">
                  <AiOutlineTag size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Coupons</p>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{coupouns?.length || 0}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-100 rounded-xl text-orange-600">
                  <AiOutlinePercentage size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Avg. Discount</p>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {coupouns.length > 0
                      ? (coupouns.reduce((acc, c) => acc + c.value, 0) / coupouns.length).toFixed(1)
                      : 0}%
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {row.length === 0 ? (
              <div className="w-full flex flex-col justify-center items-center py-20">
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
                  <AiOutlineTag className="text-gray-300" size={60} />
                </div>
                <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No coupon codes found yet</p>
                <button onClick={() => setOpen(true)} className="mt-4 text-brand-teal font-semibold hover:underline">
                  Create your first coupon
                </button>
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

          {/* Create Modal */}
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-black/40 backdrop-blur-sm z-[20000] flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 animate-scale-in relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <AiOutlineClose size={24} />
                </button>

                <div className="mb-8">
                  <h5 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Create Coupon Code
                  </h5>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Specify the rules for your new promotional discount.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Coupon Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. SUMMER25"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all dark:text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Discount (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all dark:text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmout(e.target.value)}
                        placeholder="e.g. 1000"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all dark:text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Applies To
                    </label>
                    <select
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="">All Products</option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i._id}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-teal/20 transition-all duration-300 mt-4 active:scale-95"
                  >
                    Create Coupon
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;

