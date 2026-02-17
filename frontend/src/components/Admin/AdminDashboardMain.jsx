import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { MdBorderClear, MdTrendingUp } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();
  const [timeFrame, setTimeFrame] = useState("all");
  const [earningStats, setEarningStats] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  useEffect(() => {
    if (adminOrders) {
      calculateStats();
    }
  }, [adminOrders, timeFrame]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F'];

  const isWithinLastWeek = (date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const isWithinCurrentMonth = (date) => {
    const now = new Date();
    const orderDate = new Date(date);
    return orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear();
  };

  const getFilteredOrders = () => {
    if (!adminOrders) return [];

    switch (timeFrame) {
      case "weekly":
        return adminOrders.filter(order => isWithinLastWeek(order.createdAt));
      case "monthly":
        return adminOrders.filter(order => isWithinCurrentMonth(order.createdAt));
      default:
        return adminOrders;
    }
  };

  const calculateStats = () => {
    const filteredOrders = getFilteredOrders();

    // Calculate daily earnings for chart
    const dailyEarnings = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      dailyEarnings[date] = (dailyEarnings[date] || 0) + order.totalPrice * 0.10;
    });

    const earningChartData = Object.entries(dailyEarnings).map(([date, amount]) => ({
      date,
      earnings: Number(amount.toFixed(2))
    }));
    setEarningStats(earningChartData);

    // Calculate order status statistics
    const statusCount = {};
    filteredOrders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    const statusData = Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));
    setOrderStatusStats(statusData);

    // Calculate monthly sales
    const monthlyData = {};
    filteredOrders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + order.totalPrice;
    });

    const monthlySalesData = Object.entries(monthlyData).map(([month, sales]) => ({
      month,
      sales: Number(sales.toFixed(2))
    }));
    setMonthlySales(monthlySalesData);
  };

  const currentEarnings = getFilteredOrders().reduce((acc, item) => acc + item.totalPrice * 0.10, 0);
  const adminBalance = currentEarnings.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.value;
        let color = "bg-gray-200 text-gray-700";
        if (status === "Delivered") color = "bg-green-100 text-green-700";
        if (status === "Processing") color = "bg-blue-100 text-blue-700";
        if (status === "Refund Success") color = "bg-red-100 text-red-700";

        return (
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
            {status}
          </div>
        )
      },
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

  const row = [];
  getFilteredOrders().forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
      total: item?.totalPrice + " Rs",
      status: item?.status,
      createdAt: item?.createdAt.slice(0, 10),
    });
  });

  // Custom Card Component
  const StatCard = ({ title, value, icon, gradient, link, linkText }) => (
    <div className={`shadow-lg rounded-xl p-6 text-white relative overflow-hidden ${gradient}`}>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="font-medium text-white/80 mb-2">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {link && (
            <Link to={link} className="inline-block mt-4 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-lg transition-all">
              {linkText} <AiOutlineArrowUp className="inline ml-1 mb-0.5" />
            </Link>
          )}
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-md">
          {icon}
        </div>
      </div>
      {/* Decorative Circle */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-8 bg-gray-50 min-h-screen">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Overview</h3>
              <p className="text-sm text-gray-500 mt-1">Here is what's happening with your platform today.</p>
            </div>

            <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200 mt-4 md:mt-0">
              {["all", "weekly", "monthly"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${timeFrame === tf ? "bg-teal-500 text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {tf === 'all' ? 'All Time' : tf}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Earnings"
              value={`Rs ${adminBalance}`}
              icon={<AiOutlineMoneyCollect size={30} />}
              gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
            />
            <StatCard
              title="Verified Sellers"
              value={sellers?.length}
              icon={<MdBorderClear size={30} />}
              gradient="bg-gradient-to-br from-teal-400 to-emerald-600"
              link="/admin-sellers"
              linkText="View Details"
            />
            <StatCard
              title="Total Orders"
              value={row.length}
              icon={<BiTime size={30} />}
              gradient="bg-gradient-to-br from-pink-500 to-rose-600"
              link="/admin-orders"
              linkText="View Orders"
            />
          </div>

          {/* Earnings Chart */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <MdTrendingUp className="mr-2 text-teal-500" size={24} />
                Earnings Trend
              </h3>
            </div>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status and Monthly Sales Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Order Status Distribution</h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Monthly Sales</h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
                    />
                    <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {monthlySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Orders</h3>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick
                autoHeight
                className="!border-0 text-gray-600"
                headerClassName="!bg-gray-50 !text-gray-900 !font-semibold !uppercase !tracking-wider !border-b-2 !border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;