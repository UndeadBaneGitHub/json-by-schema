import React from 'react';

const Wrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`text-[rgba(235,0,0,0.8)] mt-[0.4em] ${className}`}
    {...rest}
  />
));

export default Wrapper;
