/** *
 * EditAsJSONButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Wrapper from './Wrapper';

function EditAsJSONButton(props) {
  if (props.hide) {
    return null;
  }

  return (
    <Wrapper
      onClick={props.onClick}
      disabled={props.disabled}
      className={'text-button'}
    >
      {props.showStop ? (
        <FormattedMessage {...messages.stopEditAsJSON} />
      ) : (
        <FormattedMessage {...messages.editAsJSON} />
      )}
    </Wrapper>
  );
}

EditAsJSONButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  hide: PropTypes.bool,
  disabled: PropTypes.bool,
  showStop: PropTypes.bool.isRequired,
};

export default EditAsJSONButton;
