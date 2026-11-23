import React from 'react';

const PrefixWrapper = ({ className = '', ...rest }) => (
  <div
    className={`w-[18%] inline-block text-center [&_span]:relative [&_span]:top-[-0.7em] [&_span]:font-bold [&_span]:opacity-50 ${className}`}
    {...rest}
  />
);

export default PrefixWrapper;
