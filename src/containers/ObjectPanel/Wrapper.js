import React from 'react';

const Wrapper = React.forwardRef(({ isJSONMode, isChild, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`jbs-panel ${isJSONMode ? 'jbs-panel--raw' : ''} ${isChild ? 'jbs-panel--child' : 'jbs-panel--root'} ${className}`.trim()}
    {...rest}
  />
));

export default Wrapper;
