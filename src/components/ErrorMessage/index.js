/** *
 * ErrorMessage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { genId } from '../../utils/generalUtils';

import Wrapper from './Wrapper';

function ErrorMessage(props) {
  if (props.message) {
    return (
      <Wrapper key={genId()}>
        {props.prefix}
        <FormattedMessage {...props.message} />
        {props.postfix}
      </Wrapper>
    );
  }
  return null;
}

ErrorMessage.propTypes = {
  prefix: PropTypes.object,
  message: PropTypes.object,
  postfix: PropTypes.object,
};

export default ErrorMessage;
