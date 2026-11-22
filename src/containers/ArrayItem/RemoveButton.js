import React from 'react';

const RemoveButton = ({ className = '', ...rest }) => (
  <button
    type="button"
    aria-label="Remove item"
    className={`px-3 absolute right-1 top-0 bottom-0 flex items-center justify-center text-[var(--jbs-text-muted)] hover:text-[var(--jbs-text)] cursor-pointer transition-colors ${className}`}
    {...rest}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
);

export default RemoveButton;
