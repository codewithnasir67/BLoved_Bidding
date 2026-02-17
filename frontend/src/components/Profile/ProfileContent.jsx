import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges, MdOutlineLocationOn } from "react-icons/md";
import { RxCross1, RxPerson } from "react-icons/rx";
import { HiOutlineShoppingBag, HiOutlineHome, HiOutlineInbox, HiOutlineTicket, HiOutlineReceiptRefund } from "react-icons/hi";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State, City } from "country-state-city";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { RiLockPasswordLine } from "react-icons/ri";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import UserInbox from "../../pages/UserInbox";
import MyBids from "../User/MyBids";
import UserRequestBids from "../User/UserRequestBids";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber));
  };

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full flex-1 p-0 h-full">
      {active === 1 && (
        <div className="max-w-4xl mx-auto animate-fadeIn space-y-12 h-full flex flex-col">
          <div className="flex justify-center w-full">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-teal to-brand-purple rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative">
                <img
                  src={`${user?.avatar?.url}`}
                  className="w-[160px] h-[160px] rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  alt=""
                />
                <div className="w-[44px] h-[44px] bg-gradient-to-r from-brand-teal to-brand-purple rounded-2xl flex items-center justify-center cursor-pointer absolute bottom-2 right-2 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300">
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={handleImage}
                  />
                  <label htmlFor="image" className="cursor-pointer flex items-center justify-center w-full h-full">
                    <AiOutlineCamera className="text-white" size={22} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white dark:border-gray-700 flex-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                <RxPerson size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Personal Details</h2>
                <p className="text-sm text-gray-500 mt-1.5 font-medium">Update your account information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-6 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    readOnly
                    value={email}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-gray-400 dark:text-gray-500 outline-none cursor-not-allowed font-medium transition-all"
                    placeholder="john@example.com"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 ml-1 flex items-center gap-1">
                    <RiLockPasswordLine size={10} />
                    Email address cannot be changed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-6 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-brand-teal to-brand-purple text-white font-bold rounded-2xl shadow-lg shadow-brand-teal/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* order */}
      {active === 2 && (
        <div className="animate-fadeIn space-y-8">
          <AllOrders />
        </div>
      )}

      {/* Inbox */}
      {active === 4 && (
        <div className="animate-fadeIn space-y-8">
          <UserInbox isProfile={true} />
        </div>
      )}

      {/* My Bids */}
      {active === 9 && (
        <div className="animate-fadeIn space-y-8">
          <MyBids isProfile={true} />
        </div>
      )}

      {/* My Requests */}
      {active === 10 && (
        <div className="animate-fadeIn space-y-8">
          <UserRequestBids isProfile={true} />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div className="animate-fadeIn space-y-8">
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div className="animate-fadeIn space-y-8">
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div className="animate-fadeIn space-y-8">
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div className="animate-fadeIn space-y-10">
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => (
        <span className="font-medium text-gray-900 dark:text-gray-100 italic">{params.id.substring(0, 10)}...</span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.getValue(params.id, "status");
        let bgColor = "bg-gray-100 text-gray-800";
        let dotColor = "bg-gray-400";

        if (status === "Delivered") {
          bgColor = "bg-teal-50 text-brand-teal border border-brand-teal/20";
          dotColor = "bg-brand-teal";
        } else if (status === "Processing" || status === "Shipping") {
          bgColor = "bg-amber-50 text-amber-600 border border-amber-200";
          dotColor = "bg-amber-500 animate-pulse";
        } else if (status === "Cancelled") {
          bgColor = "bg-red-50 text-red-600 border border-red-200";
          dotColor = "bg-red-500";
        }

        return (
          <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${bgColor}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
          </div>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      minWidth: 100,
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "total",
      headerName: "Total Amount",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <span className="font-bold text-gray-900 dark:text-brand-teal-light">
          {params.getValue(params.id, "total")}
        </span>
      )
    },
    {
      field: "details",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <div className="p-2 hover:bg-brand-teal/10 rounded-xl transition-colors text-brand-teal group">
            <AiOutlineArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ),
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "Rs " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white dark:border-gray-700 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
          <HiOutlineShoppingBag size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Order History</h3>
          <p className="text-xs text-gray-500 mt-1">Manage and track your recent orders</p>
        </div>
      </div>
      <div className="h-[500px] w-full custom-datagrid">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight={false}
          className="border-none text-gray-800 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => (
        <span className="font-medium text-gray-900 dark:text-gray-100 italic">{params.id.substring(0, 10)}...</span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.getValue(params.id, "status");
        return (
          <div className="px-3 py-1 rounded-full flex items-center gap-2 bg-amber-50 text-amber-600 border border-amber-200">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
          </div>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      minWidth: 100,
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "total",
      headerName: "Total Amount",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <span className="font-bold text-gray-900 dark:text-brand-teal-light">
          {params.getValue(params.id, "total")}
        </span>
      )
    },
    {
      field: "details",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <div className="p-2 hover:bg-brand-teal/10 rounded-xl transition-colors text-brand-teal group">
            <AiOutlineArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ),
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "Rs " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white dark:border-gray-700 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
          <HiOutlineReceiptRefund size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Refund Orders</h3>
          <p className="text-xs text-gray-500 mt-1">Check the status of your refund requests</p>
        </div>
      </div>
      <div className="h-[500px] w-full custom-datagrid">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight={false}
          className="border-none text-gray-800 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => (
        <span className="font-medium text-gray-900 dark:text-gray-100 italic">{params.id.substring(0, 10)}...</span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.getValue(params.id, "status");
        return (
          <div className="px-3 py-1 rounded-full flex items-center gap-2 bg-brand-teal/5 text-brand-teal border border-brand-teal/20">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
          </div>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      minWidth: 100,
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "total",
      headerName: "Total Amount",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <span className="font-bold text-gray-900 dark:text-brand-teal-light">
          {params.getValue(params.id, "total")}
        </span>
      )
    },
    {
      field: "details",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <div className="p-2 hover:bg-brand-teal/10 rounded-xl transition-colors text-brand-teal group">
            <MdTrackChanges size={20} className="group-hover:rotate-12 transition-transform" />
          </div>
        </Link>
      ),
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "Rs " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white dark:border-gray-700 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
          <MdTrackChanges size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Track Orders</h3>
          <p className="text-xs text-gray-500 mt-1">Live updates on your delivery status</p>
        </div>
      </div>
      <div className="h-[500px] w-full custom-datagrid">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight={false}
          className="border-none text-gray-800 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white dark:border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
            <RiLockPasswordLine size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Security</h2>
            <p className="text-sm text-gray-500 mt-1.5 font-medium">Update your password to stay secure</p>
          </div>
        </div>

        <form onSubmit={passwordChangeHandler} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
            <input
              type="password"
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-6 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all font-medium"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <input
                type="password"
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-6 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all font-medium"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 px-6 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all font-medium"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-brand-teal to-brand-purple text-white font-bold rounded-2xl shadow-lg shadow-brand-purple/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || province === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updatUserAddress(
          "Pakistan",
          city,
          address1,
          address2,
          zipCode,
          addressType,
          province
        )
      );
      setOpen(false);
      setProvince("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full animate-fadeIn">
      {open && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl relative overflow-hidden animate-zoomIn">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal to-brand-purple" />
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Add New Address</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <RxCross1 size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Province</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-teal/20"
                    >
                      <option value="">Select Province</option>
                      {State && State.getStatesOfCountry("PK").map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-teal/20"
                    >
                      <option value="">Select City</option>
                      {province && City && City.getCitiesOfState("PK", province).map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="House #, Street name"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-teal/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Zip Code</label>
                    <input
                      type="number"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-teal/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type</label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-teal/20"
                    >
                      <option value="">Select Type</option>
                      {addressTypeData.map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand-teal text-white font-bold rounded-xl shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark transition-all mt-4"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
            <MdOutlineLocationOn size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Saved Addresses</h3>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-2.5 bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white font-bold rounded-xl transition-all"
        >
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {user?.addresses?.map((item, index) => (
          <div key={index} className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-brand-teal">
                  {item.addressType === "Home" ? <HiOutlineHome size={20} /> : <MdOutlineLocationOn size={20} />}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">{item.addressType}</h4>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                <AiOutlineDelete size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.address1}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">{item.city}, {item.state || item.country}</span>
                <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">{item.zipCode}</span>
              </div>
            </div>
          </div>
        ))}

        {user?.addresses?.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <MdOutlineLocationOn size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No saved addresses found</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfileContent;
