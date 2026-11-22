import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`relative w-full overflow-visible p-0 ${className}`} {...rest} />
);

export default Wrapper;
