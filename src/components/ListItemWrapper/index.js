import React from 'react';

const ListItemWrapper = React.forwardRef(
  ({ noSchema, expanded, className = '', ...rest }, ref) => (
    <div
      ref={ref}
      className={`jbs-property-item ${expanded ? 'jbs-property-item--active' : ''} ${noSchema ? 'jbs-property-item--no-schema' : ''} ${className}`.trim()}
      {...rest}
    />
  ),
);

ListItemWrapper.displayName = 'ListItemWrapper';

export default ListItemWrapper;
