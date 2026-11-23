import React from 'react';

const Button = ({ disabled, className = '', ...rest }) => (
  <input
    disabled={disabled}
    className={`jbs-button ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer opacity-75 hover:opacity-100'} ${className}`.trim()}
    {...rest}
  />
);

export default Button;
