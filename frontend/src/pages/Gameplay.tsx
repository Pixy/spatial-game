import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import { GameGrid, SidePanel } from '../components/Game';
import { Button, Message } from '../components/UI';
import '../styles/Gameplay.css';

interface GameItem {
  id: string;
  emoji: string;
  name: string;
}

interface PlacedItem {
  id: string;
  position: { row: number; col: number };
}

const Gameplay: React.FC = () => {
  const navigate = useNavigate();
  
  const gameItems: GameItem[] = [
    { id: 'star', emoji: '⭐', name: 'Étoile' },
    { id: 'fairy', emoji: '🧚‍♀️', name: 'Fée' }
  ];

  const [availableItems, setAvailableItems] = useState<GameItem[]>(gameItems);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [message, setMessage] = useState<string>('');

  const checkWinCondition = useCallback(() => {
    const fairyPlacement = placedItems.find(item => item.id === 'fairy');
    const starPlacement = placedItems.find(item => item.id === 'star');
    
    const fairyCorrect = fairyPlacement && 
      fairyPlacement.position.row === 2 && fairyPlacement.position.col === 0;
    const starCorrect = starPlacement && 
      starPlacement.position.row === 1 && starPlacement.position.col === 2;
    
    if (fairyCorrect && starCorrect) {
      setMessage('🎉 Bravo ! Tu as réussi ! 🎉');
      return true;
    } else if (placedItems.length === gameItems.length) {
      setMessage('Ne te décourage pas, tu y es presque ! 💪');
      return false;
    }
    return false;
  }, [placedItems, gameItems.length]);

  const handleDrop = (item: GameItem, row: number, col: number) => {
    // Remove item from available items
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    
    // Add to placed items
    setPlacedItems(prev => [
      ...prev.filter(p => p.id !== item.id), // Remove if already placed
      { id: item.id, position: { row, col } }
    ]);
    
    setMessage('');
  };

  const handleRemove = (row: number, col: number) => {
    const itemToRemove = placedItems.find(
      item => item.position.row === row && item.position.col === col
    );
    
    if (itemToRemove) {
      const gameItem = gameItems.find(item => item.id === itemToRemove.id);
      if (gameItem) {
        // Return item to available items
        setAvailableItems(prev => [...prev, gameItem]);
        
        // Remove from placed items
        setPlacedItems(prev => prev.filter(
          item => !(item.position.row === row && item.position.col === col)
        ));
      }
    }
  };

  const handleItemReturn = (item: GameItem) => {
    // Remove from placed items
    setPlacedItems(prev => prev.filter(p => p.id !== item.id));
    
    // Add back to available items if not already there
    setAvailableItems(prev => {
      if (!prev.find(i => i.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const resetGame = () => {
    setAvailableItems(gameItems);
    setPlacedItems([]);
    setMessage('');
  };

  // Check win condition when items change
  React.useEffect(() => {
    if (placedItems.length > 0) {
      checkWinCondition();
    }
  }, [placedItems, checkWinCondition]);

  const isGameWon = message.includes('Bravo');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="gameplay-container">
        <h1 className="gameplay-title">Jeu Spatial</h1>
        <p className="gameplay-instruction">
          Glisse et dépose les objets sur la grille ! Tu peux les repositionner si nécessaire.
        </p>
        
        {message && (
          <Message type={isGameWon ? 'success' : 'encouraging'}>
            {message}
          </Message>
        )}
        
        <div className="game-layout">
          <GameGrid
            placedItems={placedItems}
            onDrop={handleDrop}
            onRemove={handleRemove}
          />
          
          <SidePanel
            availableItems={availableItems}
            placedItems={placedItems}
            onItemReturn={handleItemReturn}
          />
        </div>
        
        <div className="gameplay-buttons">
          <Button variant="primary" onClick={resetGame}>
            Recommencer
          </Button>
          <Button variant="secondary" onClick={() => navigate('/home')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Gameplay;
