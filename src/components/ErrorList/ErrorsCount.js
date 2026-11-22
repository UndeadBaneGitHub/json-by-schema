import React from 'react';

const ErrorsCount = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`text-[var(--jbs-danger)] bg-[var(--jbs-danger-bg)] border-b border-[var(--jbs-danger-border)] px-3.5 py-2 text-[13px] font-semibold text-center ${className}`}
    {...rest}
  />
));

export default ErrorsCount;
