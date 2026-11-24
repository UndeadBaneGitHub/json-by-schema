import React from 'react';
import PropTypes from 'prop-types';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Ul from './Ul';
import Li from './Li';
import Wrapper from './Wrapper';
import SortableItemContext from './SortableItemContext';

function SortableItem({ id, value, component: ComponentToRender }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={{ attributes, listeners }}>
      <Li
        ref={setNodeRef}
        style={style}
        className={isDragging ? 'property-being-dragged' : undefined}
      >
        <ComponentToRender {...value} />
      </Li>
    </SortableItemContext.Provider>
  );
}

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  component: PropTypes.elementType.isRequired,
};

function PropertiesList(props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  if (!props.items?.length || !props.component) {
    return null;
  }

  const itemIds = props.items.map((item) => `item-${item.id}`);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !props.onSortEnd) {
      return;
    }

    const oldIndex = itemIds.indexOf(active.id);
    const newIndex = itemIds.indexOf(over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      props.onSortEnd({ oldIndex, newIndex });
    }
  };

  return (
    <Wrapper className={'clearfix'}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <Ul>
            {props.items.map((value) => {
              const id = `item-${value.id}`;
              return (
                <SortableItem
                  key={id}
                  id={id}
                  value={value}
                  component={props.component}
                />
              );
            })}
          </Ul>
        </SortableContext>
      </DndContext>
    </Wrapper>
  );
}

PropertiesList.propTypes = {
  component: PropTypes.elementType,
  items: PropTypes.array,
  onSortEnd: PropTypes.func,
};

export default PropertiesList;
