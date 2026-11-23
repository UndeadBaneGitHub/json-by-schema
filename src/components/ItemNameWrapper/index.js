import React from 'react';

const ItemNameWrapper = ({ changed, className = '', ...rest }) => (
  <h3
    className={`jbs-property-name ${changed ? 'jbs-property-name--changed' : ''} ${className}`.trim()}
    {...rest}
  />
);

export default ItemNameWrapper;
