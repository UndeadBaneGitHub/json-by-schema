import React from 'react';

const ItemInfoWrapper = ({ className = '', ...rest }) => (
  <div
    className={`jbs-property-info text-[13px] text-[var(--jbs-text-secondary)] ${className}`.trim()}
    {...rest}
  />
);

export default ItemInfoWrapper;
