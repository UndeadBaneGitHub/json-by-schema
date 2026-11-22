import React, { useContext } from 'react';
import styled from 'styled-components';
import SortableItemContext from '../../components/PropertyList/SortableItemContext';

const DragHandleElement = styled.div`
  display: block;
  width: 18px;
  height: 11px;
  opacity: 0.25;
  margin-right: 20px;
  cursor: row-resize;
  background: -webkit-linear-gradient(
    top,
    #000,
    #000 20%,
    #fff 0,
    #fff 40%,
    #000 0,
    #000 60%,
    #fff 0,
    #fff 80%,
    #000 0,
    #000
  );
  background: linear-gradient(
    180deg,
    #000,
    #000 20%,
    #fff 0,
    #fff 40%,
    #000 0,
    #000 60%,
    #fff 0,
    #fff 80%,
    #000 0,
    #000
  );
  position: absolute;
  right: 25px;
  top: 45%;
`;

function DragHandle() {
  const { attributes, listeners } = useContext(SortableItemContext);
  return (
    <DragHandleElement {...attributes} {...listeners}>
      &nbsp;
    </DragHandleElement>
  );
}

export default DragHandle;
