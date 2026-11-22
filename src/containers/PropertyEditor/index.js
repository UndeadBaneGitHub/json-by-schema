/**
 *
 * PropertyEditor
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Highlighter from 'react-highlight-words';

import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import { genId, stopPropagation, scrollPanelIntoView } from '../../utils/generalUtils';
import { setValueType, validateConfig } from '../../utils/schemaUtils';

import ValueEditor from '../../components/ValueEditor';
import ErrorMessage from '../../components/ErrorMessage';
import { updateConfigForPath } from '../../containers/Editor/actions';
import ItemNameWrapper from '../../components/ItemNameWrapper';
import ItemInfoWrapper from '../../components/ItemInfoWrapper';
import {
  makeSelectSchema as makeSelectRootSchema,
  makeSelectConfig as makeSelectRootConfig,
} from '../../containers/Editor/selectors';

import { makeSelectNewValue, makeSelectStrNewValue } from './selectors';
import { DOMAIN_NAME } from './constants';
import Wrapper from './Wrapper';
import ValidationErrorsWrapper from './ValidationErrorsWrapper';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { changeNewPropertyValue } from './actions';

export class PropertyEditor extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.getConfigString = (config) => {
      if (
        this.props.jsonEditor ||
        ['object', 'array'].includes(this.props.schema.type)
      ) {
        return JSON.stringify(config, null, 2);
      }
      return config === undefined ? '' : String(config);
    };

    this.onKeyDown = (evt) => {
      if (evt.key === 'Enter' && evt.ctrlKey) {
        this.onSubmit(evt);
      }
    };

    this.onRevert = (evt) => {
      stopPropagation(evt);

      this.props.changeNewPropertyValue(
        this.props.config,
        this.getConfigString(this.props.config),
        this.props.path,
      );
    };

    this.onChange = (evt) => {
      stopPropagation(evt);

      this.props.changeNewPropertyValue(
        processInputValue(evt.target.value, this.props.schema.type),
        evt.target.strValue || this.getConfigString(evt.target.value),
        this.props.path,
      );
    };

    this.onSubmit = (evt) => {
      stopPropagation(evt);

      if (
        (this.props.hasConfigValue &&
          this.props.newValue === this.props.config) ||
        !this.hasValidationErrors()
      ) {
        return;
      }

      this.props.updateConfigForPath(this.props.newValue, this.props.path);
    };
  }

  componentDidMount() {
    this.props.changeNewPropertyValue(
      this.props.config,
      this.getConfigString(this.props.config),
      this.props.path,
    );
    scrollPanelIntoView(this.panelRef);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      this.props.changeNewPropertyValue(
        this.props.config,
        this.getConfigString(this.props.config),
        this.props.path,
      );
      scrollPanelIntoView(this.panelRef);
    }
  }

  validateConfigValue() {
    const {
      newValue,
      schema,
      rootSchema,
      customValidators,
      rootConfig,
      config,
      name,
      path,
    } = this.props;
    const validationResult = validateConfig(newValue, schema, rootSchema);

    let errors = validationResult.errors;

    if (customValidators && customValidators.length) {
      errors = errors.concat(
        this.props.customValidators.reduce((res, validatorFn) => {
          const customValidationResult = validatorFn({
            propertyPath: path, // path to property, from root
            propertyName: name, // property name
            value: config, // property value
            schema, // property schema
            rootSchema, // root level schema
            rootValue: rootConfig, // root level value, can be used to perform complex cross-service validations
          });

          // eslint-disable-next-line no-shadow
          const customValidationErrors = customValidationResult.errors || [];

          if (!customValidationErrors.length) {
            return res;
          }

          return res.concat(customValidationErrors);
        }, []),
      );
    }

    return errors;
  }

  hasValidationErrors() {
    const errors = this.validateConfigValue();

    return !(errors && errors.length);
  }

  renderValidationMessage() {
    const validationErrors = this.validateConfigValue();

    if (validationErrors && validationErrors.length) {
      const res = validationErrors.map((error) => (
        <ErrorMessage
          key={genId()}
          message={{
            ...messages.validationFailed,
            values: { errorMessage: error.toString() },
          }}
        />
      ));
      return (
        <ValidationErrorsWrapper className={'scroll-style'}>
          <FormattedMessage {...messages.validationFailedHeader} />
          {res}
        </ValidationErrorsWrapper>
      );
    }
    return null;
  }

  render() {
    const name = this.props.isArrayItem
      ? this.props.intl.formatMessage(messages.namePrefix) +
        (+this.props.name + 1)
      : this.props.name;

    const schemaDescription = this.props.schema.description;

    return (
      <Wrapper
        ref={(panelRef) => {
          this.panelRef = panelRef;
        }}
        className={'scroll-style'}
        isChild={this.props.isChild}
      >
        <ItemNameWrapper>
          <Highlighter
            caseSensitive={false}
            searchWords={[this.props.parentFilter]}
            textToHighlight={name || ''}
          />
        </ItemNameWrapper>
        <ItemInfoWrapper>
          <FormattedMessage {...messages.type} />
          <span>{this.props.schema.type}</span>
        </ItemInfoWrapper>
        <ItemInfoWrapper>
          <FormattedMessage {...messages.description} />
          <Highlighter
            caseSensitive={false}
            searchWords={schemaDescription ? [this.props.parentFilter] : []}
            textToHighlight={schemaDescription || 'No description was provided'}
          />
        </ItemInfoWrapper>
        <ItemInfoWrapper>
          <FormattedMessage {...messages.value} />
        </ItemInfoWrapper>
        {this.renderValidationMessage()}
        <div>
          <ValueEditor
            value={this.props.newValue}
            strValue={this.props.strNewValue}
            type={this.props.schema.type}
            enum={this.props.schema.enum}
            minimum={this.props.schema.minimum}
            maximum={this.props.schema.maximum}
            multipleOf={this.props.schema.multipleOf}
            jsonEditor={this.props.jsonEditor}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onRevert={this.onRevert}
            onKeyDown={this.onKeyDown}
            disableButtons={{
              revert: this.props.newValue === this.props.config,
              submit:
                (this.props.hasConfigValue &&
                  this.props.newValue === this.props.config) ||
                !this.hasValidationErrors(),
            }}
          />
        </div>
      </Wrapper>
    );
  }
}

PropertyEditor.propTypes = {
  path: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  isArrayItem: PropTypes.bool,
  newValue: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  strNewValue: PropTypes.string,
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  rootConfig: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  schema: PropTypes.object.isRequired,
  rootSchema: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  parentFilter: PropTypes.string.isRequired,
  updateConfigForPath: PropTypes.func.isRequired,
  changeNewPropertyValue: PropTypes.func.isRequired,
  hasConfigValue: PropTypes.bool.isRequired,
  isChild: PropTypes.bool.isRequired,
  jsonEditor: PropTypes.bool,
  customValidators: PropTypes.arrayOf(PropTypes.func),
};

// TODO: Consider moving to the editor component
const processInputValue = (val, type) => {
  let newVal = val;

  if (['object', 'array'].includes(type)) {
    try {
      newVal = JSON.parse(newVal);
    } catch (ex) {
      // do nothing
    }
  }

  return setValueType(newVal, type);
};

const mapStateToProps = createStructuredSelector({
  newValue: makeSelectNewValue(),
  strNewValue: makeSelectStrNewValue(),
  rootSchema: makeSelectRootSchema(),
  rootConfig: makeSelectRootConfig(),
});

const mapDispatchToProps = {
  changeNewPropertyValue,
  updateConfigForPath,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: DOMAIN_NAME, reducer });
const withSaga = injectSaga({ key: DOMAIN_NAME, saga });

export default compose(withReducer, withSaga, withConnect)(
  injectIntl(PropertyEditor),
);
