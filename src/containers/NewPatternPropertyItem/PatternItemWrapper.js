import React from 'react';

const PatternItemWrapper = ({ matching, className = '', ...rest }) => (
  <div
    className={`rounded-[0.6em] px-[1.5em] py-[0.3em] table ${matching ? 'bg-[#bffc99]' : 'bg-[#fc7b7f]'} ${className}`}
    {...rest}
  />
);

export default PatternItemWrapper;
