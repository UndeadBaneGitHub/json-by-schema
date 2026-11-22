import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <li
    className={`w-full border-b border-black m-0 p-0 cursor-pointer relative ${className}`}
    {...rest}
  />
);

export default Wrapper;
