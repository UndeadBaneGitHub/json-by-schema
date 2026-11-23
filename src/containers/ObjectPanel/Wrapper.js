import React from 'react';

const Wrapper = React.forwardRef(({ isJSONMode, isChild, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`absolute top-0 bottom-0 bg-[var(--jbs-bg)] text-[var(--jbs-text)] border-r border-[var(--jbs-border)] p-0 overflow-visible after:content-[''] after:absolute after:inset-0 after:shadow-[var(--jbs-panel-shadow)] after:pointer-events-none ${isJSONMode ? 'w-[600px] max-w-[600px]' : 'w-[450px] max-w-[450px]'} ${isChild ? 'left-[450px]' : 'left-0'} ${className}`}
    {...rest}
  />
));

export default Wrapper;
