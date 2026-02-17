import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/user/login-user`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login Success!");
        navigate("/");
        window.location.reload(true);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message || "Login failed");
      });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-teal to-brand-teal-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-400 blur-[100px]"></div>
        </div>

        <div className="relative z-20 text-white p-16 max-w-xl text-center lg:text-left">
          <h1 className="text-5xl font-extrabold mb-8 leading-tight drop-shadow-lg">
            Discover Unique <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-50 to-teal-100">Treasures</span>
          </h1>
          <p className="text-xl text-teal-50 mb-12 leading-relaxed">
            Join our community of bidders and sellers. Find exclusive items, place your bids, and win big!
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:bg-white/20 transition-all">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="font-bold text-lg">Rare Finds</h3>
              <p className="text-sm opacity-80">Curated exclusive items</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:bg-white/20 transition-all">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-bold text-lg">Secure Bidding</h3>
              <p className="text-sm opacity-80">Verified protections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 xl:px-32 bg-white scroll-smooth">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-teal mb-8 transition-colors">
            <span>←</span> Back to Home
          </Link>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-lg">
            Log in to manage your bids and watchlist.
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
                  className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-brand-teal hover:text-brand-teal-dark">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm"
                  placeholder="Enter your password"
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
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-base text-gray-600">
              Don't have an account?{" "}
              <Link to="/sign-up" className="font-bold text-brand-teal hover:underline">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
