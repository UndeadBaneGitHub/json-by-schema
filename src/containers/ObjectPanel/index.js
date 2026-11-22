/**
 *
 * ConfigPanel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import ImmutableProptypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import UnsavedChangesContext from '../../components/UnsavedChangesContext';
import { arrayMove } from '@dnd-kit/sortable';

import {
  getAbsoluteHeight,
  isNumber,
  stopPropagation,
  scrollPanelIntoView,
} from '../../utils/generalUtils';
import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import {
  generateIdPrefixFromPath,
  generatePropertyObject,
  genPath,
  hasFilter,
  inferSchemaIndexes,
  isMultipleChoiceSchema,
  validateConfig,
} from '../../utils/schemaUtils';

import PropertyList from '../../components/PropertyList';
import PropertyListItem from '../../containers/PropertyListItem/Loadable';
import ErrorList from '../../components/ErrorList';

import PropertyEditor from '../../containers/PropertyEditor';
import ArrayItem from '../../containers/ArrayItem/Loadable';
import {
  updatePath,
  updateConfigForPath,
} from '../../containers/Editor/actions';
import NewPatternPropertyItem from '../../containers/NewPatternPropertyItem/Loadable';
import AddItemButton from '../../components/AddItemButton';
import { errorLevels } from '../../components/ErrorListItem';
import EditAsJSONButton from '../../components/EditAsJSONButton';
import {
  makeSelectPath,
  makeSelectSchema as makeSelectRootSchema,
  makeSelectConfig as makeSelectRootConfig,
} from '../../containers/Editor/selectors';
import { SchemaSelectorsStack } from '../../containers/SchemaSelectorsStack';
import ErrorsCount from '../../containers/ObjectPanel/ErrorsCount';

import { DOMAIN_NAME } from './constants';
import {
  makeSelectErrors,
  makeSelectHasBeenInitialized,
  makeSelectLoading,
  makeSelectOpenProperty,
  makeSelectDisplayNewPatternPropertyItem,
  makeSelectSchemaIndexes,
  makeSelectFilter,
  makeSelectFilterWasSet,
  makeSelectEditAsJson,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import Wrapper from './Wrapper';
import SearchForm from './SearchForm';
import FilterInput from './FilterInput';
import ScrollableWrapper from './ScrollableWrapper';
import ResetFilterButton from './ResetFiterButton';
import ErrorsWrapper from './ErrorsWrapper';
import NoItemsElementWrapper from './NoItemsElementWrapper';

import {
  setErrors,
  initializeEditor,
  updateOpenPropertyByPath,
  showNewPatternPropertyItem,
  hideNewPatternPropertyItem,
  setStateConfig,
  changeFilter,
  resetFilter,
  toggleEditAsJson,
} from './actions';
import SchemaSelectorWrapper from './SchemaSelectorWrapper';
import EditAsJSONButtonWrapper from './EditAsJSONButtonWrapper';
import ContentWrapper from './ContentWrapper';

export class ObjectPanel extends React.Component {
  static contextType = UnsavedChangesContext;

  static prefixPath(path, schemaIndexes) {
    if (!path && schemaIndexes && schemaIndexes.size) {
      return `{${schemaIndexes.join(',')}}${path}`;
    }
    return path;
  }

  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.componentsByType = {
      array: ArrayItem,
      object: PropertyListItem,
    };
    this.validationErrorPrefix = 'validation-error';

    this.handleAddItemClick = this.handleAddItemClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleSearchFormClick = this.handleSearchFormClick.bind(this);
    this.handleSchemaSelectChange = this.handleSchemaSelectChange.bind(this);
    this.handleItemsReorder = this.handleItemsReorder.bind(this);

    this.handleEditAsJSONClick = (evt) => {
      stopPropagation(evt);

      const guard = this.context && this.context.guardNavigation;
      const toggle = () => this.props.toggleEditAsJson(this.props.path);
      if (guard) {
        guard(toggle);
      } else {
        toggle();
      }
    };

    this.updateScrollableWrapperPosition = () => {
      const self = this;
      if (self.scrollableWrapper) {
        setTimeout(() => {
          const schemaSelectorWrapperHeight = self.schemaSelectorWrapper
            ? getAbsoluteHeight(self.schemaSelectorWrapper)
            : 0;

          const filterHeight = self.searchForm
            ? getAbsoluteHeight(self.searchForm)
            : 0;

          const errorsHeight = self.errorsList
            ? getAbsoluteHeight(self.errorsList)
            : 0;

          const errorsCountHeight = self.errorsCount
            ? getAbsoluteHeight(self.errorsCount)
            : 0;

          self.scrollableWrapper.style.top = `${schemaSelectorWrapperHeight +
            filterHeight +
            errorsHeight +
            errorsCountHeight}px`;

          const editAsJSONBtnHeight = self.editAsJSONBtn
            ? getAbsoluteHeight(self.editAsJSONBtn)
            : 0;

          self.scrollableWrapper.style.bottom = `${editAsJSONBtnHeight}px`;
        }, 0);
      }
      if (self.jsonEditor) {
        setTimeout(() => {
          const editAsJSONBtnHeight = self.editAsJSONBtn
            ? getAbsoluteHeight(self.editAsJSONBtn)
            : 0;

          self.jsonEditor.style.bottom = `${editAsJSONBtnHeight}px`;
        }, 0);
      }
    };
  }

  componentDidMount() {
    const {
      initialized,
      config,
      initialConfig,
      path,
      schemaIndexes,
      openProperty,
      rootSchema,
    } = this.props;

    if (!initialized) {
      this.props.initializeEditor();
    }

    this.props.setStateConfig(config, initialConfig, path);
    this.validatePanelConfig(this.props);

    if (openProperty) {
      // a remainder here, need to update it

      const genPropObject = {
        ...this.props,
        path: ObjectPanel.prefixPath(path, schemaIndexes),
      };

      const updatedOpenProperty = generatePropertyObject(
        openProperty.name,
        genPropObject,
        rootSchema,
        openProperty.schemaIndexes,
      );
      this.props.updateOpenPropertyByPath(updatedOpenProperty, path);
    }

    this.updateScrollableWrapperPosition();
    window.addEventListener('resize', this.updateScrollableWrapperPosition);
    if (this.props.isChild) {
      scrollPanelIntoView(this.panelRef);
    }
  }

  componentDidUpdate(prevProps) {
    const { config, openProperty, rootSchema } = this.props;

    if (prevProps.config !== config) {
      this.props.setStateConfig(
        this.props.config,
        this.props.initialConfig,
        this.props.path,
      );

      this.validatePanelConfig(this.props);

      if (openProperty) {
        const genPropObj = {
          ...this.props,
          schema: this.props.schema,
          path: ObjectPanel.prefixPath(this.props.path, this.props.schemaIndexes),
        };

        const nextOpenProperty = generatePropertyObject(
          openProperty.name,
          genPropObj,
          rootSchema,
          openProperty.schemaIndexes,
        );
        this.props.updateOpenPropertyByPath(nextOpenProperty, this.props.path);
      }
    }

    if (
      (this.props.isChild && prevProps.path !== this.props.path) ||
      (!prevProps.editAsJSON && this.props.editAsJSON)
    ) {
      scrollPanelIntoView(this.panelRef);
    }

    this.updateScrollableWrapperPosition();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScrollableWrapperPosition);
  }

  getFilter() {
    return (
      (this.props.filterWasSet ? this.props.filter : this.props.parentFilter) ||
      ''
    );
  }

  getValidationErrorName(propName) {
    return `${this.validationErrorPrefix}-${this.getValidationPropName(
      propName,
    )}`;
  }

  getValidationPropName(propName) {
    if (isNumber(propName)) {
      return this.props.intl.formatMessage(messages.item, {
        propName: +propName + 1,
      });
    }
    return propName;
  }

  getItemErrors(propName, errors) {
    return errors.get(this.getValidationErrorName(propName)) || List();
  }

  getErrorsCount() {
    const { errors } = this.props;
    if (!errors || !errors.size) {
      return 0;
    }
    return errors.keySeq().reduce((res, key) => {
      const errorsList = errors.get(key);

      if (errorsList) {
        return res + errors.get(key).size;
      }
      return res;
    }, 0);
  }

  genPathFromError(error) {
    if (!error) {
      return error;
    }

    const ownPath = this.props.path;

    const splitAndEncoded = error.property
      .split(/\.|\["?|"?]/g)
      .map((item) => encodeURIComponent(item));

    splitAndEncoded[0] = ownPath.replace(/\/$/, '');

    if (error.argument) {
      splitAndEncoded.push(encodeURIComponent(error.argument));
    }

    return splitAndEncoded.filter((item) => item).join('/');
  }

  validatePanelConfig(props) {
    const { name, config, schema, rootSchema, rootConfig, path } = props;

    let errors = props.errors;

    errors.keySeq().forEach((errorKey) => {
      if (errorKey.startsWith(this.validationErrorPrefix)) {
        errors = errors.set(errorKey, false);
      }
    });

    const configValidationResult = validateConfig(config, schema, rootSchema);
    const validationErrors = configValidationResult.errors || [];
    const ownValidationErrorName = this.getValidationErrorName('this');

    const propNameRe = new RegExp(/^instance[.[]?(\w+)(\.|]|\[|$)/);
    validationErrors.forEach((error) => {
      if (error.property === 'instance') {
        const curErrors = errors.get(ownValidationErrorName) || new List();

        const errorPropPath = this.genPathFromError(error);

        errors = errors.set(
          ownValidationErrorName,
          curErrors.push({
            level: errorLevels.error,
            message: this.props.intl.formatMessage(
              messages.ownValidationFailedPrefix,
              { message: error.message },
            ),
            rawMessage: error.message,
            onClick: this.handleErrorClick.bind(this, errorPropPath),
          }),
        );
      } else {
        const match = error.property.match(propNameRe);
        if (!match) {
          return;
        }

        const propName = match[1];

        const curErrors =
          errors.get(this.getValidationErrorName(propName)) || new List();

        const errorPropPath = this.genPathFromError(error);

        errors = errors.set(
          this.getValidationErrorName(propName),
          curErrors.push({
            level: errorLevels.error,
            message: this.props.intl.formatMessage(
              messages.validationFailedPrefix,
              {
                propName: this.getValidationPropName(propName),
                message: error.message,
              },
            ),
            rawMessage: error.message,
            onClick: this.handleErrorClick.bind(this, errorPropPath),
          }),
        );
      }
    });

    // time for custom validators
    if (this.props.customValidators && this.props.customValidators.length) {
      const customValidationErrors = this.props.customValidators.reduce(
        (res, validatorFn) => {
          const validationResult = validatorFn({
            propertyPath: path, // path to property, from root
            propertyName: name, // property name
            value: config, // property value
            schema, // property schema
            rootSchema, // root level schema
            rootValue: rootConfig, // root level value, can be used to perform complex cross-service validations
          });

          // eslint-disable-next-line no-shadow
          const validationErrors = validationResult.errors || [];

          if (!validationErrors.length) {
            return res;
          }

          return res.concat(validationErrors);
        },
        [],
      );

      customValidationErrors.forEach((error) => {
        if (!error.propertyName) {
          const curErrors = errors.get(ownValidationErrorName) || new List();

          const errorPropPath = error.propertyPath;

          errors = errors.set(
            ownValidationErrorName,
            curErrors.push({
              level: errorLevels.error,
              message: this.props.intl.formatMessage(
                messages.ownValidationFailedPrefix,
                { message: error.message },
              ),
              rawMessage: error.message,
              onClick: this.handleErrorClick.bind(this, errorPropPath),
            }),
          );
        } else {
          const propName = error.propertyName;

          const curErrors =
            errors.get(this.getValidationErrorName(propName)) || new List();

          const errorPropPath = error.propertyPath;

          errors = errors.set(
            this.getValidationErrorName(propName),
            curErrors.push({
              level: errorLevels.error,
              message: this.props.intl.formatMessage(
                messages.validationFailedPrefix,
                {
                  propName: this.getValidationPropName(propName),
                  message: error.message,
                },
              ),
              rawMessage: error.message,
              onClick: this.handleErrorClick.bind(this, errorPropPath),
            }),
          );
        }
      });
    }

    if (errors !== props.errors) {
      this.props.setErrors(errors, path);
    }
  }

  safeUpdatePath(nextPath) {
    if (this.context && this.context.guardNavigation) {
      this.context.guardNavigation(() => this.props.updatePath(nextPath));
    } else {
      this.props.updatePath(nextPath);
    }
  }

  handleErrorClick(path, evt) {
    stopPropagation(evt);

    if (this.props.configEditorPath !== path) {
      this.safeUpdatePath(path);
    }
  }

  handleItemClick(propName, evt) {
    stopPropagation(evt);

    const { schemaIndexes, path, openProperty, rootSchema } = this.props;

    const prefixedPath = ObjectPanel.prefixPath(path, schemaIndexes);

    if (openProperty && String(propName) === openProperty.name) {
      // just close it
      this.safeUpdatePath(prefixedPath);
      return;
    }

    const genPropConfig = {
      ...this.props,
      path: prefixedPath,
    };

    let property = generatePropertyObject(propName, genPropConfig, rootSchema);

    if (!property) {
      // do nothing, the generation failed for it
      return;
    }

    if (isMultipleChoiceSchema(property.schema)) {
      // let's try to find one
      const schemaInferenceProps = {
        config: property.config,
        schema: property.schema,
      };
      const inferredSchemaIndexes = inferSchemaIndexes(
        schemaInferenceProps,
        rootSchema,
      );

      if (inferredSchemaIndexes.size) {
        property = generatePropertyObject(
          propName,
          genPropConfig,
          rootSchema,
          inferredSchemaIndexes,
        );
      }
    }

    if (this.props.configEditorPath !== property.path) {
      this.safeUpdatePath(property.path);
    }
  }

  handleAddItemClick(evt) {
    stopPropagation(evt);

    const { config, path, schemaIndexes, rootSchema } = this.props;

    const prefixedPath = ObjectPanel.prefixPath(path, schemaIndexes);

    // we always generate a new array
    // TODO: consider replacing with Immutable.List
    const genPropConfig = {
      ...this.props,
      path: prefixedPath,
    };

    const assuredConfig = config || [];

    const property = generatePropertyObject(
      assuredConfig.length,
      genPropConfig,
      rootSchema,
    );
    const newConfig = assuredConfig.concat([property.config]);

    this.props.updateConfigForPath(newConfig, path);
    this.props.updatePath(property.path);
  }

  handleItemsReorder({ oldIndex, newIndex }) {
    const { config, path } = this.props;

    this.props.updatePath(this.props.path);

    const assuredConfig = config || [];

    const newConfig = arrayMove(assuredConfig, oldIndex, newIndex);

    this.props.updateConfigForPath(newConfig, path);
  }

  handleRemoveItemClick(propName, evt) {
    stopPropagation(evt);

    const { config, schema, path, schemaIndexes } = this.props;

    const prefixedPath = ObjectPanel.prefixPath(path, schemaIndexes);

    if (!this.props.config) {
      // no op
      return;
    }

    let newConfig;

    switch (schema.type) {
      case 'object': {
        newConfig = { ...config };
        delete newConfig[propName];
        break;
      }
      case 'array': {
        newConfig = [...config];
        newConfig = newConfig.filter((_, pos) => pos !== propName);
        break;
      }
      default:
        break;
    }

    this.props.updateConfigForPath(newConfig, prefixedPath);

    if (this.props.configEditorPath !== prefixedPath) {
      this.props.updatePath(prefixedPath);
    }
  }

  handleFilterChange(evt) {
    stopPropagation(evt);

    this.props.changeFilter(evt.target.value, this.props.path);
  }
  handleFilterClick(evt) {
    stopPropagation(evt);

    if (!this.props.filterWasSet) {
      this.props.changeFilter('', this.props.path);
    }
  }

  handleSearchFormClick(evt) {
    stopPropagation(evt);

    if (this.filterInput) {
      if (!this.props.filterWasSet) {
        this.props.changeFilter('', this.props.path);
      }

      this.filterInput.focus();
    }
  }

  handleFilterReset(evt) {
    stopPropagation(evt);

    this.props.resetFilter(this.props.path);
  }

  handleSchemaSelectChange(schemaIndexes) {
    if (schemaIndexes !== this.props.schemaIndexes) {
      const { name, parentPath } = this.props;

      const newPath = genPath(name, parentPath, schemaIndexes);
      this.safeUpdatePath(newPath);
    }
  }

  extractItems() {
    const { path, schema, schemaIndexes, config } = this.props;

    const prefixedPath = ObjectPanel.prefixPath(path, schemaIndexes);

    const genPropObject = {
      ...this.props,
      path: prefixedPath,
    };

    const idPrefix = generateIdPrefixFromPath(prefixedPath);

    let res;
    switch (schema.type) {
      case 'object': {
        const propNames = this.extractPropNames(genPropObject.schema, config);

        res = Object.keys(propNames).reduce(
          (arr, propName) =>
            arr.concat([this.genItem(propName, genPropObject, idPrefix)]),
          [],
        );
        break;
      }
      case 'array': {
        res =
          config.map((item, index) =>
            this.genItem(index, genPropObject, idPrefix),
          ) || [];
        break;
      }
      default:
        res = [];
        break;
    }

    return res.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  genItem(propName, genPropObject, idPrefix) {
    const {
      openProperty,
      errors,
      path,
      rootSchema,
      schemaIndexes,
    } = this.props;

    const strPropName = String(propName);

    const propertyObject = generatePropertyObject(
      propName,
      genPropObject,
      rootSchema,
    );

    const itemErrors = this.getItemErrors(propName, errors);

    let propConfig = propertyObject ? propertyObject.config : false;
    const propInitialConfig = propertyObject
      ? propertyObject.initialConfig
      : false;
    const propSchema = propertyObject ? propertyObject.schema : false;
    const propHasConfig = propertyObject
      ? propertyObject.hasConfigValue
      : false;
    const propHasInitialConfig = propertyObject
      ? propertyObject.hasInitialConfigValue
      : false;

    const propSchemaIndexes =
      openProperty.name === strPropName
        ? openProperty.schemaIndexes || List()
        : List();

    // There might not be a property object, as there is no schema.
    // So, we would attempt to get config value directly
    if (
      genPropObject.config &&
      {}.hasOwnProperty.call(genPropObject.config, propName)
    ) {
      propConfig = genPropObject.config[propName];
    }

    const propChanged = propertyObject ? propertyObject.changed : false;

    return {
      id: idPrefix + strPropName,
      title: propSchema ? propSchema.title : undefined,
      name: strPropName,
      path: genPath(strPropName, path),
      parentPath: ObjectPanel.prefixPath(path, schemaIndexes),
      config: propConfig,
      initialConfig: propInitialConfig,
      schema: propSchema,
      onClick: this.handleItemClick.bind(this, propName),
      onRemove: this.handleRemoveItemClick.bind(this, propName),
      expanded:
        !this.props.displayNewPatternPropertyItem &&
        strPropName === openProperty.name,
      schemaIndexes: propSchemaIndexes,
      invalid: !!errors.get(this.getValidationErrorName(propName)),
      errors: itemErrors,
      filter: this.getFilter(),
      hasConfigValue: propHasConfig,
      hasInitialConfigValue: propHasInitialConfig,
      changed: propChanged,
      scrollableContainer: this.scrollableWrapper,
    };
  }

  extractPropNames(schema, config) {
    const propNames = {};

    if (schema.properties) {
      Object.keys(schema.properties).forEach((propName) => {
        propNames[propName] = true;
      });
    }
    Object.keys(config).forEach((propName) => {
      propNames[propName] = true;
    });
    return propNames;
  }

  renderChildren() {
    const { schema, openProperty, customValidators } = this.props;

    // if no schema is available yet,
    // most likely a case of oneOf/anyOf

    if (this.props.displayNewPatternPropertyItem) {
      return null;
    }

    if (openProperty && openProperty.schema.type) {
      const configPanelProps = {
        ...openProperty,
        isChild: true,
        isArrayItem: schema.type === 'array',
        customValidators,
        parentFilter: this.getFilter(),
      };

      switch (openProperty.schema.type) {
        case 'array':
        case 'object': {
          return (
            <div key={`child-object-panel-${openProperty.id}`}>
              <ConnectedObjectPanel {...configPanelProps} />
            </div>
          );
        }
        default: {
          return (
            <div key={`child-object-panel-${openProperty.id}`}>
              <PropertyEditor {...configPanelProps} />
            </div>
          );
        }
      }
    }

    return null;
  }

  renderNoItemsElement() {
    const { config, title, name, schema } = this.props;

    const filter = this.getFilter();

    if (filter && !hasFilter(filter, title, name, config, schema)) {
      return (
        <NoItemsElementWrapper>
          <FormattedMessage {...messages.noItemsFound} />
        </NoItemsElementWrapper>
      );
    }
    return null;
  }

  renderSchemaSelector() {
    // we render schema selector ONLY if
    // it's a schema with oneOf/anyOf AND
    // it is top level (meaning, no schema.type
    // available
    const { schema, schemaIndexes, path, rootSchema } = this.props;

    if (!path && isMultipleChoiceSchema(schema)) {
      const schemaSelectorProps = {
        schema,
        schemaIndexes,
        path,
        onChange: this.handleSchemaSelectChange,
        rootSchema,
      };

      return (
        <SchemaSelectorWrapper
          ref={(schemaSelectorWrapper) => {
            this.schemaSelectorWrapper = schemaSelectorWrapper;
          }}
        >
          <SchemaSelectorsStack {...schemaSelectorProps} />
        </SchemaSelectorWrapper>
      );
    }

    return null;
  }

  render() {
    const {
      path,
      config,
      schema,
      schemaIndexes,
      intl,
      errors,
      displayNewPatternPropertyItem,
      filter,
      parentFilter,
      filterWasSet,
      editAsJSON,
    } = this.props;

    let items = [];
    // patternPropertyItems = [];

    if (schema) {
      items = this.extractItems();
    } else {
      this.props.setErrors(
        {
          ...errors,
          'no-schema': {
            level: errorLevels.error,
            message: intl.formatMessage(messages.noSchemaFound),
          },
        },
        this.props.path,
      );
    }

    const propertyProps = {
      items,
      component: this.componentsByType[schema.type],
      onSortEnd: this.handleItemsReorder,
    };

    const newPatternPropertyProps = {
      path,
      config,
      schema,
      show: displayNewPatternPropertyItem,
      addItem: this.props.showNewPatternPropertyItem,
      onCancel: this.props.hideNewPatternPropertyItem,
    };

    const propertyEditorProps = {
      ...this.props,
      isChild: false,
      isArrayItem: schema.type === 'array',
      parentFilter: this.getFilter(),
      hasConfigValue: true,
      jsonEditor: true,
    };

    const ownErrorsCount = this.getErrorsCount();

    return (
      <Wrapper
        ref={(panelRef) => {
          this.panelRef = panelRef;
        }}
        isChild={this.props.isChild}
        isJSONMode={this.props.editAsJSON}
      >
        {editAsJSON ? null : (
          <ContentWrapper>
            {this.renderSchemaSelector()}
            <SearchForm
              onClick={this.handleSearchFormClick}
              ref={(searchForm) => {
                this.searchForm = searchForm;
              }}
            >
              <FilterInput
                type="text"
                ref={(filterInput) => {
                  this.filterInput = filterInput;
                }}
                placeholder={
                  parentFilter && !filterWasSet
                    ? `${intl.formatMessage(messages.parentFilter)}${
                        parentFilter
                      }`
                    : intl.formatMessage(messages.filter)
                }
                value={!filterWasSet ? '' : filter}
                onChange={this.handleFilterChange}
                onClick={this.handleFilterClick}
              />
              <ResetFilterButton onClick={this.handleFilterReset} />
            </SearchForm>
            {ownErrorsCount ? (
              <ErrorsCount
                ref={(errorsCount) => {
                  this.errorsCount = errorsCount;
                }}
              >
                <FormattedMessage {...messages.errorsCount} />
                {ownErrorsCount}
              </ErrorsCount>
            ) : null}
            {ownErrorsCount ? (
              <ErrorsWrapper
                className={'scroll-style'}
                ref={(errorsList) => {
                  this.errorsList = errorsList;
                }}
              >
                <ErrorList errors={errors} path={path} />
              </ErrorsWrapper>
            ) : null}
            <ScrollableWrapper
              className={'clearfix scroll-style'}
              ref={(scrollableWrapper) => {
                this.scrollableWrapper = scrollableWrapper;
              }}
            >
              <PropertyList
                key={`${generateIdPrefixFromPath(path)}${schemaIndexes}`}
                {...propertyProps}
              />
              {this.renderNoItemsElement()}
              <NewPatternPropertyItem {...newPatternPropertyProps} />
              <AddItemButton
                hide={!schema || schema.type !== 'array'}
                onClick={this.handleAddItemClick}
              />
            </ScrollableWrapper>
            {this.renderChildren()}
          </ContentWrapper>
        )}
        {editAsJSON ? (
          <ContentWrapper
            ref={(jsonEditor) => {
              this.jsonEditor = jsonEditor;
            }}
          >
            <PropertyEditor {...propertyEditorProps} />
          </ContentWrapper>
        ) : null}
        <EditAsJSONButtonWrapper
          ref={(editAsJSONBtn) => {
            this.editAsJSONBtn = editAsJSONBtn;
          }}
        >
          <EditAsJSONButton
            showStop={editAsJSON}
            onClick={this.handleEditAsJSONClick}
          />
        </EditAsJSONButtonWrapper>
      </Wrapper>
    );
  }
}

ObjectPanel.propTypes = {
  initialized: PropTypes.bool.isRequired,
  isChild: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  title: PropTypes.string,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  parentPath: PropTypes.string.isRequired,
  configEditorPath: PropTypes.string.isRequired,
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  initialConfig: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  schemaIndexes: ImmutableProptypes.list.isRequired,
  displayNewPatternPropertyItem: PropTypes.bool.isRequired,
  showNewPatternPropertyItem: PropTypes.func.isRequired,
  hideNewPatternPropertyItem: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  rootSchema: PropTypes.object.isRequired,
  errors: ImmutableProptypes.map,
  openProperty: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  initializeEditor: PropTypes.func.isRequired,
  setStateConfig: PropTypes.func.isRequired,
  updateOpenPropertyByPath: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  updateConfigForPath: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  parentFilter: PropTypes.string,
  changeFilter: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  filterWasSet: PropTypes.bool.isRequired,
  editAsJSON: PropTypes.bool.isRequired,
  toggleEditAsJson: PropTypes.func.isRequired,
  customValidators: PropTypes.arrayOf(PropTypes.func),
};

const mapStateToProps = (state, props) =>
  createStructuredSelector({
    initialized: makeSelectHasBeenInitialized(),
    loading: makeSelectLoading(props.path),
    errors: makeSelectErrors(props.path),
    displayNewPatternPropertyItem: makeSelectDisplayNewPatternPropertyItem(
      props.path,
    ),
    schemaIndexes: makeSelectSchemaIndexes(props.path),
    openProperty: makeSelectOpenProperty(props.path),
    filter: makeSelectFilter(props.path),
    filterWasSet: makeSelectFilterWasSet(props.path),
    editAsJSON: makeSelectEditAsJson(props.path),
    configEditorPath: makeSelectPath(),
    rootSchema: makeSelectRootSchema(),
    rootConfig: makeSelectRootConfig(),
  });

const mapDispatchToProps = {
  initializeEditor,
  setStateConfig,
  updateOpenPropertyByPath,
  setErrors,
  updatePath,
  updateConfigForPath,
  showNewPatternPropertyItem,
  hideNewPatternPropertyItem,
  changeFilter,
  resetFilter,
  toggleEditAsJson,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const ConnectedObjectPanel = withConnect(injectIntl(ObjectPanel));

const withReducer = injectReducer({ key: DOMAIN_NAME, reducer });
const withSaga = injectSaga({ key: DOMAIN_NAME, saga });

export default compose(withReducer, withSaga, withConnect)(
  injectIntl(ObjectPanel),
);
