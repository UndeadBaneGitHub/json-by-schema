/** *
 * ErrorListItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';

// import messages from './messages';
import Wrapper from './Wrapper';

// const messageLevels = {
//   0: 'debug',
//   1: 'info',
//   2: 'warning',
//   3: 'error',
// };

export const errorLevels = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
};

function ErrorListItem(props) {
  /* You can uncomment the code here to restore prefixes of severity level */
  // const errorMessage = messages[messageLevels[props.level]];

  // add this line in the wrapper:
  // { <FormattedMessage {...errorMessage} />}
  return (
    <Wrapper level={props.level} onClick={props.onClick}>
      {props.message}
    </Wrapper>
  );
}

ErrorListItem.propTypes = {
  level: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ErrorListItem;
