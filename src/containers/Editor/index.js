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
import { resolveThemeProps } from '../../theme';

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
  constructor(props) {
    super(props);
    let initialDark = false;
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('jbs-dark-mode');
      if (saved !== null) {
        initialDark = saved === 'true';
      } else if (window.matchMedia) {
        initialDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    this.state = {
      internalDarkMode: initialDark,
    };
    this.toggleInternalDarkMode = () => {
      this.setState((prev) => {
        const next = !prev.internalDarkMode;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('jbs-dark-mode', String(next));
        }
        return { internalDarkMode: next };
      });
    };
  }

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

    const themeProps = resolveThemeProps(this.props.theme);
    const isControlled = this.props.darkMode !== undefined;
    const isDark = isControlled
      ? Boolean(this.props.darkMode)
      : this.state.internalDarkMode;
    const rootClassName = isDark ? 'json-by-schema dark' : 'json-by-schema';

    return (
      <Wrapper className={rootClassName} {...themeProps}>
        <ObjectPanel {...configPanelProps} />
        {!isControlled && (
          <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-[var(--jbs-popover-bg)] border border-[var(--jbs-border)] shadow-lg">
            <span className="text-[var(--jbs-text-secondary)] flex items-center" aria-hidden="true">
              {isDark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={this.toggleInternalDarkMode}
              className={`relative inline-flex h-[24px] w-[42px] flex-shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none ${
                isDark ? 'bg-[var(--jbs-switch-on)]' : 'bg-[var(--jbs-switch-off)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  isDark ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}
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
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  darkMode: PropTypes.bool,
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
