import React from 'react';

const Wrapper = ({ isChild, className = '', ...rest }) => (
  <div
    className={`absolute top-0 bottom-0 w-[600px] max-w-[600px] px-[1.5em] py-[1em] bg-[#f9f9f9] overflow-y-auto ${isChild ? 'left-[450px]' : 'left-0'} ${className}`}
    {...rest}
  />
);

export default Wrapper;
