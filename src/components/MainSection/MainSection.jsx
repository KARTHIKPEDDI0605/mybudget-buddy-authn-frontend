import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainSection.css";
import { FaUserCircle } from "react-icons/fa";
import { FaStoreAlt } from "react-icons/fa";

const MainSection = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <header className="main-header">
        <h1 className="title">
           <span className="highlight1">MyBudget </span><span className="highlight2">Budyy</span>
        </h1>
        <p className="subtitle">
          Connect with the best service providers for your special events. From weddings to corporate gatherings, we've got you covered.
        </p>
      </header>

      <div className="cards-container">
        <div className="glass-card">
          <FaUserCircle className="card-icon" />
          <h2>I'm looking for services</h2>
          <p>
            Find the perfect service providers for your upcoming events based on your preferences and location.
          </p>
          <button
            className="continue-btn customer-btn"
            onClick={() => navigate("/customer/login")}
          >
            Continue as Customer
          </button>
        </div>

        <div className="glass-card">
          <FaStoreAlt className="card-icon" />
          <h2>I'm a service provider</h2>
          <p>
            Register your services and connect with customers looking for event-related offerings in your area.
          </p>
          <button
            className="continue-btn provider-btn"
            onClick={() => navigate("/client/login")}
          >
            Continue as Service Provider
          </button>
        </div>
      </div>

      <footer className="main-footer">
        © 2025 EventsHub. All rights reserved.
      </footer>
    </div>
  );
};

export default MainSection;