import React from 'react';

const SearchForm = React.forwardRef(({ className = '', ...rest }, ref) => (
  <form
    ref={ref}
    className={`m-0 px-[1em] py-[0.5em] border-b-2 border-[#eaeaea] flex items-center relative cursor-pointer bg-[#f9f9f9] z-10 ${className}`}
    {...rest}
  />
));

export default SearchForm;
