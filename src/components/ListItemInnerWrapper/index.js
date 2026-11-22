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
      ? 'bg-[#ff3b30]/20 dark:bg-[#ff453a]/25'
      : 'bg-[#e5e5ea] dark:bg-[#2c2c2e]'
    : invalid
      ? 'bg-[#ff3b30]/10 dark:bg-[#ff453a]/15'
      : 'bg-white dark:bg-[#1c1c1e] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e]/70';

  const opacityClass = empty
    ? expanded
      ? 'opacity-70'
      : 'opacity-45'
    : 'opacity-100';

  const borderClass = expanded
    ? invalid
      ? 'border-l-[3px] border-l-[#ff3b30] dark:border-l-[#ff453a]'
      : 'border-l-[3px] border-l-[#007aff] dark:border-l-[#0a84ff]'
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
