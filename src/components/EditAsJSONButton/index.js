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

  const isYaml = props.format === 'yaml';

  return (
    <Wrapper
      onClick={props.onClick}
      disabled={props.disabled}
      className={'text-button'}
    >
      {props.showStop ? (
        isYaml ? (
          'Stop editing as YAML'
        ) : (
          <FormattedMessage {...messages.stopEditAsJSON} />
        )
      ) : isYaml ? (
        'Edit as YAML'
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
  format: PropTypes.oneOf(['json', 'yaml']),
};

export default EditAsJSONButton;
