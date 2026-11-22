import React from 'react';

const Input = ({ className = '', ...rest }) => (
  <input
    type="text"
    autoFocus
    className={`mt-[0.25em] mb-[0.5em] outline-none w-full bg-[#dddce1] px-[1em] py-[0.5em] rounded-[0.5em] text-black ${className}`}
    {...rest}
  />
);

export default Input;
