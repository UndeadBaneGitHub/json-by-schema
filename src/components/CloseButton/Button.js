import React from 'react';

const Button = React.forwardRef(({ disabled, className = '', ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    disabled={disabled}
    className={`top-0 right-0 absolute px-[0.5em] py-[0.4em] text-[1.1em] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    {...rest}
  />
));

export default Button;
