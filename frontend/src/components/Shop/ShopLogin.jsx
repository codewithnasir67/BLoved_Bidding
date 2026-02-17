import { React, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const ShopLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${server}/shop/login-shop`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (data.success) {
        toast.success("Login Success!");
        dispatch({
          type: "LoadSellerSuccess",
          payload: data.seller,
        });
        localStorage.setItem("seller", JSON.stringify(data.seller));
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Visual & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-teal to-brand-teal-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white blur-[100px]"></div>
        </div>

        <div className="relative z-20 text-white p-12 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome Back Partner!</h1>
          <p className="text-xl text-teal-50 leading-relaxed mb-8">
            Manage your store, track your sales, and grow your business with our powerful seller tools.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
              <h3 className="font-bold text-lg">Real-time Stats</h3>
              <p className="text-sm opacity-80">Track performance instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
              <h3 className="font-bold text-lg">Secure Payments</h3>
              <p className="text-sm opacity-80">Safe and fast withdrawals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 xl:px-32 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Login to your shop
          </h2>
          <p className="text-gray-500 mb-10">
            Please enter your credentials to access your dashboard.
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all duration-200"
                  placeholder="name@store.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-brand-teal transition-colors"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-brand-teal transition-colors"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/shop-forgot-password"
                  className="font-medium text-brand-teal hover:text-brand-teal-dark transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-[48px] flex justify-center items-center py-2 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-gray-500">Don't have a shop?</span>
              <Link to="/shop-create" className="font-bold text-brand-teal hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;
