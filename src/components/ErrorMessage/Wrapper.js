import React from 'react';

const Wrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`text-[var(--jbs-danger)] text-[13px] mt-1.5 ${className}`}
    {...rest}
  />
));

export default Wrapper;
