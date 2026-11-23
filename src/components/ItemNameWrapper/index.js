import React from 'react';

const ItemNameWrapper = ({ changed, className = '', ...rest }) => (
  <h3
    className={`jbs-property-name ${changed ? 'jbs-property-name--changed' : ''} m-0 text-[15px] font-semibold text-[var(--jbs-text)] ${changed ? 'underline decoration-[var(--jbs-accent)]' : 'no-underline'} ${className}`.trim()}
    {...rest}
  />
);

export default ItemNameWrapper;
