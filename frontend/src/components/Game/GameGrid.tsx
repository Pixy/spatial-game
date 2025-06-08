import React from 'react';
import '../../styles/GameGrid.css';
import GridCell from './GridCell';

interface PlacedItem {
  id: string;
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
}

const GameGrid: React.FC<GameGridProps> = ({ placedItems, onDrop, onRemove }) => {
  const fixedItems = [
    { row: 1, col: 1, emoji: '🌳', id: 'tree' }
  ];

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
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
    <div className="grid-container">
      {renderGrid()}
    </div>
  );
};

export default GameGrid;
