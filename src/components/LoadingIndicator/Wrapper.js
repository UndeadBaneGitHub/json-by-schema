import React from 'react';
import PropTypes from 'prop-types';

function Wrapper({ size = '40px', className = '', style, ...rest }) {
  return (
    <div
      className={`mx-auto relative ${className}`}
      style={{ width: size, height: size, ...style }}
      {...rest}
    />
  );
}

Wrapper.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Wrapper;
