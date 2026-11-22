import React from 'react';

const Input = ({ className = '', ...rest }) => (
  <input
    autoFocus
    className={`outline-none w-full bg-[#dddce1] px-[1em] py-[0.5em] rounded-[0.5em] text-black ${className}`}
    {...rest}
  />
);

export default Input;
