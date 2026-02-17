
//Correct code but error in placing and fatch bid

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { toast } from "react-toastify";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const BidPage = () => {
  const { id } = useParams(); // Get product ID from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState("");
  const [highestBid, setHighestBid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Get user from Redux store
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Fetch product if not available in location state
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!product && id) {
          const response = await axios.get(`${server}/product/${id}`);
          setProduct(response.data.product);
        }
        setPageLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details");
        navigate("/");
      }
    };

    fetchProduct();
  }, [id, product, navigate]);

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      if (!product?._id) return;

      try {
        const response = await axios.get(`${server}/bid/product-bids/${product._id}`);
        setBids(response.data.bids || []);
        if (response.data.bids?.length > 0) {
          const maxBid = Math.max(...response.data.bids.map((bid) => bid.bidAmount));
          setHighestBid(maxBid);
        } else {
          setHighestBid(product.basePrice);
        }
      } catch (error) {
        console.error("Failed to fetch bids:", error);
        toast.error("Failed to load bids");
      }
    };

    if (product) {
      fetchBids();
    }
  }, [product]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to place a bid");
      navigate("/login");
      return;
    }

    const bidAmount = parseInt(newBid);
    if (!bidAmount || bidAmount <= highestBid) {
      toast.error(`Your bid must be higher than ${highestBid} Rs`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${server}/bids`,
        {
          productId: product._id,
          bidAmount: bidAmount,
        },
        { withCredentials: true }
      );

      toast.success("Bid placed successfully!");
      setNewBid("");
      // Refresh bids after placing new bid
      const bidResponse = await axios.get(`${server}/bids/product-bids/${product._id}`);
      setBids(bidResponse.data.bids || []);
      if (bidResponse.data.bids?.length > 0) {
        setHighestBid(Math.max(...bidResponse.data.bids.map((bid) => bid.bidAmount)));
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error(error.response?.data?.message || "Error placing bid");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl text-gray-600">Product not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-center md:items-start p-5 space-x-0 md:space-x-5 max-w-4xl w-full bg-white rounded-lg shadow-lg">
          {/* Product Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src={product.images?.[0]?.url || "/placeholder-image.jpg"} 
              alt={product.name} 
              className="w-80 h-80 object-cover rounded-lg shadow-md border" 
            />
          </div>

          {/* Bid Section */}
          <div className="w-full md:w-1/2 p-5 border rounded-lg shadow-md bg-gray-50">
            <h2 className="text-2xl font-bold text-center text-gray-800">{product.name}</h2>
            
            {/* Base Price */}
            <p className="text-lg text-gray-600 text-center mt-2">
              Base Price: <span className="font-semibold text-green-600">Rs. {product.basePrice}</span>
            </p>
            
            {/* Current Highest Bid */}
            <p className="text-lg text-gray-600 text-center mt-2">
              Current Highest Bid: <span className="font-semibold text-blue-600">Rs. {highestBid}</span>
            </p>

            {/* Bid Form */}
            <form onSubmit={handleBidSubmit} className="mt-4">
              <input
                type="number"
                placeholder="Enter your bid amount"
                value={newBid}
                onChange={(e) => setNewBid(e.target.value)}
                className="border p-2 rounded w-full mt-3 focus:ring-2 focus:ring-blue-400"
                min={highestBid + 1}
                disabled={loading || !isAuthenticated}
              />
              <button 
                type="submit"
                disabled={loading || !isAuthenticated}
                className={`${
                  loading || !isAuthenticated
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white p-2 rounded w-full mt-3 transition duration-300`}
              >
                {loading ? "Placing Bid..." : "Submit Bid"}
              </button>
            </form>

            {/* Login Message */}
            {!isAuthenticated && (
              <p className="text-red-500 text-sm text-center mt-2">
                Please login to place a bid
              </p>
            )}

            {/* Bid History */}
            <h3 className="mt-5 text-xl font-semibold text-center text-gray-800">Bid History</h3>
            <div className="mt-2 max-h-60 overflow-y-auto">
              {bids && bids.length > 0 ? (
                <ul className="space-y-2">
                  {bids.map((bid) => (
                    <li key={bid._id} className="bg-gray-200 p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Rs. {bid.bidAmount}</span>
                        <span className="text-sm text-gray-600">
                          by {bid.buyer?.name || "Anonymous"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(bid.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No bids yet. Be the first to bid!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BidPage;
