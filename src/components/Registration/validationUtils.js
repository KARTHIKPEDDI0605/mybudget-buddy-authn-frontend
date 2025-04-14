/**
 * Validate name: only letters, spaces, and hyphens allowed
 * @param {string} name - The name to validate
 * @returns {boolean} - Whether the name is valid
 */
export const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s-]+$/;
    return nameRegex.test(name);
  };
  
  /**
   * Validate username: at least 5 characters, alphanumeric and underscores
   * @param {string} username - The username to validate
   * @returns {boolean} - Whether the username is valid
   */
  export const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z0-9_]{5,}$/;
    return usernameRegex.test(username);
  };
  
  /**
   * Validate email
   * @param {string} email - The email to validate
   * @returns {boolean} - Whether the email is valid
   */
  export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password: at least 8 characters, with at least one uppercase, one lowercase,
   * one number, and one special character
   * @param {string} password - The password to validate
   * @returns {boolean} - Whether the password is valid
   */
  export const validatePassword = (password) => {
    // At least 8 characters, at least one uppercase, one lowercase, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  /**
   * Validate phone number: numeric only, proper length
   * @param {string} phone - The phone number to validate
   * @returns {boolean} - Whether the phone number is valid
   */
  export const validatePhone = (phone) => {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * Validate pincode: numeric only, 6 digits
   * @param {string} pincode - The pincode to validate
   * @returns {boolean} - Whether the pincode is valid
   */
  export const validatePincode = (pincode) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };
  
  /**
   * Validate date of birth
   * @param {Object} dob - The date of birth object with day, month, and year
   * @returns {boolean} - Whether the date of birth is valid
   */
  export const validateDob = (dob) => {
    if (!dob.day || !dob.month || !dob.year) {
      return false;
    }
    
    const day = parseInt(dob.day);
    const month = parseInt(dob.month);
    const year = parseInt(dob.year);
    
    // Check if date is valid
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };