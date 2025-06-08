import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import '../../styles/GameGrid.css';

interface GameItem {
  id: string;
  emoji: string;
  name: string;
}

interface DraggableItemProps extends GameItem {
  onRemove?: () => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, emoji, name, onRemove }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'game-item',
    item: { id, emoji, name },
    end: (item, monitor) => {
      if (monitor.didDrop() && onRemove) {
        onRemove();
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  const itemClasses = [
    'draggable-item',
    isDragging && 'is-dragging'
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={itemClasses}
      title={name}
    >
      {emoji}
    </div>
  );
};

export default DraggableItem;
