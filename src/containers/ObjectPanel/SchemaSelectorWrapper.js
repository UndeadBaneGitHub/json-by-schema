import React from 'react';

const SchemaSelectorWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`overflow-visible px-3.5 py-2 bg-[var(--jbs-bg-secondary)] border-b border-[var(--jbs-border)] ${className}`}
    {...rest}
  />
));

export default SchemaSelectorWrapper;
