/**
 *
 * SchemaSelector
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, FormattedMessage } from 'react-intl';
import IosSelect from '../IosSelect';

import {
  generateIdPrefixFromPath,
  getMultipleChoiceSchemaChoices,
  isMultipleChoiceSchema,
} from '../../utils/schemaUtils';
import { stopPropagation } from '../../utils/generalUtils';

import messages from './messages';
import Wrapper from './Wrapper';
import PrefixWrapper from './PrefixWrapper';
import SelectorWrapper from './SelectorWrapper';

function getSchemaTitle(schema, index, intl) {
  return schema.title || `${intl.formatMessage(messages.titlePrefix)}${index}`;
}

function renderOptions(props) {
  const schemaChoices = getMultipleChoiceSchemaChoices(props.schema);

  return schemaChoices.value.map((schema, index) => ({
    value: index,
    label: getSchemaTitle(schema, index, props.intl),
    disabled: schemaChoices.value.length > 1 && schema && schema.type === 'null',
  }));
}

function SchemaSelector(props) {
  if (!isMultipleChoiceSchema(props.schema)) {
    return null;
  }

  const idPrefix = generateIdPrefixFromPath(props.path);

  const schemaChoices = getMultipleChoiceSchemaChoices(props.schema);

  const options = renderOptions(props);

  return (
    <Wrapper key={`${idPrefix}schema-selector`} onClick={stopPropagation}>
      <PrefixWrapper>
        <FormattedMessage {...messages[schemaChoices.type]} />
      </PrefixWrapper>
      <SelectorWrapper>
        <IosSelect
          onChange={(option) => props.onChange(option || { value: -1 })}
          value={props.schemaIndex}
          options={options}
          placeholder={props.intl.formatMessage(messages.unselectedMessage)}
          isClearable
        />
      </SelectorWrapper>
    </Wrapper>
  );
}

SchemaSelector.propTypes = {
  schema: PropTypes.object.isRequired,
  schemaIndex: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

renderOptions.propTypes = {
  schema: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

getSchemaTitle.propTypes = {
  schema: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SchemaSelector);
