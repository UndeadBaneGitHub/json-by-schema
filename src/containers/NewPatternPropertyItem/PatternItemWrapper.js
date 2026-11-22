import React from 'react';

const PatternItemWrapper = ({ matching, className = '', ...rest }) => (
  <div
    className={`rounded-full px-4 py-1 text-[13px] font-medium table ${
      matching
        ? 'bg-[var(--jbs-success-bg)] text-[var(--jbs-success)]'
        : 'bg-[var(--jbs-danger-bg)] text-[var(--jbs-danger)]'
    } ${className}`}
    {...rest}
  />
);

export default PatternItemWrapper;
