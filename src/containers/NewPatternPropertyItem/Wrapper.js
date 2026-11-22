import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`bg-white ${className}`} {...rest} />
);

export default Wrapper;
