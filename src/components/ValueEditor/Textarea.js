import React from 'react';

const Textarea = ({ className = '', ...rest }) => (
  <textarea
    autoFocus
    className={`outline-none w-full bg-[#dddce1] p-[0.7em] rounded-[0.5em] text-black ${className}`}
    {...rest}
  />
);

export default Textarea;
