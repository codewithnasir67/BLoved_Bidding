import React, { useEffect, useState } from "react";
import { RiAuctionLine, RiHandCoinLine, RiShoppingCartLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineArrowRight, AiOutlineMoneyCollect, AiOutlineShopping } from "react-icons/ai";
import { MdOutlineNumbers, MdOutlinePayments, MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop, getShopSalesStats } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders, stats, statsLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [activeFilter, setActiveFilter] = useState("monthly");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    dispatch(getAllOrdersOfShop());
    dispatch(getAllProductsShop());
    dispatch(getShopSalesStats());
  }, [dispatch]);

  useEffect(() => {
    if (stats) {
      if (activeFilter === "weekly") {
        setChartData(stats.weekly);
      } else if (activeFilter === "monthly") {
        setChartData(stats.monthly);
      } else if (activeFilter === "yearly") {
        setChartData(stats.yearly);
      }
    }
  }, [activeFilter, stats]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      renderHeader: () => (
        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          <MdOutlineNumbers size={16} className="text-brand-teal" />
          <span>Order ID</span>
        </div>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderHeader: () => (
        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          <AiOutlineShopping size={16} className="text-orange-400" />
          <span>Status</span>
        </div>
      ),
      renderCell: (params) => {
        const status = params.value;
        const isDelivered = status === "Delivered";
        return (
          <div className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit ${isDelivered
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDelivered ? "bg-green-600" : "bg-orange-600"}`}></span>
            {status}
          </div>
        );
      },
    },
    {
      field: "orderType",
      headerName: "Order Type",
      minWidth: 130,
      flex: 0.7,
      renderHeader: () => (
        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          <RiAuctionLine size={16} className="text-brand-purple" />
          <span>Order Type</span>
        </div>
      ),
      renderCell: (params) => {
        const type = params.value;
        let config = {
          color: "teal",
          icon: <RiShoppingCartLine size={14} />,
          text: "Cart Order"
        };

        if (type === 'auction') {
          config = {
            color: "purple",
            icon: <RiAuctionLine size={14} />,
            text: "Auction Win"
          };
        } else if (type === 'buy_now') {
          config = {
            color: "orange",
            icon: <RiHandCoinLine size={14} />,
            text: "Direct Buy"
          };
        }

        return (
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-semibold w-fit
            ${config.color === 'teal' ? 'bg-brand-teal/5 border-brand-teal/20 text-brand-teal' : ''}
            ${config.color === 'purple' ? 'bg-brand-purple/5 border-brand-purple/20 text-brand-purple' : ''}
            ${config.color === 'orange' ? 'bg-brand-coral/5 border-brand-coral/20 text-brand-coral' : ''}
          `}>
            {config.icon}
            {config.text}
          </div>
        );
      }
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderHeader: () => (
        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          <MdOutlineNumbers size={16} className="text-gray-400" />
          <span>Qty</span>
        </div>
      ),
      renderCell: (params) => (
        <span className="font-bold text-gray-700 dark:text-gray-300 ml-4">{params.value}</span>
      )
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderHeader: () => (
        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          <MdOutlinePayments size={16} className="text-brand-teal" />
          <span>Total Price</span>
        </div>
      ),
      renderCell: (params) => (
        <span className="font-bold text-gray-800 dark:text-white">{params.value}</span>
      )
    },
    {
      field: " ",
      flex: 0.5,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/dashboard/order/${params.id}`} className="flex justify-center w-full">
            <div className="p-2 rounded-full bg-gray-50 hover:bg-brand-teal/10 text-gray-400 hover:text-brand-teal transition-all duration-300">
              <AiOutlineEye size={20} />
            </div>
          </Link>
        );
      },
    },
  ];

  const row = [];

  orders && orders.forEach((item) => {
    if (!item) return;

    try {
      const cart = Array.isArray(item.cart) ? item.cart : [];

      // Calculate total quantity
      const itemsQty = cart.reduce((acc, curr) => {
        const qty = curr.qty || curr.quantity || 1;
        return acc + qty;
      }, 0);

      // Get order type
      let orderType = item.orderType || 'cart';
      if (!orderType || orderType === 'cart') {
        // Check if any item in cart is an auction item
        const hasAuctionItem = cart.some(cartItem =>
          cartItem.isAuctionItem ||
          (cartItem.item && cartItem.item.isAuctionItem) ||
          (cartItem.auctionItem) ||
          (cartItem.product && cartItem.product.isAuctionItem)
        );
        if (hasAuctionItem) {
          orderType = 'auction';
        }
      }

      row.push({
        id: item._id,
        itemsQty,
        total: "Rs " + item.totalPrice,
        status: item.status || 'Processing',
        orderType,
      });
    } catch (error) {
      console.error("Error processing order:", error, item);
    }
  });
  return (
    <div className="w-full p-8 bg-gray-50 dark:bg-gray-900">
      <h3 className="text-[28px] font-Poppins pb-4 text-brand-teal-dark dark:text-white font-bold">Dashboard Overview</h3>
      <div className="w-full block 800px:flex items-stretch justify-between gap-6">
        {/* Account Balance Card */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[150px] bg-gradient-to-br from-[#ffffff] to-[#eff6ff] border border-blue-100 shadow-xl rounded-2xl px-6 py-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2.5 rounded-full group-hover:bg-blue-200 transition-colors">
                <AiOutlineMoneyCollect
                  size={26}
                  className="text-blue-600"
                />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800 ml-3">
                Account Balance
              </h3>
            </div>
            <h5 className="text-[32px] font-extrabold text-gray-900 mb-1">Rs {availableBalance}</h5>
            <p className="text-[12px] text-gray-500 font-medium mb-4">(with 10% service charge)</p>
          </div>
          <Link to="/dashboard-withdraw-money">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 w-full text-sm flex items-center justify-center gap-2">
              Withdraw Money <AiOutlineArrowRight />
            </button>
          </Link>
        </div>

        {/* All Orders Card */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[150px] bg-gradient-to-br from-[#ffffff] to-[#f0fdf4] border border-green-100 shadow-xl rounded-2xl px-6 py-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2.5 rounded-full group-hover:bg-green-200 transition-colors">
                <MdBorderClear size={26} className="text-green-600" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800 ml-3">
                All Orders
              </h3>
            </div>
            <h5 className="text-[32px] font-extrabold text-gray-900 mb-4">{orders && orders.length}</h5>
          </div>
          <Link to="/dashboard-orders">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-green-200 transition-all duration-300 w-full text-sm flex items-center justify-center gap-2">
              View Orders <AiOutlineArrowRight />
            </button>
          </Link>
        </div>

        {/* All Products Card */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[150px] bg-gradient-to-br from-[#ffffff] to-[#faf5ff] border border-purple-100 shadow-xl rounded-2xl px-6 py-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2.5 rounded-full group-hover:bg-purple-200 transition-colors">
                <AiOutlineShopping
                  size={26}
                  className="text-purple-600"
                />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800 ml-3">
                All Products
              </h3>
            </div>
            <h5 className="text-[32px] font-extrabold text-gray-900 mb-4">{products && products.length}</h5>
          </div>
          <Link to="/dashboard-products">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-purple-200 transition-all duration-300 w-full text-sm flex items-center justify-center gap-2">
              View Products <AiOutlineArrowRight />
            </button>
          </Link>
        </div>
      </div>

      <br />

      {/* Sales Overview Chart */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 animate-fade-in mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div>
            <h4 className="text-[22px] font-Poppins font-bold text-gray-800 dark:text-white mb-1">Sales Overview</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-teal/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider">Live Revenue</span>
              </div>
              <p className="text-xs text-gray-400">Real-time selling performance & trends.</p>
            </div>
          </div>

          <div className="flex bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 w-fit">
            {["weekly", "monthly", "yearly"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-300 ${activeFilter === filter
                  ? "bg-white dark:bg-gray-800 text-brand-teal shadow-lg shadow-gray-200/50 dark:shadow-none translate-y-[-1px]"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 py-2 px-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Total</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Rs {chartData?.reduce((acc, curr) => acc + (curr.sales || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="w-full h-[380px] relative">
          {statsLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-brand-teal/20 border-b-brand-teal"></div>
                <p className="text-xs text-gray-400 font-medium animate-pulse">Fetching analytics...</p>
              </div>
            </div>
          ) : chartData?.every(d => d.sales === 0) ? (
            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-50 dark:border-gray-800 rounded-3xl">
              <div className="text-center">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-full w-fit mx-auto mb-4 border border-gray-100 dark:border-gray-800">
                  <RiAuctionLine className="text-gray-300 dark:text-gray-600" size={32} />
                </div>
                <h5 className="text-gray-500 dark:text-gray-400 font-bold text-lg">No Sales Data Yet</h5>
                <p className="text-gray-400 dark:text-gray-500 text-xs">Delivered orders will appear here automatically.</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0fb5c9" stopOpacity={0.4} />
                    <stop offset="30%" stopColor="#0fb5c9" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0fb5c9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f3f4f6" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(value) => `Rs ${value >= 1000 ? (value / 1000) + 'k' : value}`}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: '#0fb5c9', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[140px]">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
                          <div className="flex items-center justify-between gap-4 mt-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Revenue:</span>
                            <span className="text-sm font-bold text-brand-teal">Rs {payload[0].value.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-50 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-brand-teal"
                              style={{ width: `${Math.min((payload[0].value / Math.max(...chartData.map(d => d.sales || 1))) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#0fb5c9"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  animationBegin={300}
                  animationDuration={1800}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#0fb5c9' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[22px] font-Poppins text-gray-800 dark:text-white font-bold">Latest Orders</h3>
        <Link to="/dashboard-orders" className="flex items-center gap-1.5 text-brand-teal font-semibold hover:underline group">
          <span className="text-xs">View All Orders</span>
          <AiOutlineArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {row.length === 0 ? (
          <div className="w-full flex flex-col justify-center items-center py-20 px-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-4 border border-gray-100 dark:border-gray-800">
              <AiOutlineShopping className="text-gray-300 dark:text-gray-600" size={60} />
            </div>
            <h5 className="text-lg font-bold text-gray-500 dark:text-gray-400">No Orders Recieved</h5>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 max-w-[300px] text-center">
              Your recent sales transactions will appear here as soon as customers start purchasing.
            </p>
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
                fontSize: '13px',
                color: 'inherit',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHero;
