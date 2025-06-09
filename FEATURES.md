# Fonctionnalités du Jeu Spatial

## Vue d'ensemble

Application React de jeu spatial avec drag-and-drop, développée avec TypeScript et react-dnd.

## Niveaux de jeu

### 1. Niveaux Classiques (3x3)

- **Niveau Facile** : Grille 3x3 avec règles basiques
- **Niveau Moyen** : Grille 3x3 avec difficultés intermédiaires
- **Niveau Difficile** : Grille 3x3 avec défis avancés

**Objets disponibles :**

- 🌳 Arbre (fixe au centre)
- ⭐ Étoile
- 🧚‍♀️ Fée

**Règles :**

- Place la fée en bas à gauche de l'arbre (position 2,0)
- Place l'étoile à droite de l'arbre (position 1,2)

### 2. Mode Libre (5x5) ✨ NOUVEAU

- **Grille 5x5** : Équilibre parfait entre espace et utilisabilité
- **Pas d'arbre fixe** : Liberté totale de placement
- **Pas de règles** : Mode créatif et artistique
- **Copies multiples** : Place autant d'exemplaires du même objet que tu veux
- **9 objets différents** disponibles

**Objets disponibles en mode libre :**

- ⭐ Étoile
- 🧚‍♀️ Fée
- 🐌 Escargot
- 🐞 Coccinelle
- 🚗 Voiture
- 🌸 Fleur
- 🎩 Chapeau
- 🦁 Lion
- 🐱 Chat

## Architecture technique

### Composants principaux

- `GameGrid` : Grille de jeu adaptative (3x3 ou 5x5)
- `SidePanel` : Panneau latéral avec objets et règles
- `DraggableItem` : Objets draggables avec react-dnd
- `GridCell` : Cellules de la grille avec drop zones
- `Button` : Composant bouton réutilisable
- `Message` : Composant pour les messages de feedback

### Styles CSS

- **Responsive design** adaptatif selon la taille de grille
- **25 couleurs différentes** pour les cellules 5x5
- **Animations fluides** pour les interactions drag-and-drop
- **Mode grille** pour l'affichage des objets en mode libre

### Fonctionnalités

- ✅ Drag-and-drop fluide avec react-dnd
- ✅ Repositionnement des objets
- ✅ Retour des objets au panneau latéral (niveaux classiques)
- ✅ **Duplication d'objets** (mode libre)
- ✅ Messages d'encouragement et de victoire
- ✅ Réinitialisation du jeu
- ✅ Navigation entre les niveaux
- ✅ Mode créatif sans conditions de victoire

## Installation et utilisation

```bash
cd frontend
npm install
npm start
```

L'application sera disponible sur `http://localhost:3000`
