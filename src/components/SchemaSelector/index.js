/**
 *
 * SchemaSelector
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, FormattedMessage } from 'react-intl';
import Select from 'react-select';

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
  }));
}

function SchemaSelector(props) {
  if (!isMultipleChoiceSchema(props.schema)) {
    return null;
  }

  const idPrefix = generateIdPrefixFromPath(props.path);

  const schemaChoices = getMultipleChoiceSchemaChoices(props.schema);

  const options = renderOptions(props);
  const selectedOption = options.find((opt) => opt.value === props.schemaIndex) || null;

  return (
    <Wrapper key={`${idPrefix}schema-selector`} onClick={stopPropagation}>
      <PrefixWrapper>
        <FormattedMessage {...messages[schemaChoices.type]} />
      </PrefixWrapper>
      <SelectorWrapper>
        <Select
          onChange={(option) => props.onChange(option || { value: -1 })}
          value={selectedOption}
          options={options}
          placeholder={props.intl.formatMessage(messages.unselectedMessage)}
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'var(--jbs-bg)',
              borderColor: 'var(--jbs-border)',
              borderRadius: '10px',
              boxShadow: 'none',
            }),
            menu: (base) => ({
              ...base,
              zIndex: 15,
              backgroundColor: 'var(--jbs-bg)',
              border: '1px solid var(--jbs-border)',
              borderRadius: '10px',
              overflow: 'hidden',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? 'var(--jbs-accent)'
                : state.isFocused
                  ? 'var(--jbs-bg-secondary)'
                  : 'transparent',
              color: state.isSelected ? '#ffffff' : 'var(--jbs-text)',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'var(--jbs-text)',
            }),
            input: (base) => ({
              ...base,
              color: 'var(--jbs-text)',
            }),
          }}
          autoFocus
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
