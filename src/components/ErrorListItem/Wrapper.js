import React from 'react';
import PropTypes from 'prop-types';

const levelClasses = {
  0: 'border-[var(--jbs-border)] text-[var(--jbs-text-muted)]',
  1: 'border-[var(--jbs-accent)] text-[var(--jbs-accent)]',
  2: 'border-[var(--jbs-warning)] text-[var(--jbs-warning)]',
  3: 'border-[var(--jbs-danger-border)] text-[var(--jbs-danger)]',
};

const Wrapper = React.forwardRef(({ level, className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`m-0 px-3.5 py-2 border-b first:border-t text-[13px] font-semibold text-center bg-[var(--jbs-bg-secondary)] w-full cursor-pointer ${levelClasses[level] || 'border-transparent'} ${className}`}
    {...rest}
  />
));

Wrapper.propTypes = {
  level: PropTypes.number,
  className: PropTypes.string,
};

export default Wrapper;
