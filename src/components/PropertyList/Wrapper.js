import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`jbs-property-list ${className}`.trim()} {...rest} />
);

export default Wrapper;
