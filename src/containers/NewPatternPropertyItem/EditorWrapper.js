import React from 'react';

const EditorWrapper = ({ className = '', ...rest }) => (
  <div
    className={`relative px-4 py-2.5 bg-[var(--jbs-bg-secondary)] border-b border-[var(--jbs-border)] ${className}`}
    {...rest}
  />
);

export default EditorWrapper;
