import React from 'react';

const EditAsJSONButtonWrapper = React.forwardRef(({ className = '', ...rest }, ref) => (
  <div
    ref={ref}
    className={`absolute bottom-0 block w-full m-0 p-0 bg-[#f2f2f7] dark:bg-[#1c1c1e] border-t border-[#c6c6c8]/60 dark:border-[#38383a] ${className}`}
    {...rest}
  />
));

export default EditAsJSONButtonWrapper;
