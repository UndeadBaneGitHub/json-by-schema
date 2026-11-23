import React from 'react';

const Textarea = ({ className = '', ...rest }) => (
  <textarea
    autoFocus
    className={`jbs-textarea ${className}`.trim()}
    {...rest}
  />
);

export default Textarea;
