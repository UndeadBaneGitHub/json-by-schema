import React from 'react';

const Input = ({ className = '', ...rest }) => (
  <input
    autoFocus
    className={`jbs-input ${className}`.trim()}
    {...rest}
  />
);

export default Input;
