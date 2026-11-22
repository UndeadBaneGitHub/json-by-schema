/**
 *
 * AddItemButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Wrapper from './Wrapper';

function AddItemButton(props) {
  if (props.hide) {
    return null;
  }

  return (
    <Wrapper
      onClick={props.onClick}
      disabled={props.disabled}
      className={'text-button'}
    >
      <span aria-hidden="true">+</span>
      <FormattedMessage {...messages.addItem} />
    </Wrapper>
  );
}

AddItemButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  hide: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default AddItemButton;
