import React from 'react';

const Ul = ({ className = '', ...rest }) => (
  <ul className={`list-none m-0 w-full overflow-y-visible p-0 ${className}`} {...rest} />
);

export default Ul;
