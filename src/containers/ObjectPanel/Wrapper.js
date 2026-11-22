import React from 'react';

const Wrapper = ({ isJSONMode, isChild, className = '', ...rest }) => (
  <div
    className={`absolute top-0 bottom-0 bg-white border-r border-[#e1e1e1] p-0 overflow-visible after:content-[''] after:absolute after:inset-0 after:shadow-[2px_0_8px_rgba(100,100,100,0.55)] after:pointer-events-none ${isJSONMode ? 'w-[600px] max-w-[600px]' : 'w-[450px] max-w-[450px]'} ${isChild ? 'left-[450px]' : 'left-0'} ${className}`}
    {...rest}
  />
);

export default Wrapper;
