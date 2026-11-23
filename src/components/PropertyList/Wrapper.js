import React from 'react';

const Wrapper = ({ className = '', ...rest }) => (
  <div className={`jbs-property-list relative w-full overflow-visible p-0 ${className}`.trim()} {...rest} />
);

export default Wrapper;
