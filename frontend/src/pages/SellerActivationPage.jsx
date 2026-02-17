import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const response = await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          console.log(response);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setError(true);
          setErrorMessage(err.response?.data?.message || "An error occurred during activation");
          setLoading(false);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Activating your shop...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 20px",
        textAlign: "center",
      }}
    >
      {error ? (
        <>
          <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
          <a 
            href="/shop-create" 
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              marginTop: "10px"
            }}
          >
            Try Signing Up Again
          </a>
        </>
      ) : (
        <>
          <p style={{ color: "green", marginBottom: "10px" }}>Your shop has been created successfully!</p>
          <a 
            href="/shop-login" 
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              marginTop: "10px"
            }}
          >
            Login to Your Shop
          </a>
        </>
      )}
    </div>
  );
};

export default SellerActivationPage;