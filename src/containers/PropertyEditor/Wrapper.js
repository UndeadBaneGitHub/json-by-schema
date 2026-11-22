import React from 'react';

const Wrapper = React.forwardRef(({ isChild, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`absolute top-0 bottom-0 w-[600px] max-w-[600px] px-6 py-4 bg-[#f2f2f7] dark:bg-[#1c1c1e] text-black dark:text-white overflow-y-auto ${isChild ? 'left-[450px]' : 'left-0'} ${className}`}
    {...rest}
  />
));

export default Wrapper;
