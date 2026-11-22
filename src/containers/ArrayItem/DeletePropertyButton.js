import React from 'react';

const DeletePropertyButton = ({ className = '', ...rest }) => (
  <a className={`text-[var(--jbs-danger)] underline ${className}`} {...rest} />
);

export default DeletePropertyButton;
