import React from 'react';

const SchemaSelectorWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`overflow-visible pt-[0.5em] pr-[0.5em] pb-[0.5em] pl-[1em] bg-[#aaa] ${className}`}
    {...rest}
  />
));

export default SchemaSelectorWrapper;
