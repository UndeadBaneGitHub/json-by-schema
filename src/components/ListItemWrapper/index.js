import React from 'react';

const ListItemWrapper = ({ noSchema, expanded, className = '', ...rest }) => (
  <div
    className={`w-full block box-border m-0 p-0 relative border-b border-[#c6c6c8]/60 dark:border-[#38383a] ${noSchema ? 'cursor-not-allowed' : 'cursor-pointer'} ${expanded ? 'z-[25]' : ''} ${className}`}
    {...rest}
  />
);

export default ListItemWrapper;
