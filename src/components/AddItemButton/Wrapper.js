import React from 'react';

const Wrapper = React.forwardRef(({ disabled, className = '', ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    disabled={disabled}
    className={`w-full flex items-center justify-center gap-1.5 text-center bg-transparent ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer opacity-75 hover:opacity-100'} ${className}`}
    {...rest}
  />
));

export default Wrapper;
