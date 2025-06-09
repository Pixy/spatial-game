import React, { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import '../../styles/SidePanel.css';
import DraggableItem from './DraggableItem';

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

interface ItemSlotProps {
  item: GameItem | null;
  onDrop: (item: GameItem) => void;
}

const ItemSlot: React.FC<ItemSlotProps> = ({ item, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'game-item',
    drop: (droppedItem: GameItem) => onDrop(droppedItem),
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

  const slotClasses = [
    'item-slot',
    !item && 'empty',
    canDrop && 'can-drop',
    isOver && 'is-over'
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={slotClasses}>
      {item && (
        <DraggableItem
          id={item.id}
          emoji={item.emoji}
          name={item.name}
        />
      )}
    </div>
  );
};

interface SidePanelProps {
  availableItems: GameItem[];
  placedItems: PlacedItem[];
  onItemReturn: (item: GameItem) => void;
  isFreeMode?: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ 
  availableItems, 
  placedItems, 
  onItemReturn,
  isFreeMode = false
}) => {
  return (
    <div className="side-panel">
      <h3>Objets à placer</h3>
      {!isFreeMode && (
        <div className="rules-text">
          <strong>Règles du jeu :</strong><br />
          • Place la fée en bas à gauche de l'arbre<br />
          • Place l'étoile à droite de l'arbre<br />
          • Tu peux déplacer les objets si tu changes d'avis !
        </div>
      )}
      {isFreeMode && (
        <div className="rules-text">
          <strong>Mode Libre :</strong><br />
          • Glisse les objets autant de fois que tu veux !<br />
          • Crée ta propre composition sur la grille 5x5<br />
          • Amusez-toi bien ! 🎨
        </div>
      )}
      
      <div className={`items-container ${isFreeMode ? 'free-mode' : ''}`}>
        {availableItems.map((item) => (
          <ItemSlot
            key={item.id}
            item={item}
            onDrop={onItemReturn}
          />
        ))}
      </div>
    </div>
  );
};

export default SidePanel;
