import React from 'react';

const Button = React.forwardRef(({ disabled, className = '', ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Close"
    disabled={disabled}
    className={`top-1 right-1.5 absolute p-1.5 flex items-center justify-center rounded-[var(--jbs-radius)] text-[var(--jbs-text-muted)] hover:text-[var(--jbs-text)] hover:bg-[var(--jbs-input-bg)] transition-colors ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'} ${className}`}
    {...rest}
  />
));

export default Button;
