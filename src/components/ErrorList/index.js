/** *
 * ErrorList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import ErrorListItem from '../../components/ErrorListItem';
import { generateIdPrefixFromPath } from '../../utils/schemaUtils';

import Wrapper from './Wrapper';

function ErrorList(props) {
  if (props.errors?.size) {
    const idPrefix = generateIdPrefixFromPath(props.path);

    const errorItems = [];

    const filteredErrorKeys = props.filter
      ? props.errors.keySeq().filter(props.filter)
      : props.errors.keySeq();

    filteredErrorKeys.forEach((id) => {
      const key = `error-${idPrefix}${id}`;

      const errorList = props.errors.get(id);
      if (!errorList?.size) {
        return;
      }

      errorList.forEach((error, index) => {
        const level = error.level;
        const message = error.message;

        const errorItemProps = {
          key: `${key}${index}`,
          level,
          message,
          onClick: error.onClick,
        };

        errorItems.push(<ErrorListItem {...errorItemProps} />);
      });
    });

    return <Wrapper>{errorItems}</Wrapper>;
  }
  return null;
}

ErrorList.propTypes = {
  path: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  filter: PropTypes.func,
};

export default ErrorList;
