import React from 'react';

const ScrollableWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`overflow-y-auto absolute inset-0 ${className}`}
    {...rest}
  />
));

export default ScrollableWrapper;
