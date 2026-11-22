import React from 'react';

const Input = ({ className = '', ...rest }) => (
  <input
    autoFocus
    className={`outline-none w-full bg-[#767680]/15 dark:bg-[#767680]/25 px-3 py-2 rounded-[10px] text-[14px] text-black dark:text-white placeholder:text-[#3c3c43]/60 dark:placeholder:text-[#ebebf5]/50 ${className}`}
    {...rest}
  />
);

export default Input;
