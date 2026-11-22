/**
 *
 * RevertItemButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Wrapper from './Wrapper';

function RevertItemButton(props) {
  if (props.hide) {
    return null;
  }

  return (
    <Wrapper
      onClick={props.onClick}
      disabled={props.disabled}
      className={'text-button'}
    >
      <FormattedMessage {...messages.revertItem} />
    </Wrapper>
  );
}

RevertItemButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  hide: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default RevertItemButton;
