import React from 'react';

const Wrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div ref={ref} className={`absolute inset-0 ${className}`} {...rest} />
));

Wrapper.displayName = 'EditorWrapper';

export default Wrapper;
