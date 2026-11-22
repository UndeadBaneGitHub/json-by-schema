import React from 'react';

const SchemaSelectorWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`overflow-visible px-3.5 py-2 bg-[#f2f2f7] dark:bg-[#2c2c2e] border-b border-[#c6c6c8]/60 dark:border-[#38383a] ${className}`}
    {...rest}
  />
));

export default SchemaSelectorWrapper;
