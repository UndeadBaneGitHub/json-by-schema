import React from 'react';

const ResetFilterButton = ({ className = '', ...rest }) => (
  <button
    type="button"
    aria-label="Clear filter"
    className={`px-2 absolute right-2 top-0 bottom-0 flex items-center justify-center cursor-pointer text-[#999] hover:text-[#555] ${className}`}
    {...rest}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
);

export default ResetFilterButton;
