/**
 *
 * PropertyListItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Highlighter from 'react-highlight-words';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import ImmutableProptypes from 'react-immutable-proptypes';

import { genId, stopPropagation } from '../../utils/generalUtils';
import {
  genPath,
  getSelectedSchema,
  hasFilter,
  isMultipleChoiceSchema,
} from '../../utils/schemaUtils';

import ErrorMessage from '../../components/ErrorMessage';
import {
  deleteConfigForPath,
  updateConfigForPath,
  updatePath,
} from '../../containers/Editor/actions';
import ListItemWrapper from '../../components/ListItemWrapper';
import ListItemInnerWrapper from '../../components/ListItemInnerWrapper';
import ItemNameWrapper from '../../components/ItemNameWrapper';
import ItemInfoWrapper from '../../components/ItemInfoWrapper';
import { makeSelectSchema as makeSelectRootSchema } from '../../containers/Editor/selectors';
import ValueLine from '../../components/ValueLine';
import DeleteItemButton from '../../components/DeleteItemButton';
import RevertItemButton from '../../components/RevertItemButton';
import ItemButtonsWrapper from '../../components/ItemButtonsWrapper';

import SchemaSelectorsStack from '../../containers/SchemaSelectorsStack';
import UnsavedChangesContext from '../../components/UnsavedChangesContext';

import ValidationErrorsWrapper from './ValidationErrorsWrapper';
import ErrorMessageWrapper from './ErrorMessageWrapper';
import messages from './messages';

export class PropertyListItem extends React.PureComponent {
  static contextType = UnsavedChangesContext;

  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleSchemaSelectChange = this.handleSchemaSelectChange.bind(this);

    this.scrollIntoViewIfNeeded = () => {
      const self = this;
      window.requestAnimationFrame(() => {
        if (!self.mounted) {
          return;
        }
        // eslint-disable-next-line react/no-find-dom-node
        const node = ReactDOM.findDOMNode(self);
        if (node && typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      });
    };

    this.deleteConfig = (evt) => {
      stopPropagation(evt);

      this.props.deleteConfigForPath(this.props.path);
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
    this.mounted = true;
    if (this.props.expanded) {
      this.scrollIntoViewIfNeeded();
    }
  }
  componentDidUpdate() {
    if (this.props.expanded) {
      this.scrollIntoViewIfNeeded();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleClick(evt) {
    stopPropagation(evt);

    this.props.onClick(evt);
  }

  handleSchemaSelectChange(schemaIndexes) {
    if (schemaIndexes !== this.props.schemaIndexes) {
      const { name, parentPath } = this.props;

      const newPath = genPath(name, parentPath, schemaIndexes);
      if (this.context && this.context.guardNavigation) {
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
    if (errors && errors.size) {
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

  renderSchemaInfo() {
    const { filter, name, schema, rootSchema, schemaIndexes } = this.props;

    if (!schema) {
      return (
        <div>
          <ErrorMessage message={messages.noSchemaFound} />
        </div>
      );
    }

    const selectedSchema = getSelectedSchema(schema, schemaIndexes, rootSchema);

    const schemaDescription = selectedSchema.description;

    return (
      <div>
        <ItemInfoWrapper>
          <FormattedMessage {...messages.name} />
          <span>{name}</span>
        </ItemInfoWrapper>
        <ItemInfoWrapper>
          <FormattedMessage {...messages.type} />
          <span>{selectedSchema.type || '--'}</span>
        </ItemInfoWrapper>
        <ItemInfoWrapper>
          <FormattedMessage {...messages.description} />
          <Highlighter
            caseSensitive={false}
            searchWords={schemaDescription ? [filter] : []}
            textToHighlight={schemaDescription || 'No description was provided'}
          />
        </ItemInfoWrapper>
        {this.renderSchemaSelector()}
      </div>
    );
  }
  render() {
    const {
      filter,
      expanded,
      invalid,
      hasConfigValue,
      config,
      schema,
      name,
      title,
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
        onClick={this.handleClick}
        expanded={expanded}
        noSchema={!schema}
      >
        <ListItemInnerWrapper
          className={'hyphenate'}
          expanded={expanded}
          invalid={invalid || !schema}
          empty={!!schema && !hasConfigValue}
          changed={changed}
        >
          <ItemNameWrapper>
            <Highlighter
              caseSensitive={false}
              searchWords={[filter]}
              textToHighlight={title || (name || '')}
            />
          </ItemNameWrapper>
          {this.renderSchemaInfo()}
          <ItemInfoWrapper>
            <ValueLine config={config} schema={schema} />
          </ItemInfoWrapper>
          <ItemButtonsWrapper>
            <DeleteItemButton
              onClick={this.deleteConfig}
              hide={!!schema && !hasConfigValue}
            />
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

PropertyListItem.propTypes = {
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
  schemaIndexes: ImmutableProptypes.list.isRequired,
  errors: ImmutableProptypes.list.isRequired,
  expanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  deleteConfigForPath: PropTypes.func.isRequired,
  updateConfigForPath: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
  hasConfigValue: PropTypes.bool.isRequired,
  hasInitialConfigValue: PropTypes.bool.isRequired,
  rootSchema: PropTypes.object.isRequired,
  changed: PropTypes.bool.isRequired,
  scrollableContainer: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  rootSchema: makeSelectRootSchema(),
});

const mapDispatchToProps = {
  updatePath,
  deleteConfigForPath,
  updateConfigForPath,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(PropertyListItem);
