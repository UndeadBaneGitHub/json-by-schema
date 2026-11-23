import React from 'react';

const Button = ({ disabled, className = '', ...rest }) => (
  <input
    disabled={disabled}
    className={`jbs-button ${className}`.trim()}
    {...rest}
  />
);

export default Button;
