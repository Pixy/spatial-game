# Architecture Hexagonale - API Spatial Game

## Vue d'ensemble

L'API a été restructurée selon les principes de l'architecture hexagonale (aussi appelée Ports & Adapters) pour obtenir une séparation claire des responsabilités et une meilleure testabilité.

## Structure des couches

```
src/
├── domain/                 # Logique métier pure
│   ├── entities/          # Entités du domaine
│   ├── repositories/      # Contrats des repositories
│   ├── services/          # Services du domaine
│   └── value-objects/     # Objets valeur
├── application/           # Couche application
│   ├── dtos/             # Data Transfer Objects
│   ├── ports/            # Contrats des use cases
│   └── use-cases/        # Implémentation des use cases
├── infrastructure/       # Couche infrastructure
│   ├── persistence/      # Implémentation des repositories
│   ├── web/             # Contrôleurs HTTP
│   └── modules/         # Modules NestJS
└── shared/              # Code partagé
    ├── exceptions/      # Exceptions métier
    ├── types/          # Types TypeScript
    └── utils/          # Utilitaires
```

## Couche Domaine

### Entités

- **Player** : Représente un joueur avec ses propriétés et comportements
- **Game** : Représente une partie de jeu avec sa logique métier

### Services du domaine

- **GameDomainService** : Logique complexe du calcul de bonheur des animaux

### Value Objects

- **ItemPosition** : Position d'un élément sur la grille

## Couche Application

### Use Cases

- **PlayerUseCases** : Création, modification, suppression de joueurs
- **GameUseCases** : Création de parties, gestion des tours, placement d'éléments

### DTOs

- Objets de transfert de données pour les requêtes API

## Couche Infrastructure

### Persistence

- **InMemoryPlayerRepository** : Stockage en mémoire des joueurs
- **InMemoryGameRepository** : Stockage en mémoire des parties

### Web

- **PlayerController** : API REST pour les joueurs
- **GameController** : API REST pour les parties

## Injection de dépendances

L'architecture utilise des tokens d'injection NestJS pour découpler les couches :

```typescript
// Dans ApplicationModule
export const GAME_USE_CASES = "GAME_USE_CASES";
export const PLAYER_USE_CASES = "PLAYER_USE_CASES";

// Dans PersistenceModule
export const PLAYER_REPOSITORY = "PLAYER_REPOSITORY";
export const GAME_REPOSITORY = "GAME_REPOSITORY";
```

## Endpoints API

### Joueurs

- `POST /players` - Créer un joueur
- `GET /players` - Lister tous les joueurs
- `GET /players/:id` - Obtenir un joueur par ID
- `PUT /players/:id` - Modifier un joueur
- `DELETE /players/:id` - Supprimer un joueur

### Parties

- `POST /games` - Créer une partie
- `GET /games` - Lister les parties disponibles
- `GET /games?playerId=:id` - Parties d'un joueur
- `GET /games/:id` - Obtenir une partie par ID
- `POST /games/:id/join` - Rejoindre une partie
- `POST /games/:id/leave` - Quitter une partie
- `POST /games/:id/start` - Démarrer une partie
- `POST /games/:id/place-item` - Placer un élément
- `POST /games/:id/end` - Terminer une partie

## Exemple d'utilisation

```bash
# Créer un joueur
curl -X POST http://localhost:3000/players \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice"}'

# Créer une partie
curl -X POST http://localhost:3000/games \\
  -H "Content-Type: application/json" \\
  -d '{"creatorId": "player-id", "difficulty": "easy", "gridSize": 5}'

# Démarrer la partie
curl -X POST http://localhost:3000/games/game-id/start

# Placer un élément
curl -X POST http://localhost:3000/games/game-id/place-item \\
  -H "Content-Type: application/json" \\
  -d '{"playerId": "player-id", "itemId": "cat_1", "x": 2, "y": 2}'
```

## Tests

La structure permet une testabilité optimale :

- Tests unitaires des entités du domaine
- Tests d'intégration des use cases avec mocks
- Tests d'API end-to-end

## Avantages de cette architecture

1. **Séparation des responsabilités** : Chaque couche a un rôle bien défini
2. **Indépendance des frameworks** : La logique métier ne dépend pas de NestJS
3. **Testabilité** : Facilité de mocker les dépendances
4. **Évolutivité** : Facile d'ajouter de nouveaux adapters (base de données, API)
5. **Maintenance** : Code plus lisible et organisé

## Migration future

Cette architecture permet facilement :

- Remplacement du stockage en mémoire par une vraie base de données
- Ajout d'authentification et autorisation
- Implémentation de WebSockets pour le temps réel
- Intégration avec des services externes
