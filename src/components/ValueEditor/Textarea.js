import React from 'react';

const Textarea = ({ className = '', ...rest }) => (
  <textarea
    autoFocus
    className={`jbs-textarea outline-none w-full bg-[var(--jbs-input-bg)] p-3 rounded-[var(--jbs-radius)] text-[14px] text-[var(--jbs-text)] placeholder:text-[var(--jbs-text-secondary)] ${className}`.trim()}
    {...rest}
  />
);

export default Textarea;
