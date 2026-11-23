import React from 'react';

const SelectorWrapper = ({ className = '', ...rest }) => (
  <div className={`w-[82%] inline-block ${className}`} {...rest} />
);

export default SelectorWrapper;
