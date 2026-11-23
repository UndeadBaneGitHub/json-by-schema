import React from 'react';

const ListItemInnerWrapper = ({
  expanded,
  invalid,
  empty,
  changed,
  className = '',
  ...rest
}) => {
  const stateClasses = [
    'jbs-property-item-inner',
    expanded ? 'jbs-property-item-inner--active' : '',
    invalid ? 'jbs-property-item-inner--invalid' : '',
    empty ? 'jbs-property-item-inner--empty' : '',
    changed ? 'jbs-property-item-inner--changed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={stateClasses} {...rest} />;
};

export default ListItemInnerWrapper;
