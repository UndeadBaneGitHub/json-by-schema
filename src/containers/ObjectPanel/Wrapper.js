import React from 'react';

const Wrapper = ({ isJSONMode, isChild, className = '', ...rest }) => (
  <div
    className={`absolute top-0 bottom-0 bg-white dark:bg-[#1c1c1e] text-black dark:text-white border-r border-[#c6c6c8]/60 dark:border-[#38383a] p-0 overflow-visible after:content-[''] after:absolute after:inset-0 after:shadow-[2px_0_12px_rgba(0,0,0,0.08)] dark:after:shadow-[2px_0_18px_rgba(0,0,0,0.6)] after:pointer-events-none ${isJSONMode ? 'w-[600px] max-w-[600px]' : 'w-[450px] max-w-[450px]'} ${isChild ? 'left-[450px]' : 'left-0'} ${className}`}
    {...rest}
  />
);

export default Wrapper;
