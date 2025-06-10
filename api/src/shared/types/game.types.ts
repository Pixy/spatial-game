/**
 * Types partagés pour le domaine du jeu spatial
 */

export interface Position {
  row: number;
  col: number;
}

export interface GameItem {
  id: string;
  emoji: string;
  name: string;
  type: ItemType;
}

export interface PlacedItem {
  id: string;
  itemType: string;
  position: Position;
  placedAt: Date;
}

export enum ItemType {
  ANIMAL = 'animal',
  OBJECT = 'object',
  DECORATION = 'decoration',
}

export enum GameLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  FREE = 'free',
}

export interface GameConfiguration {
  level: GameLevel;
  gridSize: number;
  availableItems: GameItem[];
  winConditions?: WinCondition[];
  timeLimit?: number;
}

export interface WinCondition {
  itemType: string;
  position: Position;
}

export interface GameStats {
  totalMoves: number;
  timeElapsed: number;
  score: number;
  happyAnimals: number;
}

export interface HappinessRule {
  triggerItem: string;
  targetItems: string[];
  range: number;
}

// Types pour l'API
export type PlayerId = string;
export type PlayerName = string;
export type GameId = string;

export type GameStatus = 'waiting' | 'active' | 'completed' | 'abandoned';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GridSize = number; // 3-10

// Interface pour les entités du domaine
export interface GameEntity {
  id: GameId;
  createdBy: PlayerId;
  status: GameStatus;
  difficulty: GameDifficulty;
  gridSize: GridSize;
  players: PlayerId[];
  currentTurn: PlayerId | null;
  turnCount: number;
  maxTurns: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerEntity {
  id: PlayerId;
  name: PlayerName;
  score: number;
  isActive: boolean;
}
