/**
 *
 * ArrayItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { genId, stopPropagation } from '../../utils/generalUtils';
import {
  genPath,
  getConfigForPropertyName,
  hasFilter,
  isMultipleChoiceSchema,
} from '../../utils/schemaUtils';

import {
  updatePath,
  updateConfigForPath,
  deleteConfigForPath,
} from '../../containers/Editor/actions';

import ErrorMessage from '../../components/ErrorMessage';
import ListItemWrapper from '../../components/ListItemWrapper';
import ListItemInnerWrapper from '../../components/ListItemInnerWrapper';
import ItemInfoWrapper from '../../components/ItemInfoWrapper';
import ValueLine from '../../components/ValueLine/index';
import ItemNameWrapper from '../../components/ItemNameWrapper';
import SchemaSelectorsStack from '../../containers/SchemaSelectorsStack';
import UnsavedChangesContext from '../../components/UnsavedChangesContext';
import ItemButtonsWrapper from '../../components/ItemButtonsWrapper';
import RevertItemButton from '../../components/RevertItemButton';
import { makeSelectSchema as makeSelectRootSchema } from '../../containers/Editor/selectors';

import ValidationErrorsWrapper from './ValidationErrorsWrapper';
import ErrorMessageWrapper from './ErrorMessageWrapper';
import RemoveButton from './RemoveButton';
import messages from './messages';
import DragHandle from './DragHandle';

export class ArrayItem extends React.PureComponent {
  static contextType = UnsavedChangesContext;

  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.itemRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleSchemaSelectChange = this.handleSchemaSelectChange.bind(this);

    this.scrollIntoViewIfNeeded = () => {
      const self = this;
      window.requestAnimationFrame(() => {
        if (!self.mounted) {
          return;
        }
        const node = self.itemRef.current;
        if (node && typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      });
    };

    this.revertConfigChanges = (evt) => {
      stopPropagation(evt);

      const {
        initialConfig,
        path,
        changed,
        hasInitialConfigValue,
      } = this.props;
      if (!changed) {
        return;
      }

      if (hasInitialConfigValue) {
        this.props.updateConfigForPath(initialConfig, path);
      } else {
        this.props.deleteConfigForPath(path);
      }
    };
  }

  componentDidMount() {
    this.updateConfigForPathIfNecessary(this.props);
    if (this.props.expanded) {
      this.scrollIntoViewIfNeeded();
    }
    this.mounted = true;
  }

  componentDidUpdate() {
    this.updateConfigForPathIfNecessary(this.props);
    if (this.props.expanded) {
      this.scrollIntoViewIfNeeded();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateConfigForPathIfNecessary(props) {
    const { hasConfigValue, schema, name, path, schemaIndexes } = props;

    if (schemaIndexes !== this.props.schemaIndexes) {
      if (!hasConfigValue && schemaIndexes.size) {
        // this is a null/undefined value
        // this, in turn, means, that we can try
        // to regenerate config value, based on
        // selected schema
        const newConfigValue = getConfigForPropertyName({}, schema, name);

        this.props.updateConfigForPath(newConfigValue, path);
      }
    }
  }

  handleClick(evt) {
    stopPropagation(evt);

    this.props.onClick(evt);
  }

  handleSchemaSelectChange(schemaIndexes) {
    if (schemaIndexes !== this.props.schemaIndexes) {
      const { name, parentPath } = this.props;

      const newPath = genPath(name, parentPath, schemaIndexes);
      if (this.context?.guardNavigation) {
        this.context.guardNavigation(() => this.props.updatePath(newPath));
      } else {
        this.props.updatePath(newPath);
      }
    }
  }

  renderSchemaSelector() {
    // we render schema selector ONLY if
    // it's a schema with oneOf/anyOf AND
    // it is top level (meaning, no schema.type
    // available
    const { expanded, schema, schemaIndexes, path, rootSchema } = this.props;

    if (expanded && isMultipleChoiceSchema(schema)) {
      const schemaSelectorProps = {
        schema,
        schemaIndexes,
        path,
        onChange: this.handleSchemaSelectChange,
        rootSchema,
      };

      return <SchemaSelectorsStack {...schemaSelectorProps} />;
    }

    return null;
  }

  renderErrors() {
    const { path, errors } = this.props;
    if (errors?.size) {
      const res = errors.map((error) => (
        <ErrorMessageWrapper key={`${path}_${genId()}`}>
          <ErrorMessage
            message={{
              ...messages.validationFailed,
              values: { errorMessage: error.rawMessage },
            }}
          />
        </ErrorMessageWrapper>
      ));
      return <ValidationErrorsWrapper>{res}</ValidationErrorsWrapper>;
    }
    return null;
  }

  render() {
    const {
      onClick,
      onRemove,
      expanded,
      title,
      name,
      invalid,
      config,
      schema,
      filter,
      hasConfigValue,
      changed,
    } = this.props;

    if (
      !this.props.expanded &&
      !hasFilter(filter, title, name, config, schema)
    ) {
      return null;
    }

    return (
      <ListItemWrapper
        ref={this.itemRef}
        onClick={onClick}
        expanded={expanded}
        noSchema={!schema}
      >
        <ListItemInnerWrapper
          className={'hyphenate'}
          expanded={expanded}
          invalid={invalid || !schema}
          empty={!hasConfigValue}
          changed={changed}
        >
          {title ? (
            <ItemNameWrapper>{title}</ItemNameWrapper>
          ) : (
            <ItemNameWrapper>
              <FormattedMessage {...messages.item} />
              {+name + 1}
            </ItemNameWrapper>
          )}
          {title ? (
            <ItemInfoWrapper>
              <FormattedMessage {...messages.item} />
              {+name + 1}
            </ItemInfoWrapper>
          ) : null}
          <ItemInfoWrapper>
            <ValueLine config={config} schema={schema} />
          </ItemInfoWrapper>
          <div>{this.renderSchemaSelector()}</div>
          <DragHandle />
          <RemoveButton onClick={onRemove} />
          <ItemButtonsWrapper>
            <RevertItemButton
              onClick={this.revertConfigChanges}
              hide={!changed}
            />
          </ItemButtonsWrapper>
          {this.renderErrors()}
        </ListItemInnerWrapper>
      </ListItemWrapper>
    );
  }
}

ArrayItem.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string.isRequired,
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]),
  initialConfig: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]),
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  path: PropTypes.string.isRequired,
  parentPath: PropTypes.string.isRequired,
  schemaIndexes: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  updateConfigForPath: PropTypes.func.isRequired,
  deleteConfigForPath: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
  hasConfigValue: PropTypes.bool.isRequired,
  hasInitialConfigValue: PropTypes.bool.isRequired,
  rootSchema: PropTypes.object.isRequired,
  changed: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  scrollableContainer: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  rootSchema: makeSelectRootSchema(),
});

const mapDispatchToProps = {
  updateConfigForPath,
  deleteConfigForPath,
  updatePath,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ArrayItem);
