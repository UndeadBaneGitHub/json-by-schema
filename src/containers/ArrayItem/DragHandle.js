import React, { useContext } from 'react';
import SortableItemContext from '../../components/PropertyList/SortableItemContext';

function DragHandle() {
  const { attributes, listeners } = useContext(SortableItemContext);
  return (
    <div
      className="block w-[18px] h-[11px] opacity-25 mr-[20px] cursor-row-resize absolute right-[25px] top-[45%]"
      style={{
        background:
          'linear-gradient(180deg, #000, #000 20%, #fff 0, #fff 40%, #000 0, #000 60%, #fff 0, #fff 80%, #000 0, #000)',
      }}
      {...attributes}
      {...listeners}
    >
      &nbsp;
    </div>
  );
}

export default DragHandle;
