import React from 'react';

const DeletePropertyButton = ({ className = '', ...rest }) => (
  <a className={`text-[rgba(235,0,0,0.8)] underline ${className}`} {...rest} />
);

export default DeletePropertyButton;
