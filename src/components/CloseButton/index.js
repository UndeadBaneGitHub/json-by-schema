/**
* CloseButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';

function CloseButton(props) {
  return <Button onClick={props.onClick}>&times;</Button>;
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CloseButton;
