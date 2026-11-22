import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`w-full font-normal pr-[30px] ${className}`} {...rest} />
);

export default Wrapper;
