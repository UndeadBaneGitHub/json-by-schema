import React from 'react';

const NoItemsElementWrapper = ({ className = '', ...rest }) => (
  <h3
    className={`w-full h-auto my-6 mx-auto text-center text-[15px] font-normal text-[var(--jbs-text-muted)] ${className}`}
    {...rest}
  />
);

export default NoItemsElementWrapper;
