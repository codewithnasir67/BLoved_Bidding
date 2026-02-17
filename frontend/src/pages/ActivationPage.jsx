import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server, backend_url } from "../server";
import { toast } from "react-toastify";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);

  const addDebug = (message) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (activation_token) {
      const activateAccount = async () => {
        try {
          setLoading(true);
          addDebug("Starting activation...");
          addDebug(`Token: ${activation_token.substring(0, 20)}...`);
          addDebug(`Server URL: ${server}`);
          addDebug(`Backend URL: ${backend_url}`);
          addDebug(`Full URL: ${server}/user/activation`);

          addDebug("Making API request...");

          const response = await axios.post(
            `${server}/user/activation`,
            { activation_token },
            {
              withCredentials: true,
              timeout: 10000,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          addDebug("API request successful!");
          addDebug(`Response: ${JSON.stringify(response.data)}`);

          setSuccess(true);
          setError(false);
          toast.success("Account activated successfully!");

          setTimeout(() => {
            navigate("/");
          }, 2000);
        } catch (err) {
          addDebug(`ERROR: ${err.message}`);
          addDebug(`Error code: ${err.code}`);
          addDebug(`Error response: ${JSON.stringify(err.response?.data)}`);

          let message = "Activation failed. ";

          if (err.code === 'ECONNABORTED') {
            message += "Request timed out after 10 seconds.";
          } else if (err.response) {
            message += err.response.data?.message || `Server error: ${err.response.status}`;
          } else if (err.request) {
            message += "Cannot connect to server. Backend may not be running.";
          } else {
            message += err.message;
          }

          setError(true);
          setSuccess(false);
          setErrorMessage(message);
          toast.error(message);
        } finally {
          setLoading(false);
          addDebug("Activation process completed");
        }
      };

      activateAccount();
    }
  }, [activation_token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-teal via-brand-teal-dark to-brand-purple-dark p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-6">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-coral mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Activating Your Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Activation Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                {errorMessage}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/sign-up")}
                  className="bg-gradient-to-r from-brand-coral to-brand-coral-dark text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Sign Up Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Go Home
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Account Activated! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your account has been successfully activated.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Redirecting you to the home page...
              </p>
            </div>
          ) : null}
        </div>

        {/* Debug Console */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Debug Console:</h3>
          <div className="text-xs font-mono text-gray-600 dark:text-gray-400 space-y-1">
            {debugInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))}
            {debugInfo.length === 0 && <div>Waiting for activation...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
