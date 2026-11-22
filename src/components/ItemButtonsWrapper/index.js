import React from 'react';

const ItemButtonsWrapper = ({ className = '', ...rest }) => (
  <div className={`w-full ${className}`} {...rest} />
);

export default ItemButtonsWrapper;
