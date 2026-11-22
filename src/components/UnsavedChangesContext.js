import React from 'react';

const UnsavedChangesContext = React.createContext({
  setUnsavedState: () => {},
  guardNavigation: (fn) => fn(),
});

export default UnsavedChangesContext;
