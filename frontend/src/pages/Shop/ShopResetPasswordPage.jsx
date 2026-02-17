import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ShopResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post(
                `${server}/shop/reset-password`,
                { token, newPassword, confirmPassword },
                { withCredentials: true }
            )
            .then((res) => {
                toast.success(res.data.message);
                navigate("/shop-login");
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-teal/20 via-gray-50 to-brand-teal/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/20 blur-[100px] pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Reset Shop Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your new shop password below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 sm:rounded-3xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-bold text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="new-password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm"
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-brand-teal transition-colors"
                                        size={22}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-brand-teal transition-colors"
                                        size={22}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visibleConfirm ? "text" : "password"}
                                    name="confirm-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm"
                                />
                                {visibleConfirm ? (
                                    <AiOutlineEye
                                        className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-brand-teal transition-colors"
                                        size={22}
                                        onClick={() => setVisibleConfirm(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-brand-teal transition-colors"
                                        size={22}
                                        onClick={() => setVisibleConfirm(true)}
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShopResetPasswordPage;
