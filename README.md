# 🎮 Spatial Game - Jeu Éducatif React

Un jeu spatial éducatif pour enfants développé en React avec des fonctionnalités d'animations et de drag-and-drop.

## 🚀 Démarrage Rapide

### Installation

```bash
cd frontend
npm install
```

### Lancement

```bash
npm start
```

L'application sera disponible sur http://localhost:3000

## 🎯 Fonctionnalités

### 🏠 Page d'Accueil

- Interface colorée avec dégradés pastels
- Sélection de difficulté : Facile, Moyen, Difficile
- **Mode Libre** : Mode créatif sans contraintes

### 🎲 Modes de Jeu

#### Mode Classique (Facile/Moyen/Difficile)

- **Objectif** : Placer la Fée 🧚‍♀️ et l'Étoile ⭐ aux bonnes positions
- **Grille** : 3x3 avec un arbre fixe au centre
- **Validation** : Conditions de victoire spécifiques
- **Objets** : Fée et Étoile uniquement

#### Mode Libre ⭐

- **Grille** : 5x5 sans contraintes
- **Objets disponibles** : ⭐🧚‍♀️🐌🐞🚗🌸🎩🦁🐱
- **Placement illimité** : Copie infinie de chaque objet
- **Créativité totale** : Aucune condition de victoire

### 🎉 Système d'Animaux Contents (Mode Libre)

#### Détection Intelligente

- Les animaux (🐱🦁🧚‍♀️🐌🐞) détectent leurs voisins adjacents
- Deviennent contents près d'autres animaux ou de fleurs 🌸
- Vérification dans 4 directions (haut, bas, gauche, droite)

#### Animations Visuelles

- **Bouncing** : Effet de rebond des animaux contents
- **Rotation** : Balancement gauche-droite
- **Étincelles** : ✨ qui apparaissent au-dessus des animaux
- **Glow doré** : Effet lumineux autour des cellules

#### Messages Personnalisés

- **Chat** : "🎉 Le chat ronronne de bonheur près de ses amis ! 🐱"
- **Lion** : "🎉 Le lion rugit de joie avec ses compagnons ! 🦁"
- **Fée** : "🎉 La fée scintille de bonheur près de la nature ! 🧚‍♀️✨"
- **Escargot** : "🎉 L'escargot glisse joyeusement vers ses amis ! 🐌"
- **Coccinelle** : "🎉 La coccinelle voltige de bonheur ! 🐞"
- **Combinaisons spéciales** : Messages pour félins ensemble, créatures du jardin...

#### Notifications Toast

- Messages en overlay (surimpression)
- Pas de décalage de la mise en page
- Durée : 3 secondes
- Design : Dégradés pastels avec bordure dorée animée
- Position : Top-center

### 🎨 Interface Utilisateur

#### Design

- **Couleurs** : Dégradés pastels harmonieux
- **Cellules colorées** : Chaque position a sa couleur unique
- **Responsive** : Adapté mobile et desktop
- **Animations fluides** : Transitions CSS et Framer Motion

#### Interactions

- **Drag & Drop** : Glisser-déposer intuitif
- **Feedback visuel** : Survol et zones de drop
- **Messages** : Encouragements et instructions
- **Boutons** : Retour à l'accueil, Reset du jeu

## 🛠️ Technologies Utilisées

### Core

- **React 19** : Framework principal
- **TypeScript** : Typage statique
- **React Router** : Navigation

### Interactions

- **react-dnd** : Système drag & drop
- **framer-motion** : Animations fluides
- **react-hot-toast** : Notifications overlay

### Styling

- **CSS3** : Animations et dégradés
- **Flexbox/Grid** : Layouts responsives
- **Keyframes** : Animations customisées

## 📁 Structure du Projet

```
frontend/src/
├── components/
│   ├── Game/
│   │   ├── DraggableItem.tsx    # Objets déplaçables
│   │   ├── GameGrid.tsx         # Grille de jeu
│   │   ├── GridCell.tsx         # Cellules individuelles
│   │   └── SidePanel.tsx        # Panneau d'objets
│   └── UI/
│       ├── Button.tsx           # Boutons stylisés
│       └── Message.tsx          # Messages de jeu
├── pages/
│   ├── Home.tsx                 # Page d'accueil
│   └── Gameplay.tsx             # Page de jeu
├── utils/
│   └── animalHappiness.ts       # Logique animaux contents
└── styles/                      # Fichiers CSS
```

## 🎮 Comment Jouer

### Mode Classique

1. Choisir une difficulté sur l'accueil
2. Glisser la Fée vers la case en bas à gauche
3. Glisser l'Étoile vers la case en haut à droite
4. Message de victoire quand réussi !

### Mode Libre

1. Cliquer sur "Mode Libre"
2. Glisser n'importe quel objet sur la grille 5x5
3. Placer des animaux près d'autres animaux ou de fleurs
4. Observer les animations et messages de bonheur !
5. Créer ses propres compositions

### Configurations Amusantes

- **Jardin d'amitié** : Entourer les animaux de fleurs 🌸
- **Chaîne d'amitié** : Aligner les animaux horizontalement
- **Cercle magique** : Former une croix avec les animaux

## 🐛 Développement

### Scripts Disponibles

```bash
npm start      # Lancement en développement
npm test       # Lancement des tests
npm run build  # Build de production
```

### Structure des Composants

- **Pages** : Composants de haut niveau (Home, Gameplay)
- **Game** : Composants spécifiques au jeu
- **UI** : Composants d'interface réutilisables
- **Utils** : Logique métier et helpers

L'application est maintenant prête à être utilisée ! 🎉
