import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import LiveAuctions from "../components/Products/LiveAuctions";

const LiveAuctionsPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <LiveAuctions />
      <Footer />
    </div>
  );
};

export default LiveAuctionsPage;
