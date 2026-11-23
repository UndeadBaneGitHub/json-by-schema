import React from 'react';

const UnsavedChangesContext = React.createContext({
  setUnsavedState: () => {},
  guardNavigation: (fn) => fn(),
  format: 'json',
});

export default UnsavedChangesContext;
