import React from 'react';

const FilterInput = React.forwardRef(({ className = '', ...rest }, ref) => (
  <input
    ref={ref}
    className={`outline-none w-[calc(100%-2em)] bg-[#dddce1] px-[1em] py-[0.5em] rounded-[0.5em] text-black ${className}`}
    {...rest}
  />
));

export default FilterInput;
