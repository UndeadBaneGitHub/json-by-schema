import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`absolute inset-0 ${className}`} {...rest} />
);

export default Wrapper;
