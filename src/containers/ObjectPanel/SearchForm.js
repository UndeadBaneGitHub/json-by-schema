import React from 'react';

const SearchForm = React.forwardRef(({ className = '', ...rest }, ref) => (
  <form
    ref={ref}
    className={`jbs-search-form ${className}`.trim()}
    {...rest}
  />
));

export default SearchForm;
