import React from 'react';

const SearchForm = React.forwardRef(({ className = '', ...rest }, ref) => (
  <form
    ref={ref}
    className={`m-0 px-3.5 py-2 border-b border-[#c6c6c8]/60 dark:border-[#38383a] flex items-center relative cursor-pointer bg-[#f2f2f7] dark:bg-[#1c1c1e] z-10 ${className}`}
    {...rest}
  />
));

export default SearchForm;
