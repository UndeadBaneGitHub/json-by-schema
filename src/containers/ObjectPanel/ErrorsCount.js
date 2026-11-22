import React from 'react';

const ErrorsCount = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`text-[rgba(235,0,0,0.8)] bg-[#b0b0b0] border-b-2 border-[#a0a0a0] px-[1em] py-[0.5em] font-bold text-center ${className}`}
    {...rest}
  />
));

export default ErrorsCount;
