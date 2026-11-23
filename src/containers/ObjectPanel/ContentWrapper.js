import React from 'react';

const ContentWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div ref={ref} className={`absolute inset-0 ${className}`} {...rest} />
));

export default ContentWrapper;
