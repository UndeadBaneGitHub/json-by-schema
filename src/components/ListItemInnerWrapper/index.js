import React from 'react';

function getChangedBackground(expanded, invalid) {
  if (expanded) {
    return invalid
      ? 'repeating-linear-gradient(135deg, rgba(125, 20, 0, 0.5), rgba(125, 20, 0, 0.5) 30px, #d88282 30px, #d88282 60px)'
      : 'repeating-linear-gradient(135deg, #eeeeee, #eeeeee 30px, #e2e2e2 30px, #e2e2e2 60px)';
  }
  if (invalid) {
    return 'repeating-linear-gradient(135deg, #eeeeee, #eeeeee 30px, #ff999a 30px, #ff999a 60px)';
  }
  return 'repeating-linear-gradient(135deg, #eeeeee, #eeeeee 30px, #ffffff 30px, #ffffff 60px)';
}

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
      ? 'bg-[#d88282]'
      : 'bg-[#e2e2e2]'
    : invalid
      ? 'bg-[#ff999a]'
      : 'bg-white';

  const opacityClass = empty
    ? expanded
      ? 'opacity-60'
      : 'opacity-40'
    : 'opacity-100';

  const borderClass = expanded
    ? invalid
      ? 'border-l-4 border-l-[rgba(125,0,0,0.45)]'
      : 'border-l-4 border-l-[rgba(0,0,0,0.45)]'
    : '';

  return (
    <div
      className={`w-full h-full m-0 px-[1.1em] py-[0.7em] leading-normal text-left cursor-inherit [font-family:'Helvetica_Neue',Helvetica,'Open_Sans',Arial,sans-serif] ${bgClass} ${opacityClass} ${borderClass} ${className}`}
      style={{
        ...(changed ? { background: getChangedBackground(expanded, invalid) } : {}),
        ...style,
      }}
      {...rest}
    />
  );
};

export default ListItemInnerWrapper;
