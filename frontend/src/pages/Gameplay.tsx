import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameGrid, SidePanel } from '../components/Game';
import { Button, Message } from '../components/UI';
import '../styles/Gameplay.css';
import '../styles/Toast.css';
import { getHappyAnimals, getPersonalizedHappinessMessage } from '../utils/animalHappiness';

interface GameItem {
  id: string;
  emoji: string;
  name: string;
}

interface PlacedItem {
  id: string;
  itemType: string; // Type of the original item
  position: { row: number; col: number };
}

const Gameplay: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'easy';
  
  // Définir les objets selon le niveau
  const getGameItems = (): GameItem[] => {
    if (level === 'free') {
      return [
        { id: 'star', emoji: '⭐', name: 'Étoile' },
        { id: 'fairy', emoji: '🧚‍♀️', name: 'Fée' },
        { id: 'snail', emoji: '🐌', name: 'Escargot' },
        { id: 'ladybug', emoji: '🐞', name: 'Coccinelle' },
        { id: 'car', emoji: '🚗', name: 'Voiture' },
        { id: 'flower', emoji: '🌸', name: 'Fleur' },
        { id: 'hat', emoji: '🎩', name: 'Chapeau' },
        { id: 'lion', emoji: '🦁', name: 'Lion' },
        { id: 'cat', emoji: '🐱', name: 'Chat' }
      ];
    }
    return [
      { id: 'star', emoji: '⭐', name: 'Étoile' },
      { id: 'fairy', emoji: '🧚‍♀️', name: 'Fée' }
    ];
  };

  const gameItems = getGameItems();

  const [availableItems, setAvailableItems] = useState<GameItem[]>(gameItems);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [message, setMessage] = useState<string>('');
  const [lastHappinessMessage, setLastHappinessMessage] = useState<string>('');

  // Effect pour calculer et afficher les messages de bonheur en mode libre
  useEffect(() => {
    if (level === 'free' && placedItems.length > 0) {
      const gridSize = 5;
      const happyAnimals = getHappyAnimals(placedItems, gridSize);
      
      if (happyAnimals.size > 0) {
        const happinessMessage = getPersonalizedHappinessMessage(placedItems, happyAnimals);
        
        // Éviter les doublons de messages
        if (happinessMessage !== lastHappinessMessage) {
          setLastHappinessMessage(happinessMessage);
          
          // Afficher le toast de bonheur
          toast(happinessMessage, {
            duration: 3000,
            position: 'top-center',
            className: 'happiness-toast',
            icon: '🎉',
          });
        }
      } else {
        // Reset si plus d'animaux contents
        setLastHappinessMessage('');
      }
    }
  }, [placedItems, level, lastHappinessMessage]);

  const checkWinCondition = useCallback(() => {
    // En mode libre, pas de conditions de victoire spécifiques
    if (level === 'free') {
      return false; // Mode créatif, pas de victoire
    }
    
    const fairyPlacement = placedItems.find(item => item.itemType === 'fairy');
    const starPlacement = placedItems.find(item => item.itemType === 'star');
    
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
  }, [placedItems, gameItems.length, level]);

  const handleDrop = (item: GameItem, row: number, col: number) => {
    if (level === 'free') {
      // En mode libre, créer une nouvelle copie avec un ID unique
      const uniqueId = `${item.id}-${Date.now()}-${Math.random()}`;
      
      // Remove any existing item at this position
      setPlacedItems(prev => prev.filter(
        p => !(p.position.row === row && p.position.col === col)
      ));
      
      // Add new copy to placed items
      setPlacedItems(prev => [
        ...prev,
        { id: uniqueId, itemType: item.id, position: { row, col } }
      ]);
    } else {
      // Logique classique : retirer de available et ajouter à placed
      setAvailableItems(prev => prev.filter(i => i.id !== item.id));
      
      // Add to placed items
      setPlacedItems(prev => [
        ...prev.filter(p => p.itemType !== item.id), // Remove if already placed
        { id: item.id, itemType: item.id, position: { row, col } }
      ]);
    }
    
    setMessage('');
  };

  const handleRemove = (row: number, col: number) => {
    const itemToRemove = placedItems.find(
      item => item.position.row === row && item.position.col === col
    );
    
    if (itemToRemove) {
      if (level === 'free') {
        // En mode libre, simplement supprimer l'objet (pas de retour au panneau)
        setPlacedItems(prev => prev.filter(
          item => !(item.position.row === row && item.position.col === col)
        ));
      } else {
        // Logique classique : retourner l'objet au panneau
        const gameItem = gameItems.find(item => item.id === itemToRemove.itemType);
        if (gameItem) {
          // Return item to available items
          setAvailableItems(prev => [...prev, gameItem]);
          
          // Remove from placed items
          setPlacedItems(prev => prev.filter(
            item => !(item.position.row === row && item.position.col === col)
          ));
        }
      }
    }
  };

  const handleItemReturn = (item: GameItem) => {
    if (level === 'free') {
      // En mode libre, on ne retire pas les objets du panneau
      return;
    }
    
    // Remove from placed items
    setPlacedItems(prev => prev.filter(p => p.itemType !== item.id));
    
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
        <h1 className="gameplay-title">
          {level === 'free' ? 'Mode Libre' : 'Jeu Spatial'}
        </h1>
        <p className="gameplay-instruction">
          {level === 'free' 
            ? 'Crée ta propre composition ! Glisse les objets autant de fois que tu veux sur la grille 5x5.'
            : 'Glisse et dépose les objets sur la grille ! Tu peux les repositionner si nécessaire.'
          }
        </p>
        
        {message && !message.includes('🎉') && (
          <Message type={isGameWon ? 'success' : 'encouraging'}>
            {message}
          </Message>
        )}
        
        <div className="game-layout">
          <GameGrid
            placedItems={placedItems}
            onDrop={handleDrop}
            onRemove={handleRemove}
            gridSize={level === 'free' ? 5 : 3}
            hasFixedTree={level !== 'free'}
          />
          
          <SidePanel
            availableItems={availableItems}
            placedItems={placedItems}
            onItemReturn={handleItemReturn}
            isFreeMode={level === 'free'}
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
      
      {/* Toaster pour les messages de bonheur */}
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'happiness-toast',
          duration: 3000,
        }}
      />
    </DndProvider>
  );
};

export default Gameplay;
