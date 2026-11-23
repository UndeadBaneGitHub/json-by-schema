import React from 'react';

const ListItemInnerWrapper = ({
  expanded,
  invalid,
  empty,
  changed,
  className = '',
  style,
  ...rest
}) => {
  const bgClass = expanded
    ? invalid
      ? 'bg-[var(--jbs-danger-bg)]'
      : 'bg-[var(--jbs-bg-active)]'
    : invalid
      ? 'bg-[var(--jbs-danger-bg)]'
      : 'bg-[var(--jbs-bg)] hover:bg-[var(--jbs-bg-hover)]';

  const opacityClass = empty
    ? expanded
      ? 'opacity-70'
      : 'opacity-45'
    : 'opacity-100';

  const borderClass = expanded
    ? invalid
      ? 'border-l-[3px] border-l-[var(--jbs-danger)]'
      : 'border-l-[3px] border-l-[var(--jbs-accent)]'
    : '';

  return (
    <div
      className={`w-full h-full m-0 px-4 py-3 leading-normal text-left cursor-inherit transition-colors ${bgClass} ${opacityClass} ${borderClass} ${className}`}
      style={{
        ...(changed
          ? {
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(128, 128, 128, 0.08), rgba(128, 128, 128, 0.08) 24px, transparent 24px, transparent 48px)',
            }
          : {}),
        ...style,
      }}
      {...rest}
    />
  );
};

export default ListItemInnerWrapper;
