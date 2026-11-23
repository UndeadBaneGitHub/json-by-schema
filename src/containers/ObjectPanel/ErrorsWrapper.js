import React from 'react';

const ErrorsWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`absolute w-full max-h-[30%] z-10 overflow-y-auto overflow-x-hidden ${className}`}
    {...rest}
  />
));

export default ErrorsWrapper;
