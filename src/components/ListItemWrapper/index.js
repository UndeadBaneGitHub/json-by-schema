import React from 'react';

const ListItemWrapper = React.forwardRef(
  ({ noSchema, expanded, className = '', ...rest }, ref) => (
    <div
      ref={ref}
      className={`jbs-property-item ${expanded ? 'jbs-property-item--active' : ''} ${noSchema ? 'jbs-property-item--no-schema' : ''} w-full block box-border m-0 p-0 relative border-b border-[var(--jbs-border)] ${noSchema ? 'cursor-not-allowed' : 'cursor-pointer'} ${expanded ? 'z-[25]' : ''} ${className}`.trim()}
      {...rest}
    />
  ),
);

ListItemWrapper.displayName = 'ListItemWrapper';

export default ListItemWrapper;
