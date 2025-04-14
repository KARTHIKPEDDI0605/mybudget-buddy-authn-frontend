import React from 'react';
import Select from 'react-select';


// Custom styles for the Select components
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: state.isFocused 
      ? '2px solid #8e7cc3' 
      : state.selectProps.isError 
        ? '2px solid #ff5252' 
        : '2px solid rgba(255, 255, 255, 0.18)',
    boxShadow: state.isFocused ? '0 4px 12px rgba(142, 124, 195, 0.3)' : 'none',
    transition: 'all 0.3s ease',
    padding: '2px',
    '&:hover': {
      borderColor: '#8e7cc3',
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#8e7cc3' 
      : state.isFocused 
        ? 'rgba(142, 124, 195, 0.1)' 
        : 'transparent',
    color: state.isSelected ? 'white' : '#333',
    '&:hover': {
      backgroundColor: 'rgba(142, 124, 195, 0.2)',
    }
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(142, 124, 195, 0.2)',
    borderRadius: '4px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#333',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#8e7cc3',
    '&:hover': {
      backgroundColor: 'rgba(142, 124, 195, 0.4)',
      color: 'white',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    borderRadius: '8px',
  }),
};

/// Input field component with floating label
export const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  onBlur, 
  error 
}) => {
  return (
    <div className="form-field">
      <div className={`floating-input ${error ? 'has-error' : ''}`}>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder=" " // Placeholder is a space to trigger the floating effect
          required // Required to ensure the :not(:placeholder-shown) selector works
        />
        <label htmlFor={name}>{label}</label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
// Select field component
export const SelectField = ({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  isDisabled = false, 
  error 
}) => {
  return (
    <div className="form-field">
      <label className="select-label">{label}</label>
      <Select
        name={name}
        options={options}
        value={value}
        onChange={(option) => onChange(option, { name })}
        isDisabled={isDisabled}
        styles={customSelectStyles}
        isError={error}
        placeholder={`Select ${label}`}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Multi-select field component
export const MultiSelectField = ({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  error 
}) => {
  return (
    <div className="form-field full-width">
      <label className="select-label">{label}</label>
      <Select
        name={name}
        options={options}
        value={value}
        onChange={(option) => onChange(option, { name })}
        styles={customSelectStyles}
        isError={error}
        placeholder={`Select ${label}`}
        className="react-select-container"
        classNamePrefix="react-select"
        isMulti
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};



// Date select field component
export const DateSelectField = ({ value, onChange, error }) => {
    const years = Array.from({ length: 100 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: String(year), label: String(year) };
    });
    
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, '0');
      return { value: month, label: month };
    });
    
    const getDaysInMonth = (year, month) => {
      return new Date(year, month, 0).getDate();
    };
    
    const getDays = () => {
      let daysCount = 31; // Default to maximum
      
      if (value.year && value.month) {
        daysCount = getDaysInMonth(parseInt(value.year), parseInt(value.month));
      }
      
      return Array.from({ length: daysCount }, (_, i) => {
        const day = String(i + 1).padStart(2, '0');
        return { value: day, label: day };
      });
    };
  
    return (
      <div className="form-field date-field">
        <label className="select-label">Date of Birth</label>
        <div className="date-select-container">
          <Select
            name="day"
            options={getDays()}
            value={value.day ? { value: value.day, label: value.day } : null}
            onChange={(option) => onChange('day', option ? option.value : '')}
            styles={customSelectStyles}
            isError={error}
            placeholder="Day"
            className="date-select"
          />
          <Select
            name="month"
            options={months}
            value={value.month ? { value: value.month, label: value.month } : null}
            onChange={(option) => onChange('month', option ? option.value : '')}
            styles={customSelectStyles}
            isError={error}
            placeholder="Month"
            className="date-select"
          />
          <Select
            name="year"
            options={years}
            value={value.year ? { value: value.year, label: value.year } : null}
            onChange={(option) => onChange('year', option ? option.value : '')}
            styles={customSelectStyles}
            isError={error}
            placeholder="Year"
            className="date-select"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };
  
  // Phone input field with country code
  export const PhoneInputField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    onBlur, 
    countryCode, 
    error 
  }) => {
    return (
      <div className="form-field">
        <div className={`floating-input phone-input ${value ? 'has-value' : ''} ${error ? 'has-error' : ''}`}>
          <div className="country-code">{countryCode || '+91'}</div>
          <input
            type="tel"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder=" "
          />
          <label htmlFor={name}>{label}</label>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };