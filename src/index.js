// // Import React and React-dom.
// import React from 'react'
// import ReactDOM from 'react-dom'
//
// // Import the components.
// import { DummyComponent } from './containers/dummy-component.jsx'
//
// // Define the root element.
// const root = document.querySelector('main')
//
// // Append the DummyComponent to the root element.
// ReactDOM.render(<DummyComponent />, root)

// Import all the third party stuff
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

// Import Language Provider
import Editor from './containers/Editor/Loadable';

import configureStore from './configureStore';

// Import CSS reset and Global Styles
import './styles.css';

// Create redux store with history
const initialState = {};
const store = configureStore(initialState);

function JsonBySchema(props) {
  return (
    <Provider store={store}>
      <IntlProvider locale={'en'}>
        <Editor
          config={props.config}
          onChange={props.onChange}
          schema={props.schema}
          path={props.path}
          onPathChange={props.onPathChange}
          customValidators={props.customValidators}
          deltaDepth={props.deltaDepth}
          theme={props.theme}
          darkMode={props.darkMode}
          format={props.format}
        />
      </IntlProvider>
    </Provider>
  );
}

JsonBySchema.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  config: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  path: PropTypes.string,
  onPathChange: PropTypes.func,
  customValidators: PropTypes.arrayOf(PropTypes.func),
  deltaDepth: PropTypes.number,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  darkMode: PropTypes.bool,
  format: PropTypes.oneOf(['json', 'yaml']),
};

export { JsonBySchema };
export { THEME_PRESETS } from './theme';
export { CustomValidationError, CustomValidationResult } from './customValidation';
export {
  SUPPORTED_FORMATS,
  parseStructuredValue,
  stringifyStructuredValue,
} from './utils/formatUtils';
