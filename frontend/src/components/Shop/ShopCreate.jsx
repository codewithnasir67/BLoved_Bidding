import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar, RxCamera } from "react-icons/rx";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!zipCode.trim()) {
      toast.error("Please enter a ZIP code");
      return;
    }

    // Convert phoneNumber and zipCode to numbers before sending
    const formData = {
      name,
      email,
      password,
      avatar,
      zipCode: Number(zipCode),
      address,
      phoneNumber: Number(phoneNumber),
    };

    axios
      .post(`${server}/shop/create-shop`, formData)
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar();
        setZipCode("");
        setAddress("");
        setPhoneNumber("");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Registration failed");
      });
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Join Our Seller Community
          </h2>
          <p className="text-gray-500">
            Create your shop today and start selling to millions of customers.
          </p>
        </div>

        <div className="bg-white py-10 px-6 shadow-xl sm:rounded-2xl sm:px-12 border border-gray-100">
          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative group cursor-pointer">
                <span className="inline-block h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-brand-teal transition-colors duration-300">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <RxAvatar size={60} />
                    </div>
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="absolute bottom-1 right-1 bg-brand-teal text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-brand-teal-dark transition-colors"
                >
                  <RxCamera size={18} />
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="mt-3 text-sm text-gray-500">Upload Shop Logo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Shop Name
                </label>
                <input
                  type="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all"
                  placeholder="My Awesome Store"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all"
                  placeholder="contact@store.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone-number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all"
                  placeholder="+92 300 1234567"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all"
                    placeholder="Create a strong password"
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

              {/* Address - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Shop Address
                </label>
                <input
                  type="address"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all"
                  placeholder="123 Market Street, City"
                />
              </div>

              {/* Zip Code - Half Width (but on its own row implicitly if needed, or we can make it full width if desired. Let's keep it in grid) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="number"
                  name="zipcode"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal sm:text-sm transition-all"
                  placeholder="Enter ZIP code"
                />
              </div>

            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="group relative w-full h-[50px] flex justify-center items-center py-2 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Register Shop
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h4 className="text-gray-600">Already have an account?</h4>
              <Link to="/shop-login" className="font-bold text-brand-teal hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
