import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../static/data";
import { toast } from "react-toastify";
import { createRequest } from "../redux/actions/product";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import {
    RiAuctionLine,
    RiMoneyDollarCircleLine,
    RiTimeLine,
    RiPriceTag3Line,
    RiFileTextLine,
    RiSmartphoneLine,
    RiLayoutGridLine
} from "react-icons/ri";

const CreateRequestPage = () => {
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { success, error, loading } = useSelector((state) => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [images, setImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [startingPrice, setStartingPrice] = useState("");
    const [incrementValue, setIncrementValue] = useState("");
    const [auctionEndTime, setAuctionEndTime] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (success) {
            toast.success("Request created successfully!");
            navigate("/auctions");
            dispatch({ type: "productCreateReset" });
        }
    }, [dispatch, error, success, navigate]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImageFiles(files); // Store files for submission
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

    const handleEndDateChange = (e) => {
        const endDate = new Date(e.target.value);
        setAuctionEndTime(endDate);
    };

    const today = new Date().toISOString().slice(0, 16);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        const newForm = new FormData();
        imageFiles.forEach((image) => {
            newForm.append("images", image);
        });
        newForm.append("name", name);
        newForm.append("description", description);
        newForm.append("category", category);
        newForm.append("tags", tags);
        newForm.append("startingPrice", startingPrice);
        newForm.append("incrementValue", incrementValue);
        newForm.append("auctionEndTime", auctionEndTime.toISOString());

        dispatch(createRequest(newForm));
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Header activeHeading={5} />
            <div className="w-full justify-center flex py-10 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-brand-teal p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold font-Poppins mb-2">Create Auction Request</h2>
                            <p className="text-teal-100 max-w-xl mx-auto">Post what you're looking for and let sellers bid to offer you the best deal.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <RiSmartphoneLine className="text-brand-teal" /> Request Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all outline-none"
                                        placeholder="e.g. Wanted: iPhone 15 Pro Max"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <RiLayoutGridLine className="text-brand-teal" /> Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all outline-none"
                                        required
                                    >
                                        <option value="">Choose a category</option>
                                        {categoriesData && categoriesData.map((i) => (
                                            <option value={i.title} key={i.title}>{i.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <RiFileTextLine className="text-brand-teal" /> Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows="5"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all outline-none resize-none"
                                    placeholder="Describe specifically what you are looking for..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Pricing & Timing Section */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <RiAuctionLine className="text-brand-teal" /> Auction Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Budget / Starting Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-400 font-bold">Rs</span>
                                        <input
                                            type="number"
                                            value={startingPrice}
                                            onChange={(e) => setStartingPrice(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none font-bold"
                                            placeholder="00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Min Price Decrement</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-400 font-bold">Rs</span>
                                        <input
                                            type="number"
                                            value={incrementValue}
                                            onChange={(e) => setIncrementValue(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none font-bold"
                                            placeholder="00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">End Date (Dealine)</label>
                                    <input
                                        type="datetime-local"
                                        value={auctionEndTime ? auctionEndTime.toISOString().slice(0, 16) : ""}
                                        onChange={handleEndDateChange}
                                        min={today}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <RiPriceTag3Line className="text-brand-teal" /> Tags
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all outline-none"
                                placeholder="Enter relevant tags separated by commas..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                                Reference Images <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <label htmlFor="upload" className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-brand-teal rounded-xl cursor-pointer bg-gray-50 hover:bg-brand-teal/5 transition-all group">
                                    <AiOutlineCloudUpload size={30} className="text-gray-400 group-hover:text-brand-teal transition-colors" />
                                    <span className="text-xs font-bold text-gray-400 mt-2 group-hover:text-brand-teal">Upload</span>
                                </label>
                                <input
                                    type="file"
                                    name=""
                                    id="upload"
                                    className="hidden"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                {images && images.map((i, index) => (
                                    <div key={index} className="aspect-square relative rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                        <img src={i} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <input
                                type="submit"
                                value={loading ? "Publishing Request..." : "Create Request"}
                                className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-4 rounded-xl cursor-pointer shadow-lg hover:shadow-brand-teal/30 transition-all duration-300 transform active:scale-[0.99]"
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateRequestPage;
