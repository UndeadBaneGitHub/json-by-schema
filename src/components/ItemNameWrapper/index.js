import React from 'react';

const ItemNameWrapper = ({ changed, className = '', ...rest }) => (
  <h3 className={`m-0 ${changed ? 'underline' : 'no-underline'} ${className}`} {...rest} />
);

export default ItemNameWrapper;
