import React from 'react';

const ItemButtonsWrapper = ({ className = '', ...rest }) => (
  <div className={`w-full mt-1.5 ${className}`} {...rest} />
);

export default ItemButtonsWrapper;
