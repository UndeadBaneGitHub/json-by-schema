import React from 'react';

const ErrorMessageWrapper = ({ className = '', ...rest }) => (
  <div
    className={`border-t border-[rgba(235,0,0,0.8)] w-full py-[0.5em] ${className}`}
    {...rest}
  />
);

export default ErrorMessageWrapper;
