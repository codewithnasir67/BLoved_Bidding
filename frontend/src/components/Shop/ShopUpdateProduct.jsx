import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";

const ShopUpdateProduct = () => {
    const { seller } = useSelector((state) => state.seller);
    const { success, error } = useSelector((state) => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [originalPrice, setOriginalPrice] = useState();
    const [discountPrice, setDiscountPrice] = useState();
    const [stock, setStock] = useState();
    const [isAuction, setIsAuction] = useState(false);
    const [startingPrice, setStartingPrice] = useState("");
    const [biddingDuration, setBiddingDuration] = useState(24);
    const [incrementValue, setIncrementValue] = useState(100);
    const [buyNowPrice, setBuyNowPrice] = useState("");
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${server}/product/get-product/${id}`);
                const product = data.product;

                setName(product.name);
                setDescription(product.description);
                setCategory(product.category);
                setTags(product.tags || "");
                setOriginalPrice(product.originalPrice);
                setDiscountPrice(product.discountPrice);
                setStock(product.stock);
                setOldImages(product.images);
                setIsAuction(product.isAuction);

                if (product.isAuction) {
                    setStartingPrice(product.startingPrice);
                    setIncrementValue(product.incrementValue);
                    setBuyNowPrice(product.buyNowPrice || "");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Product not found");
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (success) {
            toast.success("Product updated successfully!");
            navigate("/dashboard-products");
            dispatch({ type: "productUpdateReset" });
        }
    }, [dispatch, error, success, navigate]);

    // Function to compress image
    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Max dimensions
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        }));
                    }, 'image/jpeg', 0.7); // 0.7 quality
                };
            };
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // We could add compression here too if needed, similar to create product
    };

    const removeImage = (index) => {
        // Logic for removing from `images` state (newly uploaded ones)
        // If we wanted to remove existing images, we'd need separate logic or unified state.
        // For now, this only removes PENDING images.
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newForm = new FormData();

        newForm.append("name", name);
        newForm.append("description", description);
        newForm.append("category", category);
        newForm.append("discountPrice", discountPrice);
        newForm.append("stock", stock);

        if (tags) newForm.append("tags", tags);
        if (originalPrice) newForm.append("originalPrice", originalPrice);

        if (images.length > 0) {
            images.forEach((image) => {
                newForm.append("images", image);
            });
        }

        if (isAuction) {
            newForm.append("isAuction", isAuction);
            if (startingPrice) newForm.append("startingPrice", startingPrice);
            if (incrementValue) newForm.append("incrementValue", incrementValue);
            if (buyNowPrice) newForm.append("buyNowPrice", buyNowPrice);

            // Explicitly NOT sending auctionEndTime to prevent unintended extension/reset.
            // If user really wants to extend, we might add a specific UI for it later.
        }

        dispatch(updateProduct(id, newForm));
    };

    const renderImagePreviews = () => {
        // If user has selected new images, show them
        if (images && images.length > 0) {
            return (
                <div className="flex flex-wrap gap-4 mt-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`preview ${index}`}
                                className="h-24 w-24 object-cover rounded-lg shadow-md border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        // Otherwise fallback to showing old images
        if (oldImages && oldImages.length > 0) {
            return (
                <div className="flex flex-wrap gap-4 mt-4">
                    {oldImages.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.url}
                                alt={`preview ${index}`}
                                className="h-24 w-24 object-cover rounded-lg shadow-md border border-gray-200 opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg pointer-events-none">
                                <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">Current Image</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 font-Poppins">
                        Update Product
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Edit the details of your product below.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    <div className="space-y-6">

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-Roboto">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition duration-200 shadow-sm sm:text-sm"
                                    placeholder="e.g. Vintage Leather Jacket"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 font-Roboto">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="5"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition duration-200 shadow-sm sm:text-sm"
                                    placeholder="Detailed description of your product..."
                                />
                            </div>
                        </div>

                        {/* Category & Tags Grid */}
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 font-Roboto">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent sm:text-sm"
                                    >
                                        <option value="">Select Category</option>
                                        {categoriesData && categoriesData.map((i) => (
                                            <option value={i.title} key={i.title}>{i.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 font-Roboto">
                                    Tags
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="tags"
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition duration-200 shadow-sm sm:text-sm"
                                        placeholder="fashion, summer, sale"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Grid */}
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                            <div>
                                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 font-Roboto">
                                    Original Price
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">Rs</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        id="originalPrice"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent sm:text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 font-Roboto">
                                    Sale Price <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">Rs</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="discountPrice"
                                        id="discountPrice"
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent sm:text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 font-Roboto">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="stock"
                                        id="stock"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition duration-200 shadow-sm sm:text-sm"
                                        placeholder="Available quantity"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Auction Toggle */}
                        {/* Note: Disabling toggle editing for existing products to prevent corruption, or allow? */}
                        {/* If we allow changing from auction to fixed, we need to handle clearing fields. */}
                        {/* For now, let's allow it, similar to Create Product */}
                        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
                            <div className="flex items-center">
                                <input
                                    id="isAuction"
                                    name="isAuction"
                                    type="checkbox"
                                    checked={isAuction}
                                    onChange={(e) => setIsAuction(e.target.checked)}
                                    className="h-5 w-5 text-brand-teal focus:ring-brand-teal border-gray-300 rounded transition duration-150 ease-in-out cursor-pointer"
                                />
                                <label htmlFor="isAuction" className="ml-3 block text-sm font-semibold text-gray-700 font-Poppins cursor-pointer select-none">
                                    Sell as Auction Item
                                </label>
                            </div>
                            {isAuction && <span className="text-xs text-brand-coral font-medium animate-pulse">Auction Mode Enabled</span>}
                        </div>

                        {/* Auction Fields */}
                        {isAuction && (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6 transition-all duration-300 ease-in-out">
                                <h3 className="text-md font-semibold text-gray-800 font-Poppins">Auction Settings</h3>

                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Starting Bid <span className="text-red-500">*</span></label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rs</span>
                                            <input
                                                type="number"
                                                value={startingPrice}
                                                onChange={(e) => setStartingPrice(e.target.value)}
                                                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Min Increment <span className="text-red-500">*</span></label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rs</span>
                                            <input
                                                type="number"
                                                value={incrementValue}
                                                onChange={(e) => setIncrementValue(e.target.value)}
                                                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {/* Duration disallowed for updates to prevent accidental resets 
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration <span className="text-red-500">*</span></label>
                                <select ... disabled? ... />
                            </div>
                         */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Buy Now Price (Optional)</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rs</span>
                                            <input
                                                type="number"
                                                value={buyNowPrice}
                                                onChange={(e) => setBuyNowPrice(e.target.value)}
                                                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-Roboto mb-2">
                                Product Images <span className="text-brand-coral text-xs ml-2">(Selecting new images replaces all existing ones)</span>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-teal transition-colors duration-300 bg-gray-50 hover:bg-white">
                                <div className="space-y-1 text-center">
                                    <AiOutlinePlusCircle size={48} className="mx-auto text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-teal hover:text-brand-teal-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-teal">
                                            <span className="px-2">Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            </div>
                            {imageLoading && <p className="text-sm text-brand-teal mt-2 animate-pulse">Processing images...</p>}
                            {renderImagePreviews()}
                        </div>

                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal transition duration-300 transform active:scale-95"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopUpdateProduct;
