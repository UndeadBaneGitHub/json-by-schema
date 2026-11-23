import React from 'react';

const FilterInput = React.forwardRef(({ className = '', ...rest }, ref) => (
  <input
    ref={ref}
    className={`jbs-search-input ${className}`.trim()}
    {...rest}
  />
));

export default FilterInput;
