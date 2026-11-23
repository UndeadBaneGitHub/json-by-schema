/**
 *
 * ValueLine
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ValueLine(props) {
  if (props.schema) {
    if (
      !props.schema.type ||
      props.schema.type === 'object' ||
      props.schema.type === 'array'
    ) {
      return null;
    }
  } else if (
    props.config &&
    (props.constructor === Array || props.config === Object(props.config))
  ) {
    return null;
  }

  return (
    <span>
      <FormattedMessage {...messages.value} />
      {String(props.config) || '--'}
    </span>
  );
}

ValueLine.propTypes = {
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]),
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default ValueLine;
