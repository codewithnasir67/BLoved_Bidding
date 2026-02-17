import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../server";

const BidForm = ({ productId, bidderId }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!bidderId) {
      toast.error("Please login to place a bid");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (!bidValue || isNaN(bidValue)) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    try {
      setIsLoading(true);
      // Submit the bid using the backend API
      const response = await axios.post(`${server}/bids/submit`, {
        productId: productId,
        bidAmount: bidValue,
        bidderId: bidderId,
      });

      toast.success(response.data.message || "Bid placed successfully!");
      setBidAmount("");
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while placing the bid"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Place a Bid</h3>
      <form onSubmit={handleBidSubmit}>
        <input
          type="number"
          placeholder="Enter your bid amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 mb-4"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`w-full p-3 rounded-lg text-white font-semibold transition duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Place Bid"}
        </button>
      </form>
    </div>
  );
};

export default BidForm;
