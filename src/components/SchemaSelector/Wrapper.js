import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`my-[0.5em] ${className}`} {...rest} />
);

export default Wrapper;
