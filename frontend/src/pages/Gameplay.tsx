import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 20px;
`;

const GameContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  background: #2e7d32;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #1976d2;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  background: #f44336;
  
  &:hover {
    background: #da190b;
  }
`;

interface GameItem {
  id: string;
  emoji: string;
  name: string;
}

interface GridPosition {
  row: number;
  col: number;
}

const GAME_ITEMS: GameItem[] = [
  { id: 'star', emoji: '⭐', name: 'Étoile' },
  { id: 'fairy', emoji: '🧚‍♀️', name: 'Fée' }
];

const TREE_POSITION = { row: 1, col: 1 }; // Centre de la grille

const DraggableGameItem: React.FC<{ item: GameItem; isUsed: boolean }> = ({ item, isUsed }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'gameItem',
    item: { id: item.id, emoji: item.emoji },
    canDrag: !isUsed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  if (isUsed) {
    return (
      <div style={{
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        background: '#fff',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        opacity: 0.3,
        cursor: 'not-allowed'
      }}>
        {item.emoji}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        background: isDragging ? '#ffeb3b' : '#fff',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s'
      }}
    >
      {item.emoji}
    </div>
  );
};

const DroppableGridCell: React.FC<{
  position: GridPosition;
  content: string;
  onDrop: (item: any, position: GridPosition) => void;
}> = ({ position, content, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isTreePosition = position.row === TREE_POSITION.row && position.col === TREE_POSITION.col;
  
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'gameItem',
    drop: (item) => onDrop(item, position),
    canDrop: () => !isTreePosition && !content,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [drop]);

  return (
    <div
      ref={ref}
      style={{
        width: '80px',
        height: '80px',
        background: isOver ? '#c8e6c9' : canDrop ? '#e8f5e8' : '#4caf50',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        border: `2px solid ${isOver ? '#4caf50' : 'transparent'}`,
        transition: 'all 0.2s'
      }}
    >
      {isTreePosition ? '🌳' : content}
    </div>
  );
};

const Gameplay: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = searchParams.get('level') || 'easy';
  
  const [gridState, setGridState] = useState<string[][]>(
    Array(3).fill(null).map(() => Array(3).fill(''))
  );
  
  const [placedItems, setPlacedItems] = useState<string[]>([]);

  const handleDrop = (item: any, position: GridPosition) => {
    const newGridState = [...gridState];
    newGridState[position.row][position.col] = item.emoji;
    setGridState(newGridState);
    setPlacedItems(prev => [...prev, item.id]);
  };

  const handleValidate = () => {
    const placedCount = placedItems.length;
    if (placedCount === GAME_ITEMS.length) {
      alert('Bravo ! Vous avez placé tous les éléments dans la grille ! 🎉');
    } else {
      alert(`Il vous reste ${GAME_ITEMS.length - placedCount} élément(s) à placer.`);
    }
  };

  const handleReset = () => {
    setGridState(Array(3).fill(null).map(() => Array(3).fill('')));
    setPlacedItems([]);
  };

  const goBack = () => {
    navigate('/home');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <Title>Jeu de Repérage Spatial - Niveau {level}</Title>
        <p>Glissez l'étoile et la fée dans la grille !</p>
        
        <GameContainer>
          <SidePanel>
            <h3>Éléments à placer :</h3>
            {GAME_ITEMS.map(item => (
              <DraggableGameItem
                key={item.id}
                item={item}
                isUsed={placedItems.includes(item.id)}
              />
            ))}
          </SidePanel>
          
          <GridContainer>
            {gridState.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <DroppableGridCell
                  key={`${rowIndex}-${colIndex}`}
                  position={{ row: rowIndex, col: colIndex }}
                  content={cell}
                  onDrop={handleDrop}
                />
              ))
            )}
          </GridContainer>
        </GameContainer>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Button onClick={handleValidate}>
            Valider la grille
          </Button>
          <Button onClick={handleReset}>
            Recommencer
          </Button>
          <BackButton onClick={goBack}>
            Retour à l'accueil
          </BackButton>
        </div>
      </Container>
    </DndProvider>
  );
};

export default Gameplay;
