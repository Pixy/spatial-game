interface PlacedItem {
  id: string;
  itemType: string;
  position: { row: number; col: number };
}

// Types d'objets qui sont considérés comme des animaux/êtres vivants
const ANIMALS = ['snail', 'ladybug', 'lion', 'cat', 'fairy'];

// Types d'objets qui peuvent rendre les animaux contents quand ils sont à côté
const HAPPINESS_TRIGGERS = [
  ...ANIMALS, // Les animaux sont contents près d'autres animaux
  'flower', // Les animaux aiment les fleurs
];

/**
 * Vérifie si un objet est un animal
 */
export const isAnimal = (itemType: string): boolean => {
  return ANIMALS.includes(itemType);
};

/**
 * Vérifie si un objet peut rendre les animaux contents
 */
export const canMakeHappy = (itemType: string): boolean => {
  return HAPPINESS_TRIGGERS.includes(itemType);
};

/**
 * Retourne les positions adjacentes (haut, bas, gauche, droite)
 */
const getAdjacentPositions = (row: number, col: number, gridSize: number) => {
  const positions = [];
  
  // Haut
  if (row > 0) positions.push({ row: row - 1, col });
  // Bas
  if (row < gridSize - 1) positions.push({ row: row + 1, col });
  // Gauche
  if (col > 0) positions.push({ row, col: col - 1 });
  // Droite
  if (col < gridSize - 1) positions.push({ row, col: col + 1 });
  
  return positions;
};

/**
 * Détermine quels animaux sont contents en fonction des objets placés
 * Retourne un Set avec les IDs des animaux contents
 */
export const getHappyAnimals = (placedItems: PlacedItem[], gridSize: number): Set<string> => {
  const happyAnimals = new Set<string>();
  
  // Pour chaque animal placé
  placedItems.forEach(item => {
    if (!isAnimal(item.itemType)) return;
    
    const adjacentPositions = getAdjacentPositions(item.position.row, item.position.col, gridSize);
    
    // Vérifier s'il y a un objet qui peut le rendre content à côté
    const hasHappyNeighbor = adjacentPositions.some(pos => {
      const neighborItem = placedItems.find(
        placed => placed.position.row === pos.row && placed.position.col === pos.col
      );
      return neighborItem && canMakeHappy(neighborItem.itemType);
    });
    
    if (hasHappyNeighbor) {
      happyAnimals.add(item.id);
    }
  });
  
  return happyAnimals;
};

/**
 * Obtient le message de bonheur selon le nombre d'animaux contents
 */
export const getHappinessMessage = (happyCount: number): string => {
  if (happyCount === 0) return '';
  if (happyCount === 1) return '🎉 Un animal est content d\'avoir des amis à côté !';
  if (happyCount <= 3) return `🎉 ${happyCount} animaux sont contents d'être ensemble !`;
  return `🎉 Tous les animaux sont ravis ! ${happyCount} amis heureux !`;
};

/**
 * Obtient un message de bonheur personnalisé selon les animaux contents
 */
export const getPersonalizedHappinessMessage = (placedItems: PlacedItem[], happyAnimals: Set<string>): string => {
  if (happyAnimals.size === 0) return '';
  
  const happyAnimalsInfo = Array.from(happyAnimals).map(id => {
    const item = placedItems.find(p => p.id === id);
    return item ? item.itemType : null;
  }).filter((type): type is string => type !== null);
  
  const uniqueTypesSet = new Set(happyAnimalsInfo);
  const uniqueTypes = Array.from(uniqueTypesSet);
  
  // Messages spécialisés selon les types d'animaux
  if (happyAnimals.size === 1) {
    const animalType = uniqueTypes[0];
    switch (animalType) {
      case 'cat': return '🎉 Le chat ronronne de bonheur près de ses amis ! 🐱';
      case 'lion': return '🎉 Le lion rugit de joie avec ses compagnons ! 🦁';
      case 'fairy': return '🎉 La fée scintille de bonheur près de la nature ! 🧚‍♀️✨';
      case 'snail': return '🎉 L\'escargot glisse joyeusement vers ses amis ! 🐌';
      case 'ladybug': return '🎉 La coccinelle voltige de bonheur ! 🐞';
      default: return '🎉 Un animal est content d\'avoir des amis à côté !';
    }
  }
  
  // Messages pour plusieurs animaux
  if (uniqueTypes.includes('cat') && uniqueTypes.includes('lion')) {
    return '🎉 Les félins sont ravis d\'être ensemble ! 🐱🦁';
  }
  
  if (uniqueTypes.includes('fairy') && happyAnimals.size >= 2) {
    return '🎉 La magie de l\'amitié opère dans le jardin ! ✨🧚‍♀️';
  }
  
  if (uniqueTypes.includes('snail') && uniqueTypes.includes('ladybug')) {
    return '🎉 Les petites créatures du jardin sont heureuses ! 🐌🐞';
  }
  
  // Messages génériques
  if (happyAnimals.size <= 3) {
    return `🎉 ${happyAnimals.size} animaux sont contents d'être ensemble !`;
  }
  
  return `🎉 Tous les animaux sont ravis ! ${happyAnimals.size} amis heureux ! 🎊`;
};
