import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit, AiOutlinePlus, AiOutlineShopping, AiOutlineStock, AiOutlineCheckCircle, AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { IoIosArrowDown } from "react-icons/io";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortType, setSortType] = React.useState("Newest First");
  const [openSort, setOpenSort] = React.useState(false);
  const sortRef = React.useRef(null);

  const sortOptions = [
    "Sales: High to Low",
    "Sales: Low to High",
    "Newest First",
    "Price: Low to High",
    "Price: High to Low",
    "Oldest First",
  ];

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id));
      dispatch(getAllProductsShop());
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("All Products Report", 14, 15);

    const tableColumn = ["Product ID", "Name", "Price", "Stock", "Sold Out"];
    const tableRows = [];

    products.forEach((item) => {
      const productData = [item._id, item.name, `Rs ${item.discountPrice}`, item.stock, item.sold_out];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("products_report.pdf");
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
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
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 90,
      flex: 0.5,
      renderCell: (params) => {
        const stock = params.value;
        const colorClass = stock > 5 ? "text-green-600" : "text-red-500";
        return <span className={`font-semibold ${colorClass}`}>{stock}</span>;
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
      minWidth: 180,
      headerName: "Manage",
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-3">
            <Link to={`/product/${params.id}`}>
              <div className="p-2.5 rounded-xl bg-teal-50 hover:bg-brand-teal text-brand-teal hover:text-white transition-all duration-300 shadow-sm border border-teal-100 dark:border-brand-teal/20 group" title="Preview Product">
                <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform" />
              </div>
            </Link>
            <Link to={`/dashboard/product/update/${params.id}`}>
              <div className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white transition-all duration-300 shadow-sm border border-blue-100 dark:border-blue-500/20 group" title="Edit Product">
                <AiOutlineEdit size={18} className="group-hover:scale-110 transition-transform" />
              </div>
            </Link>
            <div
              onClick={() => handleDelete(params.id)}
              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 shadow-sm border border-red-100 dark:border-red-500/20 cursor-pointer group"
              title="Delete Product"
            >
              <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform" />
            </div>
          </div>
        );
      },
    },
  ];

  const row = [];
  if (products) {
    let sortedProducts = [...products].filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply Sorting
    sortedProducts.sort((a, b) => {
      if (sortType === "Sales: High to Low") return b.sold_out - a.sold_out;
      if (sortType === "Sales: Low to High") return a.sold_out - b.sold_out;
      if (sortType === "Price: High to Low") return b.discountPrice - a.discountPrice;
      if (sortType === "Price: Low to High") return a.discountPrice - b.discountPrice;
      if (sortType === "Newest First") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "Oldest First") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0; // Default or Best Selling
    });

    sortedProducts.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Rs " + item.discountPrice.toLocaleString(),
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });
  }

  const totalStock = products?.reduce((acc, curr) => acc + curr.stock, 0) || 0;
  const totalSold = products?.reduce((acc, curr) => acc + (curr.sold_out || 0), 0) || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen animate-fade-in">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h3 className="text-[32px] font-Poppins text-gray-800 dark:text-white font-bold tracking-tight">
                All Products
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your inventory and track product performance.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard-create-product"
                className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-brand-teal/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <AiOutlinePlus size={20} />
                Create Product
              </Link>
              <button
                onClick={downloadPDF}
                className="bg-white dark:bg-gray-800 text-brand-teal border border-brand-teal hover:bg-brand-teal hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-sm"
              >
                Download Report
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            {/* Search Filter */}
            <div className="relative group w-full max-w-md">
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[45px] pl-11 pr-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-brand-teal text-gray-700 dark:text-gray-200 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg placeholder:text-gray-400 font-medium"
              />
              <AiOutlineSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal group-focus-within:scale-110 transition-transform duration-300"
                size={22}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative z-[1001]" ref={sortRef}>
              <div
                className="h-[45px] min-w-[220px] px-4 flex items-center justify-between bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 group"
                onClick={() => setOpenSort(!openSort)}
              >
                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                  {sortType}
                </span>
                <IoIosArrowDown
                  size={18}
                  className={`text-gray-400 group-hover:text-brand-teal transition-transform duration-300 ${openSort ? "rotate-180" : ""}`}
                />
              </div>

              {openSort && (
                <div className="absolute top-[50px] left-0 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 animate-fade-in-down origin-top">
                  {sortOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-200 
                                    ${sortType === option
                          ? "bg-teal-50 dark:bg-brand-teal/10 text-brand-teal"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-brand-teal"
                        }`}
                      onClick={() => {
                        setSortType(option);
                        setOpenSort(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-teal/10 rounded-xl text-brand-teal">
                  <AiOutlineShopping size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{products?.length || 0}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-100 rounded-xl text-purple-600">
                  <AiOutlineStock size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Inventory Stock</p>
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

          {/* Products Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {row.length === 0 ? (
              <div className="w-full flex flex-col justify-center items-center py-20">
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
                  <AiOutlineShopping className="text-gray-300" size={60} />
                </div>
                <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No products found yet</p>
                <Link to="/dashboard-create-product" className="mt-4 text-brand-teal font-semibold hover:underline">
                  Add your first product
                </Link>
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
      )}
    </>
  );
};

export default AllProducts;

