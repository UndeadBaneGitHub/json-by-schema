import React from 'react';
import PropTypes from 'prop-types';

const levelClasses = {
  0: 'border-[#c6c6c8] dark:border-[#38383a] text-[#8e8e93]',
  1: 'border-[#007aff]/40 text-[#007aff] dark:text-[#0a84ff]',
  2: 'border-[#ff9500]/40 text-[#ff9500] dark:text-[#ff9f0a]',
  3: 'border-[#ff3b30]/40 text-[#ff3b30] dark:text-[#ff453a]',
};

const Wrapper = React.forwardRef(({ level, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`m-0 px-3.5 py-2 border-b first:border-t text-[13px] font-semibold text-center bg-[#f2f2f7] dark:bg-[#2c2c2e] w-full cursor-pointer ${levelClasses[level] || 'border-transparent'} ${className}`}
    {...rest}
  />
));

Wrapper.propTypes = {
  level: PropTypes.number,
  className: PropTypes.string,
};

export default Wrapper;
