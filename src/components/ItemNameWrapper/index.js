import React from 'react';

const ItemNameWrapper = ({ changed, className = '', ...rest }) => (
  <h3
    className={`m-0 text-[15px] font-semibold text-black dark:text-white ${changed ? 'underline decoration-[#007aff] dark:decoration-[#0a84ff]' : 'no-underline'} ${className}`}
    {...rest}
  />
);

export default ItemNameWrapper;
