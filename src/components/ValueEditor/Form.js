import React from 'react';

const Form = ({ className = '', ...rest }) => (
  <form className={`jbs-value-editor ${className}`.trim()} {...rest} />
);

export default Form;
