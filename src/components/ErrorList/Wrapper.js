import React from 'react';

const Wrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div ref={ref} className={`bg-[var(--jbs-bg)] z-10 w-full ${className}`} {...rest} />
));

export default Wrapper;
