import React from 'react';

const ValidationErrorsWrapper = ({ className = '', ...rest }) => (
  <div className={`text-[var(--jbs-danger)] font-bold ${className}`} {...rest} />
);

export default ValidationErrorsWrapper;
