import React from 'react';

const ItemInfoWrapper = ({ className = '', ...rest }) => (
  <div className={`jbs-property-info ${className}`.trim()} {...rest} />
);

export default ItemInfoWrapper;
