import React, { useState, useEffect } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { loadUser } from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";
import { RiLockPasswordLine, RiUser3Line, RiShieldUserLine } from "react-icons/ri";
import adminLogo from '../../assets/admin_logo.png'

const AdminProfileContent = () => {
    const { user, error, successMessage } = useSelector((state) => state.user);
    const [name, setName] = useState("Super Admin");
    const [email, setEmail] = useState(user && user.email);
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
    }, [error, successMessage, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Disabled for static Super Admin
        toast.info("Super Admin profile is static.");
    };

    const handleImage = async (e) => {
        // Disabled for static Super Admin
        toast.info("Super Admin logo is static.");
    };

    return (
        <div className="w-full flex justify-center bg-[#111827] min-h-screen pt-8 pb-12 px-4 sm:px-8">
            <div className="w-full max-w-5xl space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-gray-800">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative">
                                <img
                                    src={adminLogo}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#1f2937] shadow-2xl"
                                    alt="Admin Avatar"
                                />
                                {/* Camera icon removed as image is static */}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Super Admin
                            </h1>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mt-2">
                                <RiShieldUserLine size={14} />
                                Super Admin
                            </span>
                            <p className="text-gray-400 text-sm mt-3 max-w-xs">
                                Manage your personal details and security settings from here.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Details Card */}
                    <div className="bg-[#1f2937] rounded-3xl p-8 shadow-xl border border-gray-700/50 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gray-800 rounded-xl text-teal-400 shadow-inner">
                                <RiUser3Line size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Profile Details</h2>
                                <p className="text-sm text-gray-500">Update your public information</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    value="Super Admin"
                                    className="w-full bg-[#111827]/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        readOnly
                                        value={email}
                                        className="w-full bg-[#111827]/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                                    />
                                    <span className="absolute right-4 top-3.5 text-xs text-gray-500 flex items-center gap-1">
                                        <RiLockPasswordLine /> Read-only
                                    </span>
                                </div>
                            </div>


                        </form>
                    </div>

                    {/* Change Password Card */}
                    <ChangePassword />
                </div>
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
                `${server}/user/update-admin-password`,
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
        <div className="bg-[#1f2937] rounded-3xl p-8 shadow-xl border border-gray-700/50 backdrop-blur-sm relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gray-800 rounded-xl text-purple-400 shadow-inner">
                    <RiLockPasswordLine size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Security</h2>
                    <p className="text-sm text-gray-500">Ensure your account is secure</p>
                </div>
            </div>

            <form onSubmit={passwordChangeHandler} className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Password</label>
                    <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirm</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white border border-gray-600 hover:border-transparent font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/25"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default AdminProfileContent;
