import React from 'react';

const PatternItem = ({ className = '', ...rest }) => (
  <li className={`px-[1em] py-[0.5em] ${className}`} {...rest} />
);

export default PatternItem;
