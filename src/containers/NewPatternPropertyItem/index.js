/**
 *
 * NewPatternPropertyItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { stopPropagation } from '../../utils/generalUtils';
import injectReducer from '../../utils/injectReducer';

import injectSaga from '../../utils/injectSaga';
import {
  generateDefaultValueForProperty,
  generateIdPrefixFromPath,
  genPath,
  getSchemaForPropertyName,
} from '../../utils/schemaUtils';

import AddItemButton from '../../components/AddItemButton';
import CloseButton from '../../components/CloseButton';
import {
  updatePath,
  updateConfigForPath,
} from '../../containers/Editor/actions';
import ErrorMessage from '../../components/ErrorMessage';
import ItemNameWrapper from '../../components/ItemNameWrapper';
import ItemInfoWrapper from '../../components/ItemInfoWrapper';
import { makeSelectSchema as makeSelectRootSchema } from '../../containers/Editor/selectors';

import { changeNewPropertyName } from './actions';
import SubmitButton from './SubmitButton';
import { DOMAIN_NAME } from './constants';
import EditorWrapper from './EditorWrapper';
import Input from './Input';
import messages from './messages';
import PatternItem from './PatternItem';
import PatternList from './PatternList';
import reducer from './reducer';
import saga from './saga';

import { makeSelectNewValue, makeSelectNumMatchingPatterns } from './selectors';
import Wrapper from './Wrapper';
import PatternItemWrapper from './PatternItemWrapper';

export class NewPatternPropertyItem extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onKeyDown = (evt) => {
      if (evt.key === 'Enter' && evt.ctrlKey) {
        this.onSubmit(evt);
      }
    };

    this.onChange = (evt) => {
      stopPropagation(evt);

      const { path, schema, onChange } = this.props;

      onChange(evt.target.value, Object.keys(schema.patternProperties), path);
    };

    // this.onSubmit = (evt) => {};

    this.onAddItemClick = (evt) => {
      stopPropagation(evt);

      const { path, addItem } = this.props;

      addItem(path);
    };
    this.onCancel = (evt) => {
      stopPropagation(evt);

      const { path, onCancel } = this.props;

      onCancel(path);
    };

    this.onSubmit = (evt) => {
      stopPropagation(evt);

      const {
        path,
        schema,
        newName,
        onChange,
        onSubmit,
        onCancel,
        rootSchema,
      } = this.props;

      const newValueSchema = getSchemaForPropertyName(
        schema,
        newName,
        rootSchema,
      );

      const newValueConfig = generateDefaultValueForProperty(
        newValueSchema,
        newName,
      );

      const newPropPath = genPath(newName, path);
      onCancel(path);
      onChange('', Object.keys(schema.patternProperties), path);
      onSubmit(newValueConfig, newPropPath);
      this.props.updatePath(newPropPath);
    };
  }

  checkPattern(pattern) {
    const re = new RegExp(pattern);

    return re.test(this.props.newName);
  }

  renderEditBlock() {
    const {
      show,
      config,
      schema,
      intl,
      newName,
      numMatchingPatterns,
    } = this.props;

    if (!show) {
      return null;
    }

    const patternItems = Object.keys(schema.patternProperties).map((pattern) => {
      const isMatching = this.checkPattern(pattern);

      return (
        <PatternItem key={encodeURIComponent(pattern)}>
          <PatternItemWrapper matching={isMatching}>
            {pattern}
          </PatternItemWrapper>
        </PatternItem>
      );
    });

    let errorMessage =
      numMatchingPatterns > 1
        ? ErrorMessage({
          prefix: (
            <strong>
              <FormattedMessage {...messages.warning} />
            </strong>
            ),
          message: messages.severalMatchesError,
        })
        : null;

    if (!errorMessage) {
      const propertyAlreadyExists = Object.hasOwn(config, newName);
      if (propertyAlreadyExists) {
        errorMessage = ErrorMessage({
          message: messages.duplicatePropNameError,
        });
      }
    }

    return (
      <EditorWrapper>
        <ItemNameWrapper>
          <FormattedMessage {...messages.name} />
        </ItemNameWrapper>
        <form onSubmit={this.onSubmit}>
          <Input
            placeholder={intl.formatMessage(messages.namePlaceholder)}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            autoFocus
            value={newName}
          />
          {errorMessage}
          <ItemInfoWrapper>
            <FormattedMessage {...messages.patterns} />
          </ItemInfoWrapper>
          <PatternList>{patternItems}</PatternList>
          <SubmitButton
            disabled={numMatchingPatterns !== 1 || errorMessage}
            value={intl.formatMessage(messages.save)}
            className={'text-button'}
          />
        </form>
        <CloseButton onClick={this.onCancel} />
      </EditorWrapper>
    );
  }

  render() {
    const { path, schema, show } = this.props;

    if (!schema.patternProperties) {
      return null;
    }

    return (
      <Wrapper key={`${generateIdPrefixFromPath(path)}-pattern-editor`}>
        {this.renderEditBlock()}
        <AddItemButton disabled={show} onClick={this.onAddItemClick} />
      </Wrapper>
    );
  }
}

NewPatternPropertyItem.propTypes = {
  path: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  addItem: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  newName: PropTypes.string.isRequired,
  numMatchingPatterns: PropTypes.number.isRequired,
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]),
  schema: PropTypes.object.isRequired,
  rootSchema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
};

const mapStateToProps = (_state, props) =>
  createStructuredSelector({
    newName: makeSelectNewValue(props.path),
    numMatchingPatterns: makeSelectNumMatchingPatterns(props.path),
    rootSchema: makeSelectRootSchema(),
  });

const mapDispatchToProps = {
  onChange: changeNewPropertyName,
  onSubmit: updateConfigForPath,
  updatePath,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: DOMAIN_NAME, reducer });
const withSaga = injectSaga({ key: DOMAIN_NAME, saga });

export default compose(withReducer, withSaga, withConnect)(
  injectIntl(NewPatternPropertyItem),
);
