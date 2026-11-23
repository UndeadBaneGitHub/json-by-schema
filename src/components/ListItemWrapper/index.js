import React from 'react';

const ListItemWrapper = React.forwardRef(
  ({ noSchema, expanded, className = '', ...rest }, ref) => (
    <div
      ref={ref}
      className={`w-full block box-border m-0 p-0 relative border-b border-[var(--jbs-border)] ${noSchema ? 'cursor-not-allowed' : 'cursor-pointer'} ${expanded ? 'z-[25]' : ''} ${className}`}
      {...rest}
    />
  ),
);

ListItemWrapper.displayName = 'ListItemWrapper';

export default ListItemWrapper;
