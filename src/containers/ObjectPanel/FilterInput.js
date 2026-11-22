import React from 'react';

const FilterInput = React.forwardRef(({ className = '', ...rest }, ref) => (
  <input
    ref={ref}
    className={`outline-none w-[calc(100%-2em)] bg-[#767680]/15 dark:bg-[#767680]/25 px-3 py-1.5 rounded-[10px] text-[14px] text-black dark:text-white placeholder:text-[#3c3c43]/60 dark:placeholder:text-[#ebebf5]/50 ${className}`}
    {...rest}
  />
));

export default FilterInput;
