import React from 'react';
import '../../styles/GameGrid.css';
import GridCell from './GridCell';

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

interface GameGridProps {
  placedItems: PlacedItem[];
  onDrop: (item: GameItem, row: number, col: number) => void;
  onRemove: (row: number, col: number) => void;
  gridSize?: number;
  hasFixedTree?: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ 
  placedItems, 
  onDrop, 
  onRemove, 
  gridSize = 3, 
  hasFixedTree = true 
}) => {
  const fixedItems = hasFixedTree ? [
    { row: 1, col: 1, emoji: '🌳', id: 'tree' }
  ] : [];

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        grid.push(
          <GridCell
            key={`${row}-${col}`}
            row={row}
            col={col}
            placedItems={placedItems}
            onDrop={onDrop}
            onRemove={onRemove}
            fixedItems={fixedItems}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className={`grid-container grid-${gridSize}x${gridSize}`}>
      {renderGrid()}
    </div>
  );
};

export default GameGrid;
