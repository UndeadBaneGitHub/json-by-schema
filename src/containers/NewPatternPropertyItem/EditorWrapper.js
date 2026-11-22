import React from 'react';

const EditorWrapper = ({ className = '', ...rest }) => (
  <div
    className={`relative px-[1em] py-[0.5em] bg-[#f9f9f9] border-b-2 border-[#eaeaea] ${className}`}
    {...rest}
  />
);

export default EditorWrapper;
