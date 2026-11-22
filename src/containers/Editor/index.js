/**
 *
 * Editor
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ImmutableProptypes from 'react-immutable-proptypes';
import { List } from 'immutable';

import injectReducer from '../../utils/injectReducer';
import { getSelectedSchema } from '../../utils/schemaUtils';

import ObjectPanel from '../../containers/ObjectPanel/Loadable';
import { makeSelectSchemaIndexes } from '../../containers/ObjectPanel/selectors';

import reducer from './reducer';
import { DOMAIN_NAME } from './constants';
import Wrapper from './Wrapper';
import { initialize, updatePath } from './actions';
import {
  makeSelectDelta,
  makeSelectInitialConfig,
  makeSelectInitialized,
  makeSelectConfig,
  makeSelectSchema,
  makeSelectPath,
} from './selectors';

export class Editor extends React.PureComponent {
  componentDidMount() {
    this.initializeEditor(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.config !== this.props.config ||
      prevProps.schema !== this.props.schema
    ) {
      this.initializeEditor(this.props);
    }

    if (
      this.props.initialized &&
      (prevProps.storedConfig !== this.props.storedConfig ||
        prevProps.delta !== this.props.delta)
    ) {
      if (this.props.onChange) {
        this.props.onChange(this.props.storedConfig, this.props.delta);
      }
    }

    if (
      this.props.onPathChange &&
      prevProps.internalPath !== this.props.internalPath
    ) {
      this.props.onPathChange(this.props.internalPath);
    }
    if (prevProps.path !== this.props.path) {
      this.props.updatePath(this.props.path);
    }
  }

  initializeEditor(props) {
    const { config, schema, path, deltaDepth } = props;

    this.props.initialize(path, config, schema, deltaDepth);
  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      storedConfig,
      initialConfig,
      storedSchema,
      topLevelSchemaIndexes,
      customValidators,
    } = this.props;

    if (!storedSchema || storedSchema !== this.props.schema) {
      // no schema has been stored yet, or it is still an old
      // schema preserved
      return null;
    }

    const selectedSchema = getSelectedSchema(
      storedSchema,
      topLevelSchemaIndexes || List(),
      storedSchema,
    );

    const configPanelProps = {
      initialConfig,
      config: storedConfig,
      schema: selectedSchema,
      customValidators,
      path: '',
      parentPath: '',
      name: '',
    };

    return (
      <Wrapper className={'json-by-schema'}>
        <ObjectPanel {...configPanelProps} />
      </Wrapper>
    );
  }
}

Editor.propTypes = {
  delta: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]),
  initialConfig: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  schema: PropTypes.object.isRequired,
  initialize: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  storedConfig: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  storedSchema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
    .isRequired,
  topLevelSchemaIndexes: PropTypes.oneOfType([
    ImmutableProptypes.list,
    PropTypes.bool,
  ]).isRequired,
  onChange: PropTypes.func,
  initialized: PropTypes.bool.isRequired,
  customValidators: PropTypes.arrayOf(PropTypes.func),
  onPathChange: PropTypes.func,
  path: PropTypes.string,
  internalPath: PropTypes.string.isRequired,
  updatePath: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  storedConfig: makeSelectConfig(),
  initialConfig: makeSelectInitialConfig(),
  storedSchema: makeSelectSchema(),
  topLevelSchemaIndexes: makeSelectSchemaIndexes(),
  delta: makeSelectDelta(),
  initialized: makeSelectInitialized(),
  internalPath: makeSelectPath(),
});

const mapDispatchToProps = {
  initialize,
  updatePath,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: DOMAIN_NAME, reducer });

export default compose(withReducer, withConnect)(Editor);
