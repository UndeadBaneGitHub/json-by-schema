import React from 'react';

const ItemInfoWrapper = ({ className = '', ...rest }) => (
  <div
    className={`text-[13px] text-[var(--jbs-text-secondary)] ${className}`}
    {...rest}
  />
);

export default ItemInfoWrapper;
