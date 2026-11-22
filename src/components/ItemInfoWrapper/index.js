import React from 'react';

const ItemInfoWrapper = ({ className = '', ...rest }) => (
  <div className={`opacity-60 ${className}`} {...rest} />
);

export default ItemInfoWrapper;
