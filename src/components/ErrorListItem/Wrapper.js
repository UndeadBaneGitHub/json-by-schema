import React from 'react';
import PropTypes from 'prop-types';

const levelClasses = {
  0: 'border-[#eee] text-[#eee]',
  1: 'border-[lightblue] text-[lightblue]',
  2: 'border-[lightyellow] text-[lightyellow]',
  3: 'border-[rgba(235,0,0,0.8)] text-[rgba(235,0,0,0.8)]',
};

const Wrapper = React.forwardRef(({ level, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`m-0 px-[1em] py-[0.5em] border-b-2 first:border-t-2 font-bold text-center bg-[#ccc] w-full cursor-pointer ${levelClasses[level] || 'border-transparent'} ${className}`}
    {...rest}
  />
));

Wrapper.propTypes = {
  level: PropTypes.number,
  className: PropTypes.string,
};

export default Wrapper;
