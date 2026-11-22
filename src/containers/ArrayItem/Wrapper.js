import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <li
    className={`w-full border-b border-[#c6c6c8]/60 dark:border-[#38383a] m-0 p-0 cursor-pointer relative ${className}`}
    {...rest}
  />
);

export default Wrapper;
