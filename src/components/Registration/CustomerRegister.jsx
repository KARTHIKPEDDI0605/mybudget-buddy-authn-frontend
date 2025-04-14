import React, { useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  FormHelperText,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemIcon
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import "./CustomerRegister.css"; // Assuming a separate CSS file
import { locationData } from "./locationData";
import { 
  validateName, 
  validateUsername, 
  validateEmail, 
  validatePassword as validatePasswordStrength, 
  validatePincode,
} from "./validationUtils";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: uuidv4(), // Changed from clientId to customerId
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
    phoneNumber: "",
    address: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    dob: null,
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false);
  const serviceSelectRef = useRef(null); // Kept for consistency, though not used

  const validatePasswordLive = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password),
    });
  };

  const validatePassword = (password) => {
    const errors = [];
    if (!validatePasswordStrength(password)) {
      if (password.length < 8) errors.push("Password must be at least 8 characters long");
      if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter (A-Z) is required");
      if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter (a-z) is required");
      if (!/[0-9]/.test(password)) errors.push("At least one number (0-9) is required");
      if (!/[@$!%*?&]/.test(password)) errors.push("At least one special character (@$!%*?&) is required");
    }
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "phoneNumber") {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (!termsAccepted) newErrors.terms = "You must accept the terms and conditions";

    if (formData.firstName && !validateName(formData.firstName)) {
      newErrors.firstName = "First name should only contain letters, spaces, and hyphens";
    }
    
    if (formData.lastName && !validateName(formData.lastName)) {
      newErrors.lastName = "Last name should only contain letters, spaces, and hyphens";
    }
    
    if (formData.username && !validateUsername(formData.username)) {
      newErrors.username = "Username must be at least 5 characters with only letters, numbers, and underscores";
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (formData.password) {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) newErrors.password = passwordErrors[0];
    }
    
    if (formData.pincode && !validatePincode(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (formData.dob) {
      const dobStr = formData.dob.toISOString().split('T')[0];
      const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      if (!datePattern.test(dobStr)) {
        newErrors.dob = "Date of birth must be in YYYY-MM-DD format";
      } else {
        const [year, month, day] = dobStr.split('-');
        const parsedDate = new Date(year, month - 1, day);
        if (parsedDate > new Date()) {
          newErrors.dob = "Date of birth cannot be in the future";
        }
        const age = new Date().getFullYear() - parsedDate.getFullYear();
        if (age < 18 || (age === 18 && parsedDate > new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()))) {
          newErrors.dob = "Must be at least 18 years old";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name === "country") {
        const selectedCountry = locationData.find(c => c.name === value);
        const dialCode = selectedCountry ? selectedCountry.dialCode : "";
        return {
          ...prevFormData,
          [name]: value,
          phoneNumber: dialCode
        };
      } else if (name === "phoneNumber") {
        const selectedCountry = locationData.find(c => c.name === prevFormData.country);
        const dialCode = selectedCountry ? selectedCountry.dialCode : "";
        const currentPhone = prevFormData.phoneNumber;
        const userInput = value.replace(currentPhone.slice(0, dialCode.length), '').replace(/[^0-9]/g, '');
        const newValue = dialCode + userInput;
        return {
          ...prevFormData,
          [name]: newValue
        };
      } else {
        return {
          ...prevFormData,
          [name]: value
        };
      }
    });
    
    if (name === "password" && value) {
      setShowPasswordChecklist(true);
      validatePasswordLive(value);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDateChange = (newDate) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      dob: newDate
    }));
    if (errors.dob) {
      setErrors({ ...errors, dob: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    const formattedData = {
      ...formData,
      dob: formData.dob ? formData.dob.toISOString().split('T')[0] : null,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/customers/register", 
        {
          ...formattedData,
          role: "customer", // Changed role to customer
        }
      );
      
      if (response.status === 201) {
        toast.success("Customer registered successfully!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => navigate("/customer/login"), 3000); // Adjusted navigation
      }
    } catch (error) {
      const statusCode = error.response?.status;
      let errorMsg = "Registration failed. Please try again.";

      if (statusCode === 400) {
        errorMsg = error.response?.data?.errorMessage || "Invalid data provided.";
      } else if (statusCode === 409) {
        errorMsg = "User already exists. Please try a different email or username.";
      } else {
        errorMsg = error.response?.data?.errorMessage || errorMsg;
      }

      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getStates = () => {
    const country = locationData.find((c) => c.name === formData.country);
    return country ? country.states : [];
  };

  const getDistricts = () => {
    const country = locationData.find((c) => c.name === formData.country);
    const state = country?.states.find((s) => s.value === formData.state);
    return state ? state.districts : [];
  };

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  return (
    <Box className="customer-register-container">
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box className="customer-register-form">

        <Typography variant="h4" align="center" gutterBottom>
          Customer Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName}
            className="custom-input"
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName}
            className="custom-input"
          />

          <TextField
            className="custom-input"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            className="custom-input"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              className: isPasswordValid && showPasswordChecklist ? "valid-password" : "",
            }}
          />

          {showPasswordChecklist && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <List dense>
                {[
                  { key: 'length', text: 'At least 8 characters' },
                  { key: 'uppercase', text: 'One uppercase letter' },
                  { key: 'lowercase', text: 'One lowercase letter' },
                  { key: 'number', text: 'One number' },
                  { key: 'special', text: 'One special character (@$!%*?&)' },
                ].map(({ key, text }) => (
                  <ListItem key={key}>
                    <ListItemIcon>
                      {passwordValidations[key] ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </ListItemIcon>
                    <Typography variant="body2">{text}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
            className="custom-input"
          />

          <FormControl fullWidth margin="normal" error={!!errors.country} className="custom-select">
            <InputLabel>Country</InputLabel>
            <Select
              name="country"
              value={formData.country}
              onChange={handleChange}
              label="Country"
            >
              {locationData.map((country) => (
                <MenuItem key={country.code} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.country}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.state} className="custom-select">
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={formData.state}
              onChange={handleChange}
              label="State"
              disabled={!formData.country}
            >
              {getStates().map((state) => (
                <MenuItem key={state.value} value={state.value}>
                  {state.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.state}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.district} className="custom-select">
            <InputLabel>District</InputLabel>
            <Select
              name="district"
              value={formData.district}
              onChange={handleChange}
              label="District"
              disabled={!formData.state}
            >
              {getDistricts().map((district) => (
                <MenuItem key={district.value} value={district.value}>
                  {district.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.district}</FormHelperText>
          </FormControl>

          <TextField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.pincode}
            helperText={errors.pincode}
            className="custom-input"
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            className="custom-input phone-input"
          />
          <FormControl fullWidth margin="normal" error={!!errors.gender} className="custom-select">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <FormHelperText>{errors.gender}</FormHelperText>
          </FormControl>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.address}
            helperText={errors.address}
            className="custom-input"
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              value={formData.dob}
              onChange={handleDateChange}
              className="custom-date-picker"
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.dob,
                  helperText: errors.dob,
                  className: "custom-input"
                },
              }}
              disableFuture
              views={['year', 'month', 'day']}
            />
          </LocalizationProvider>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Terms and Conditions
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              By registering, you agree that if you book a service for your event,
              we are not responsible for the service quality. We are only connecting
              service providers all at one place.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms) {
                      setErrors({ ...errors, terms: "" });
                    }
                  }}
                  color="primary"
                />
              }
              label="I agree to the terms and conditions"
            />
            {errors.terms && (
              <FormHelperText error>{errors.terms}</FormHelperText>
            )}
          </Box>
          <Button
            className="register-button"
            type="submit"
            variant="contained"
            fullWidth
            disabled={!termsAccepted}
            sx={{ mt: 2, backgroundColor: "#FE4F2D", "&:hover": { backgroundColor: "#e64527" } }}
          >
            Register
          </Button>
          <div className="login-link">
            <Link component={RouterLink} to="/customer/login">
              Already have an account? Login
            </Link>
          </div>
        </form>
        <Dialog open={false} onClose={() => {}}> {/* Dialog kept but disabled since services are removed */}
          <DialogTitle>Add Custom Service</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Service Name"
              fullWidth
              variant="outlined"
              value=""
              className="custom-input"
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary">Cancel</Button>
            <Button color="primary">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CustomerRegister;