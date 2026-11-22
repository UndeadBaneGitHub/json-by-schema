import React, { useContext } from 'react';
import SortableItemContext from '../../components/PropertyList/SortableItemContext';

function DragHandle() {
  const { attributes, listeners } = useContext(SortableItemContext);
  return (
    <div
      className="flex flex-col justify-between w-[18px] h-[12px] opacity-35 hover:opacity-70 mr-[20px] cursor-row-resize absolute right-[25px] top-[45%] text-black dark:text-white transition-opacity"
      {...attributes}
      {...listeners}
    >
      <span className="block h-[2px] w-full rounded-full bg-current" />
      <span className="block h-[2px] w-full rounded-full bg-current" />
      <span className="block h-[2px] w-full rounded-full bg-current" />
    </div>
  );
}

export default DragHandle;
