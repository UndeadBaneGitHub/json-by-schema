import React from 'react';

const Wrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div ref={ref} className={`bg-white dark:bg-[#1c1c1e] z-10 w-full ${className}`} {...rest} />
));

export default Wrapper;
