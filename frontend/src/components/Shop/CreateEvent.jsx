import React, { useEffect, useState } from "react";
import {
  AiOutlinePlusCircle,
  AiOutlineCloudUpload,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineTag,
  AiOutlineDollarCircle,
  AiOutlineClockCircle,
  AiOutlineArrowLeft
} from "react-icons/ai";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineInventory2, MdOutlineDescription } from "react-icons/md";
import { FiCalendar, FiBox } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    setStartDate(startDate);
    setEndDate(null);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
    : today;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
      dispatch({ type: "eventCreateReset" });
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || category === "Choose a category") {
      return toast.error("Please choose a category!");
    }
    if (images.length === 0) {
      return toast.error("Please upload at least one image!");
    }

    const data = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      shopId: seller._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    };
    dispatch(createevent(data));
  };

  return (
    <div className="w-full flex justify-center py-8 bg-[#f8fafc] dark:bg-gray-900 min-h-screen">
      <div className="w-[95%] md:w-[80%] lg:w-[60%] xl:w-[50%] bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 animate-fade-in dashboard-card-border">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
          <div
            onClick={() => navigate(-1)}
            className="p-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-800 rounded-full cursor-pointer text-gray-600 dark:text-gray-400 hover:text-brand-teal"
            title="Go Back"
          >
            <AiOutlineArrowLeft size={24} />
          </div>
          <div className="p-3 bg-brand-teal/10 rounded-2xl text-brand-teal">
            <AiOutlinePlusCircle size={32} />
          </div>
          <div>
            <h3 className="text-[28px] font-Poppins font-bold text-gray-800 dark:text-white">Create New Event</h3>
            <p className="text-gray-500 text-sm">Set up a promotional event for your products</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-brand-teal font-bold text-sm uppercase tracking-wider mb-2">
              <AiOutlineInfoCircle size={18} />
              <span>Basic Information</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-teal transition-colors">
                    <FiBox size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Premium Sports Shoes"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-brand-teal transition-colors">
                    <MdOutlineDescription size={20} />
                  </div>
                  <textarea
                    cols="30"
                    required
                    rows="5"
                    value={description}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium resize-none"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell customers what makes this event special..."
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium cursor-pointer appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Choose a category">Choose a category</option>
                    {categoriesData &&
                      categoriesData.map((i) => (
                        <option value={i.title} key={i.title}>
                          {i.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-teal transition-colors">
                      <AiOutlineTag size={18} />
                    </div>
                    <input
                      type="text"
                      value={tags}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium"
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Summer, Clearance, Tech..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 text-brand-teal font-bold text-sm uppercase tracking-wider mb-2">
              <MdOutlineInventory2 size={18} />
              <span>Pricing & Inventory</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Original Price</label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-teal transition-colors font-bold text-xs">Rs</div>
                  <input
                    type="number"
                    value={originalPrice}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium"
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Sale Price <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-teal font-bold text-xs italic">OFF</div>
                  <input
                    type="number"
                    required
                    value={discountPrice}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-teal/30 dark:border-brand-teal/20 bg-brand-teal/5 dark:bg-brand-teal/10 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-brand-teal font-bold"
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-teal transition-colors">
                    <AiOutlineDollarCircle size={18} />
                  </div>
                  <input
                    type="number"
                    required
                    value={stock}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium"
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Schedule */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 text-brand-teal font-bold text-sm uppercase tracking-wider mb-2">
              <AiOutlineClockCircle size={18} />
              <span>Event Schedule</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-teal transition-colors">
                    <FiCalendar size={18} />
                  </div>
                  <input
                    type="date"
                    required
                    value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                    min={today}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium cursor-pointer"
                    onChange={handleStartDateChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-teal transition-colors">
                    <FiCalendar size={18} />
                  </div>
                  <input
                    type="date"
                    required
                    value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                    min={minEndDate}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-gray-800 dark:text-white font-medium cursor-pointer"
                    onChange={handleEndDateChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Media */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 text-brand-teal font-bold text-sm uppercase tracking-wider mb-2">
              <HiOutlinePhotograph size={18} />
              <span>Product Media</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="w-full">
                <input
                  type="file"
                  id="upload"
                  className="hidden"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="flex flex-wrap gap-4">
                  <label
                    htmlFor="upload"
                    className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-brand-teal hover:bg-brand-teal/5 transition-all duration-300 bg-gray-50 dark:bg-gray-800/50 group"
                  >
                    <AiOutlineCloudUpload size={40} className="text-gray-400 group-hover:text-brand-teal transition-colors" />
                    <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">Add Photo</span>
                  </label>

                  {images && images.map((img, index) => (
                    <div key={index} className="relative group animate-scale-in">
                      <img
                        src={img}
                        alt=""
                        className="h-32 w-32 object-cover rounded-2xl shadow-md border border-gray-100 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <AiOutlineCloseCircle size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 italic font-medium">Click the upload icon to add one or more high-quality product images.</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-teal/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-lg"
            >
              <AiOutlinePlusCircle size={24} />
              Create Event
            </button>
            <p className="text-center text-gray-400 text-xs mt-4">By creating this event, you agree to ensure the product quality and availability during the specified period.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

