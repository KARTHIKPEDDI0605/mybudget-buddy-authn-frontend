// common.js - Shared functionality between both login pages

// Token management
const storeAuthToken = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };
  
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  // API calls
  const loginUser = async (username, password, role) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      storeAuthToken(data.token, data.claims);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const sendApiRequest = async (url, method = 'GET', body = null) => {
    const token = getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  
    const options = {
      method,
      headers,
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    const response = await fetch(url, options);
    return response.json();
  };
  
  const requestPasswordReset = async (email, role) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Password reset request failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };
  
  // Google Authentication
  const initGoogleAuth = (role, onSuccess) => {
    // This would integrate with Google's OAuth API
    // For demonstration purposes - would need actual Google OAuth implementation
    const handleGoogleLogin = async (googleUser) => {
      try {
        const id_token = googleUser.credential;
        
        const response = await fetch('http://localhost:8080/api/v1/auth/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: id_token,
            role: role
          }),
        });
        
        if (!response.ok) {
          throw new Error('Google login failed');
        }
        
        const data = await response.json();
        storeAuthToken(data.token, data.claims);
        onSuccess(data);
      } catch (error) {
        console.error('Google login error:', error);
      }
    };
  
    // Google OAuth button setup would go here
    return {
      handleGoogleLogin
    };
  };