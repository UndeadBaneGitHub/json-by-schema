import React from 'react';

const Input = ({ className = '', ...rest }) => (
  <input
    autoFocus
    className={`jbs-input outline-none w-full bg-[var(--jbs-input-bg)] px-3 py-2 rounded-[var(--jbs-radius)] text-[14px] text-[var(--jbs-text)] placeholder:text-[var(--jbs-text-secondary)] ${className}`.trim()}
    {...rest}
  />
);

export default Input;
