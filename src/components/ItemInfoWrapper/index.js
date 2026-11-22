import React from 'react';

const ItemInfoWrapper = ({ className = '', ...rest }) => (
  <div
    className={`text-[13px] text-[#3c3c43]/60 dark:text-[#ebebf5]/60 ${className}`}
    {...rest}
  />
);

export default ItemInfoWrapper;
