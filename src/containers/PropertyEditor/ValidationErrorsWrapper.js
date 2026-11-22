import React from 'react';

const ValidationErrorsWrapper = ({ className = '', ...rest }) => (
  <div
    className={`text-[rgba(235,0,0,0.8)] font-bold max-h-[20%] overflow-y-auto mb-[1em] ${className}`}
    {...rest}
  />
);

export default ValidationErrorsWrapper;
