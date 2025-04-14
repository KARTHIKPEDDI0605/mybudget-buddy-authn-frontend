import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VerifyOtp.css"; // Import your CSS file for styling


const VerifyOtp = () => {
  const { userId } = useParams(); // Extract userId (can be customerId or clientId) from the URL
  const location = useLocation(); // Get the current route to determine if it's for a customer or client
  const [otp, setOtp] = useState(new Array(6).fill("")); // Array to store each digit of the OTP
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]); // References for each input box

  // Determine if the user is a customer or client based on the route
  const isCustomer = location.pathname.includes("customer");

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Allow only numeric input
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input box if available
      if (index < 5 && value) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = ""; // Clear the current box
      setOtp(newOtp);

      // Move to the previous input box if available
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join(""); // Combine the OTP digits into a single string
    if (otpValue.length !== 6) {
      toast.error("Please enter a 6-digit OTP.", { position: "top-right" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine the API endpoint based on whether it's a customer or client
      const endpoint = isCustomer
        ? `http://localhost:8080/api/v1/customers/verify-otp/${userId}`
        : `http://localhost:8080/api/v1/clients/verify-otp/${userId}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpValue }),
      });

      if (response.ok) {
        toast.success("OTP verified successfully!", { position: "top-right" });
        setTimeout(() => {
          // Redirect to the appropriate login page
          navigate(isCustomer ? "/customer/login" : "/client/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to verify OTP. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again later.", { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit} className="verify-otp-form">
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
              className="otp-input-box"
            />
          ))}
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;