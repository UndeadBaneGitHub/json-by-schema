import React from 'react';

const Li = React.forwardRef(({ className = '', ...rest }, ref) => (
  <li ref={ref} className={`list-none ${className}`} {...rest} />
));

export default Li;
