import React, { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import '../../styles/GameGrid.css';
import { DraggableItem } from './index';

interface PlacedItem {
  id: string;
  itemType: string; // Type of the original item
  position: { row: number; col: number };
}

interface GameItem {
  id: string;
  emoji: string;
  name: string;
}

interface GridCellProps {
  row: number;
  col: number;
  placedItems: PlacedItem[];
  onDrop: (item: GameItem, row: number, col: number) => void;
  onRemove: (row: number, col: number) => void;
  fixedItems?: Array<{ row: number; col: number; emoji: string; id: string }>;
}

const GridCell: React.FC<GridCellProps> = ({
  row,
  col,
  placedItems,
  onDrop,
  onRemove,
  fixedItems = [],
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'game-item',
    drop: (item: GameItem) => onDrop(item, row, col),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [drop]);

  // Check if there's a fixed item at this position
  const fixedItem = fixedItems.find(item => item.row === row && item.col === col);
  
  // Check if there's a placed item at this position
  const placedItem = placedItems.find(item => 
    item.position.row === row && item.position.col === col
  );

  const cellClasses = [
    'grid-cell',
    `cell-${row}-${col}`,
    canDrop && 'can-drop',
    isOver && 'is-over'
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={cellClasses}
    >
      {fixedItem && (
        <span className="draggable-item">
          {fixedItem.emoji}
        </span>
      )}
      {placedItem && !fixedItem && (
        <DraggableItem
          id={placedItem.id}
          emoji={getEmojiById(placedItem.itemType)}
          name={getNameById(placedItem.itemType)}
          onRemove={() => onRemove(row, col)}
        />
      )}
    </div>
  );
};

// Helper functions - these should ideally come from props or context
const getEmojiById = (id: string): string => {
  const items = {
    'star': '⭐',
    'fairy': '🧚‍♀️',
    'snail': '🐌',
    'ladybug': '🐞',
    'car': '🚗',
    'flower': '🌸',
    'hat': '🎩',
    'lion': '🦁',
    'cat': '🐱'
  };
  return items[id as keyof typeof items] || '';
};

const getNameById = (id: string): string => {
  const items = {
    'star': 'Étoile',
    'fairy': 'Fée',
    'snail': 'Escargot',
    'ladybug': 'Coccinelle',
    'car': 'Voiture',
    'flower': 'Fleur',
    'hat': 'Chapeau',
    'lion': 'Lion',
    'cat': 'Chat'
  };
  return items[id as keyof typeof items] || '';
};

export default GridCell;
