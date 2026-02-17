import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RxAvatar, RxCamera } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Singup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please use a valid Gmail address.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 6 characters long, contain one uppercase letter, one symbol, and one number."
      );
      return;
    }

    try {
      const response = await axios.post(`${server}/user/create-user`, {
        name,
        email,
        password,
        avatar,
      });

      toast.success(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-teal to-brand-teal-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-200 blur-[100px]"></div>
        </div>

        <div className="relative z-20 text-white p-16 max-w-xl">
          <h2 className="text-lg uppercase tracking-widest font-semibold mb-4 text-teal-50">Start Your Journey</h2>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Join the <br />
            Premier Bidding <br />
            Community
          </h1>
          <p className="text-lg text-teal-50 leading-relaxed mb-10">
            Unlock exclusive access to premium auctions, personalized watchlists, and secure transaction features.
          </p>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-teal-dark bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 bg-gradient-to-br from-gray-100 to-gray-300">
                U{i}
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-2 border-brand-teal-dark bg-brand-teal flex items-center justify-center text-xs font-bold text-white">
              +20k
            </div>
          </div>
          <p className="mt-4 text-sm text-teal-100">Join over 20,000 satisfied users today.</p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 xl:px-32 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-teal mb-6 transition-colors">
            <span>←</span> Back to Home
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500">
            Fill in the details below to get started with your account.
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group cursor-pointer">
                <span className="inline-block h-24 w-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-lg group-hover:border-indigo-100 transition-colors duration-300">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <RxAvatar size={50} />
                    </div>
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="absolute bottom-0 right-0 bg-brand-teal text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-brand-teal-dark transition-colors transform group-hover:scale-105"
                >
                  <RxCamera size={16} />
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    onChange={handleFileInputChange}
                    className="sr-only"
                    accept=".jpg,.jpeg,.png"
                  />
                </label>
              </div>
              <span className="mt-2 text-xs font-medium text-gray-500">Upload Profile Picture</span>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm"
                placeholder="you@gmail.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-5 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm"
                  placeholder="Min 6 chars, 1 uppercase, 1 symbol"
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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-base text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-brand-teal hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Singup;
