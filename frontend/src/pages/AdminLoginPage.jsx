import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const { isAdminAuthenticated, admin } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAdminAuthenticated === true) {
            navigate("/admin/dashboard");
        }
    }, [isAdminAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post(
                `${server}/user/admin-login`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            )
            .then((res) => {
                toast.success("Login Success!");
                navigate("/admin/dashboard");
                window.location.reload(true);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message || "Login failed");
            });
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    {/* Darker/Admin themed background shapes */}
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500 blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500 blur-[100px]"></div>
                </div>

                <div className="relative z-20 text-white p-16 max-w-xl text-center lg:text-left">
                    <h1 className="text-5xl font-extrabold mb-8 leading-tight drop-shadow-lg">
                        Admin <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Dashboard</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                        Manage the entire platform, monitor activities, and ensure smooth operations.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 xl:px-32 bg-white scroll-smooth">
                <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Admin Login</h2>
                    <p className="text-gray-500 text-lg">
                        Please log in to access the admin panel.
                    </p>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                                    Password
                                </label>
                            </div>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    placeholder="Enter your password"
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors"
                                        size={22}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors"
                                        size={22}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Login as Admin
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
