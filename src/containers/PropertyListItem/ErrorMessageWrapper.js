import React from 'react';

const ErrorMessageWrapper = ({ className = '', ...rest }) => (
  <div
    className={`border-t border-[var(--jbs-danger-border)] w-full py-[0.5em] ${className}`}
    {...rest}
  />
);

export default ErrorMessageWrapper;
