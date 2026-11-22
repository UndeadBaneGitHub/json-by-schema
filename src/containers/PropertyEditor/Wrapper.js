import React from 'react';

const Wrapper = React.forwardRef(({ isChild, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`absolute top-0 bottom-0 w-[600px] max-w-[600px] px-6 py-4 bg-[var(--jbs-bg-secondary)] text-[var(--jbs-text)] overflow-y-auto ${isChild ? 'left-[450px]' : 'left-0'} ${className}`}
    {...rest}
  />
));

export default Wrapper;
