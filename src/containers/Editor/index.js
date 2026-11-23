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
import { List } from 'immutable';
import { AlertDialog } from '@base-ui/react/alert-dialog';
import { Switch } from '@base-ui/react/switch';

import injectReducer from '../../utils/injectReducer';
import { getSelectedSchema } from '../../utils/schemaUtils';
import {
  normalizeFormat,
  parseStructuredValue,
  stringifyStructuredValue,
} from '../../utils/formatUtils';
import { resolveThemeProps } from '../../theme';
import UnsavedChangesContext from '../../components/UnsavedChangesContext';

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
    this.unsavedState = { hasUnsaved: false, discard: null };
    this.rootRef = React.createRef();
    this.state = {
      internalDarkMode: initialDark,
      pendingNavigation: null,
    };
    this.setUnsavedState = (hasUnsaved, discard) => {
      this.unsavedState = { hasUnsaved, discard };
    };
    this.guardNavigation = (fn) => {
      if (this.unsavedState.hasUnsaved) {
        this.setState({ pendingNavigation: fn });
      } else {
        fn();
      }
    };
    this.handleProceedAndUndo = () => {
      const { pendingNavigation } = this.state;
      if (this.unsavedState.discard) {
        this.unsavedState.discard();
      }
      this.unsavedState = { hasUnsaved: false, discard: null };
      this.setState({ pendingNavigation: null }, () => {
        if (pendingNavigation) pendingNavigation();
      });
    };
    this.handleCancelNavigation = () => {
      this.setState({ pendingNavigation: null });
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
        const format = this.getResolvedFormat();
        const formatted = stringifyStructuredValue(
          this.props.storedConfig,
          format,
        );
        if (typeof this.props.config === 'string') {
          this.props.onChange(
            formatted,
            this.props.delta,
            this.props.storedConfig,
          );
        } else {
          this.props.onChange(
            this.props.storedConfig,
            this.props.delta,
            formatted,
          );
        }
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

  getResolvedFormat(props = this.props) {
    return normalizeFormat(props.format);
  }

  getResolvedSchema(props = this.props) {
    const { schema } = props;
    if (typeof schema === 'string') {
      try {
        return parseStructuredValue(schema, this.getResolvedFormat(props));
      } catch (e) {
        return null;
      }
    }
    return schema;
  }

  getResolvedConfig(props = this.props) {
    const { config } = props;
    if (typeof config === 'string') {
      try {
        return parseStructuredValue(config, this.getResolvedFormat(props));
      } catch (e) {
        return undefined;
      }
    }
    return config;
  }

  initializeEditor(props) {
    const { path, deltaDepth } = props;
    const resolvedConfig = this.getResolvedConfig(props);
    const resolvedSchema = this.getResolvedSchema(props);
    if (!resolvedSchema) {
      return;
    }

    this.props.initialize(path, resolvedConfig, resolvedSchema, deltaDepth);
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

    if (!storedSchema) {
      // no schema has been stored yet
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

    const { className: themeClassName, ...themeProps } = resolveThemeProps(
      this.props.theme,
    );
    const isControlled = this.props.darkMode !== undefined;
    const isDark = isControlled
      ? Boolean(this.props.darkMode)
      : this.state.internalDarkMode;
    const rootClassName = [
      'json-by-schema',
      'jbs-root',
      themeClassName,
      isDark ? 'dark' : '',
      this.props.className || '',
    ]
      .filter(Boolean)
      .join(' ');
    const format = this.getResolvedFormat();

    return (
      <UnsavedChangesContext.Provider
        value={{
          setUnsavedState: this.setUnsavedState,
          guardNavigation: this.guardNavigation,
          format,
        }}
      >
        <Wrapper ref={this.rootRef} className={rootClassName} {...themeProps}>
          <ObjectPanel {...configPanelProps} />
          <AlertDialog.Root
            open={Boolean(this.state.pendingNavigation)}
            onOpenChange={(open) => {
              if (!open) this.handleCancelNavigation();
            }}
          >
            <AlertDialog.Portal container={this.rootRef}>
              <AlertDialog.Backdrop className="absolute inset-0 z-[90] bg-black/30 dark:bg-black/55 backdrop-blur-[2px]" />
              <AlertDialog.Popup className="absolute z-[91] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] max-w-[90%] rounded-[var(--jbs-radius-lg)] bg-[var(--jbs-popover-bg)] border border-[var(--jbs-border)] shadow-2xl p-5 text-[var(--jbs-text)] outline-none">
                <AlertDialog.Description className="m-0 text-[15px] font-medium text-center mb-4">
                  You have unsaved changes.
                </AlertDialog.Description>
                <div className="flex items-center justify-end gap-2">
                  <AlertDialog.Close
                    onClick={this.handleCancelNavigation}
                    className="px-3.5 py-1.5 rounded-[var(--jbs-radius)] text-[13px] font-medium border border-[var(--jbs-border)] text-[var(--jbs-text)] hover:bg-[var(--jbs-bg-hover)] cursor-pointer"
                  >
                    Cancel
                  </AlertDialog.Close>
                  <button
                    type="button"
                    onClick={this.handleProceedAndUndo}
                    className="px-3.5 py-1.5 rounded-[var(--jbs-radius)] text-[13px] font-medium bg-[var(--jbs-danger)] text-white hover:opacity-90 cursor-pointer"
                  >
                    Proceed and undo changes
                  </button>
                </div>
              </AlertDialog.Popup>
            </AlertDialog.Portal>
          </AlertDialog.Root>
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
            <Switch.Root
              checked={isDark}
              onCheckedChange={this.toggleInternalDarkMode}
              aria-label="Toggle dark mode"
              className={`relative inline-flex h-[24px] w-[42px] flex-shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none ${
                isDark ? 'bg-[var(--jbs-switch-on)]' : 'bg-[var(--jbs-switch-off)]'
              }`}
            >
              <Switch.Thumb
                className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  isDark ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </Switch.Root>
          </div>
        )}
        </Wrapper>
      </UnsavedChangesContext.Provider>
    );
  }
}

Editor.propTypes = {
  delta: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.bool,
  ]),
  initialConfig: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  format: PropTypes.oneOf(['json', 'yaml']),
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
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  onChange: PropTypes.func,
  initialized: PropTypes.bool.isRequired,
  customValidators: PropTypes.arrayOf(PropTypes.func),
  onPathChange: PropTypes.func,
  path: PropTypes.string,
  internalPath: PropTypes.string.isRequired,
  updatePath: PropTypes.func.isRequired,
  theme: PropTypes.string,
  darkMode: PropTypes.bool,
  className: PropTypes.string,
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
