import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerLogin.css';
import { useNavigate } from 'react-router-dom';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing again
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear server error when user starts typing in any field
    if (serverError) {
      setServerError('');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = { email: '', password: '' };
    
    if (!formData.email.trim()) {
      newFieldErrors.email = 'Please enter your username or email';
      isValid = false;
    }
    
    if (!formData.password) {
      newFieldErrors.password = 'Please enter your password';
      isValid = false;
    }
    
    setFieldErrors(newFieldErrors);
    return isValid;
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
          role: "customer"
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and user information in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_info', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role
        }));
        
        // Show success toast before redirect
        toast.success('Login successful! Redirecting...', {
          position: "top-center",
          autoClose: 2000,
        });
        
        // Redirect to dashboard or home page after toast display
        setTimeout(() => {
          navigate('/customer/home');
        }, 2000);
      } else {
        // Show server error as toast notification
        const errorMessage = data.errorMessage || 'Invalid username or password';
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      const errorMessage = 'Network error, please try again later';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle social authentication
  const handleSocialAuth = (provider) => {
    console.log(`Authenticating with ${provider}`);
    
    // OAuth flow implementation
    const oauthUrls = {
      'apple': 'http://localhost:8080/api/v1/auth/oauth/apple',
      'google': 'http://localhost:8080/api/v1/auth/oauth/google',
      'facebook': 'http://localhost:8080/api/v1/auth/oauth/facebook'
    };
    
    window.location.href = oauthUrls[provider];
  };

  const navigateToForgotPassword = () => {
   navigate('/forgot-password/customer');
  };

  const navigateToCreateAccount = () => {
    navigate('/customer/register');
  };

  return (
    <>
      <ToastContainer />
      <div className="glass-card-login">
        <h2 className="sign-in-title">Login</h2>

        {serverError && <div className="server-error-message">{serverError}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Username or Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your username or email"
              className={fieldErrors.email ? 'error-input' : ''}
              autoComplete="username"
            />
            {fieldErrors.email && <div className="field-error-message">{fieldErrors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={fieldErrors.password ? 'error-input' : ''}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.password && <div className="field-error-message">{fieldErrors.password}</div>}
          </div>
          
          <div className="forgot-password">
            <button
              type="button"
              onClick={navigateToForgotPassword}
              className="forgot-password-btn"
            >
              Forgot Password?
            </button>
          </div>
          
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        
        <div className="separator">
          <span>Or</span>
        </div>
        
        <div className="social-auth-buttons">
          <button
            type="button"
            className="social-button apple"
            onClick={() => handleSocialAuth('apple')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
          
          <button
            type="button"
            className="social-button google"
            onClick={() => handleSocialAuth('google')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M12 5c1.6168 0 3.1013.5978 4.2863 1.5788l3.2473-3.2473C17.3658 1.3455 14.7778 0 12 0 7.3915 0 3.3935 2.6893 1.386 6.4946l3.7037 2.8764C6.2302 6.6703 8.8822 5 12 5z" />
              <path fill="#34A853" d="M5 12c0-1.3143.3825-2.5308 1.0246-3.5564L2.386 5.5672C.8993 7.4371 0 9.6314 0 12c0 2.3686.8993 4.5629 2.386 6.4328l3.6386-2.8764C5.3825 14.5308 5 13.3143 5 12z" />
              <path fill="#FBBC05" d="M12 19c-3.1178 0-5.7698-1.6703-6.8717-4.0564L1.386 17.8201C3.3935 21.6107 7.3915 24 12 24c2.7879 0 5.3859-1.3455 7.5336-3.5621l-3.2473-3.2473C15.1013 18.4022 13.6168 19 12 19z" />
              <path fill="#EA4335" d="M23.8961 12.1526c0-.6553-.0594-1.3106-.1684-1.9557H12v4.1684h6.6187c-.2871 1.5466-1.1286 2.858-2.4021 3.74l3.2473 3.2473C21.6891 19.1526 24 15.9553 24 12c0-.2475-.0099-.4851-.0139-.7331 0-.0396-.0495-.7608-.0891-1.1143z" />
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <button
            type="button"
            className="social-button facebook"
            onClick={() => handleSocialAuth('facebook')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
              <path d="M20.007 3H3.993C3.445 3 3 3.445 3 3.993v16.014c0 .548.445.993.993.993h8.621v-6.971h-2.346v-2.717h2.346V9.31c0-2.325 1.42-3.591 3.494-3.591.993 0 1.847.074 2.096.107v2.43h-1.438c-1.128 0-1.347.536-1.347 1.322v1.734h2.69l-.35 2.717h-2.34V21h4.587c.548 0 .993-.445.993-.993V3.993c0-.548-.445-.993-.993-.993z" />
            </svg>
            <span>Continue with Facebook</span>
          </button>
        </div>
        
        <div className="create-account">
          <button
            type="button"
            className="create-account-btn"
            onClick={navigateToCreateAccount}
          >
            Create an Account
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerLogin;