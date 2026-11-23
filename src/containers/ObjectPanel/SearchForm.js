import React from 'react';

const SearchForm = React.forwardRef(({ className = '', ...rest }, ref) => (
  <form
    ref={ref}
    className={`jbs-search-form m-0 px-3.5 py-2 border-b border-[var(--jbs-border)] flex items-center relative cursor-pointer bg-[var(--jbs-bg-secondary)] z-10 ${className}`.trim()}
    {...rest}
  />
));

export default SearchForm;
