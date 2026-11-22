import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`bg-white dark:bg-[#1c1c1e] ${className}`} {...rest} />
);

export default Wrapper;
