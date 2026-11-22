import React from 'react';

const NoItemsElementWrapper = ({ className = '', ...rest }) => (
  <h3
    className={`w-full h-auto my-[1em] mx-auto text-center text-[#ccc] ${className}`}
    {...rest}
  />
);

export default NoItemsElementWrapper;
