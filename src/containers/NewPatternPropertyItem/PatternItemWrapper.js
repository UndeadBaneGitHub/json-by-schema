import React from 'react';

const PatternItemWrapper = ({ matching, className = '', ...rest }) => (
  <div
    className={`rounded-full px-4 py-1 text-[13px] font-medium table ${
      matching
        ? 'bg-[#34c759]/20 text-[#1b7a34] dark:bg-[#30d158]/25 dark:text-[#6ee787]'
        : 'bg-[#ff3b30]/15 text-[#c92a22] dark:bg-[#ff453a]/20 dark:text-[#ff8a80]'
    } ${className}`}
    {...rest}
  />
);

export default PatternItemWrapper;
