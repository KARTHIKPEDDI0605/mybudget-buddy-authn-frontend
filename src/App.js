import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainSection from './components/MainSection/MainSection';
import ClientRegister from './components/Registration/ClientRegister';
import CustomerRegister from './components/Registration/CustomerRegister';
import CustomerLogin from './components/Login/CustomerLogin';
import ClientLogin from './components/Login/ClientLogin';
import VerifyOtp from './components/VerifyOtp/VerifyOtp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<MainSection />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/verify-otp/customer/:userId" element={<VerifyOtp />} />
        <Route path="/verify-otp/client/:userId" element={<VerifyOtp />} />
      </Routes>
    </Router>
  );
}

export default App;