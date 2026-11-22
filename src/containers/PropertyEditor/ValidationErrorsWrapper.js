import React from 'react';

const ValidationErrorsWrapper = ({ className = '', ...rest }) => (
  <div
    className={`text-[#ff3b30] dark:text-[#ff453a] font-semibold text-[13px] max-h-[20%] overflow-y-auto mb-4 ${className}`}
    {...rest}
  />
);

export default ValidationErrorsWrapper;
