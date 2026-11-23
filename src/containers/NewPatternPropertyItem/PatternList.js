import React from 'react';

const PatternList = ({ className = '', ...rest }) => (
  <ul className={`pl-[1.5em] m-0 list-none ${className}`} {...rest} />
);

export default PatternList;
