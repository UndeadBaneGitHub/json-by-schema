import React from 'react';

const Wrapper = React.forwardRef(({ isChild, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`jbs-property-editor ${isChild ? 'jbs-property-editor--child' : ''} ${className}`.trim()}
    {...rest}
  />
));

export default Wrapper;
