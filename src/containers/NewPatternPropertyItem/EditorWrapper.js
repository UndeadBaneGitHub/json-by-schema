import React from 'react';

const EditorWrapper = ({ className = '', ...rest }) => (
  <div
    className={`relative px-4 py-2.5 bg-[#f2f2f7] dark:bg-[#2c2c2e] border-b border-[#c6c6c8]/60 dark:border-[#38383a] ${className}`}
    {...rest}
  />
);

export default EditorWrapper;
