import React from 'react';

const EditAsJSONButtonWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`absolute bottom-0 block w-full m-0 p-0 border-t-2 border-[#eee] ${className}`}
    {...rest}
  />
));

export default EditAsJSONButtonWrapper;
