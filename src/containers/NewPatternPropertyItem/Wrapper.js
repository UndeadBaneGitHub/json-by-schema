import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`bg-[var(--jbs-bg)] ${className}`} {...rest} />
);

export default Wrapper;
