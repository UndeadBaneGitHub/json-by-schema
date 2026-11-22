import React from 'react';

const RemoveButton = ({ className = '', ...rest }) => (
  <button
    type="button"
    className={`px-[1em] py-[0.5em] absolute right-0 top-0 bottom-0 cursor-pointer hover:font-bold ${className}`}
    {...rest}
  />
);

export default RemoveButton;
