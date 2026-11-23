import React from 'react';

const FilterInput = React.forwardRef(({ className = '', ...rest }, ref) => (
  <input
    ref={ref}
    className={`jbs-search-input outline-none w-[calc(100%-2em)] bg-[var(--jbs-input-bg)] px-3 py-1.5 rounded-[var(--jbs-radius)] text-[14px] text-[var(--jbs-text)] placeholder:text-[var(--jbs-text-secondary)] ${className}`.trim()}
    {...rest}
  />
));

export default FilterInput;
