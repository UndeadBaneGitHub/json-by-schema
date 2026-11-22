import React from 'react';

const ErrorsCount = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`text-[#ff3b30] dark:text-[#ff453a] bg-[#ff3b30]/10 dark:bg-[#ff453a]/15 border-b border-[#ff3b30]/20 dark:border-[#ff453a]/25 px-3.5 py-2 text-[13px] font-semibold text-center ${className}`}
    {...rest}
  />
));

export default ErrorsCount;
