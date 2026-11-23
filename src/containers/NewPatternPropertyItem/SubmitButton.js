import React from 'react';

const SubmitButton = ({ disabled, className = '', ...rest }) => (
  <input
    type="submit"
    disabled={disabled}
    className={`w-full text-center ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer opacity-75 hover:opacity-100'} ${className}`}
    {...rest}
  />
);

export default SubmitButton;
