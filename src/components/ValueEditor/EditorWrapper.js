import React from 'react';

const EditorWrapper = ({ className = '', ...rest }) => (
  <div className={`py-[0.5em] w-full min-w-full ${className}`} {...rest} />
);

export default EditorWrapper;
