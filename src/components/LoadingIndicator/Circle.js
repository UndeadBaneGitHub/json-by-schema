import React from 'react';
import PropTypes from 'prop-types';

const Circle = ({ rotate, delay }) => (
  <div
    className="jbs-circle-dot w-full h-full absolute left-0 top-0"
    style={{
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      '--jbs-delay': delay ? `${delay}s` : undefined,
    }}
  />
);

Circle.propTypes = {
  delay: PropTypes.number,
  rotate: PropTypes.number,
};

export default Circle;
