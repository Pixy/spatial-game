import { DomainException } from '../../shared/exceptions/domain.exceptions';
import {
    GameDifficulty,
    GameId,
    GameItem,
    GameStatus,
    GridSize,
    PlayerId,
} from '../../shared/types/game.types';
import { ItemPosition } from '../value-objects/item-position.vo';
import { Player } from './player.entity';

export class Game {
  private constructor(
    private readonly _id: GameId,
    private readonly _createdBy: PlayerId,
    private _status: GameStatus = 'waiting',
    private _difficulty: GameDifficulty = 'easy',
    private _gridSize: GridSize = 5,
    private _items: Map<string, GameItem> = new Map(),
    private _itemPositions: Map<string, ItemPosition> = new Map(),
    private _players: Map<PlayerId, Player> = new Map(),
    private _currentTurn: PlayerId | null = null,
    private _turnCount: number = 0,
    private _maxTurns: number = 50,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {
    this.validateGame();
  }

  public static create(
    id: GameId,
    createdBy: PlayerId,
    difficulty: GameDifficulty = 'easy',
    gridSize: GridSize = 5,
  ): Game {
    const game = new Game(id, createdBy, 'waiting', difficulty, gridSize);
    game.setMaxTurnsBasedOnDifficulty();
    return game;
  }

  public static fromPersistence(data: {
    id: GameId;
    createdBy: PlayerId;
    status: GameStatus;
    difficulty: GameDifficulty;
    gridSize: GridSize;
    items: Map<string, GameItem>;
    itemPositions: Map<string, ItemPosition>;
    players: Map<PlayerId, Player>;
    currentTurn: PlayerId | null;
    turnCount: number;
    maxTurns: number;
    createdAt: Date;
    updatedAt: Date;
  }): Game {
    return new Game(
      data.id,
      data.createdBy,
      data.status,
      data.difficulty,
      data.gridSize,
      data.items,
      data.itemPositions,
      data.players,
      data.currentTurn,
      data.turnCount,
      data.maxTurns,
      data.createdAt,
      data.updatedAt,
    );
  }

  private validateGame(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new DomainException('Game ID cannot be empty');
    }
    if (!this._createdBy || this._createdBy.trim().length === 0) {
      throw new DomainException('Game creator ID cannot be empty');
    }
    if (this._gridSize < 3 || this._gridSize > 10) {
      throw new DomainException('Grid size must be between 3 and 10');
    }
    if (this._maxTurns < 1 || this._maxTurns > 200) {
      throw new DomainException('Max turns must be between 1 and 200');
    }
  }

  private setMaxTurnsBasedOnDifficulty(): void {
    switch (this._difficulty) {
      case 'easy':
        this._maxTurns = 30;
        break;
      case 'medium':
        this._maxTurns = 50;
        break;
      case 'hard':
        this._maxTurns = 80;
        break;
      default:
        this._maxTurns = 50;
    }
  }

  public addPlayer(player: Player): void {
    if (this._status !== 'waiting') {
      throw new DomainException(
        'Cannot add players to a game that is not waiting',
      );
    }
    if (this._players.has(player.id)) {
      throw new DomainException('Player is already in the game');
    }
    if (this._players.size >= 4) {
      throw new DomainException('Game is full (max 4 players)');
    }

    this._players.set(player.id, player);
    this._updatedAt = new Date();
  }

  public removePlayer(playerId: PlayerId): void {
    if (this._status === 'completed') {
      throw new DomainException('Cannot remove players from a completed game');
    }
    if (!this._players.has(playerId)) {
      throw new DomainException('Player is not in the game');
    }

    this._players.delete(playerId);

    // If current player left, move to next turn
    if (this._currentTurn === playerId) {
      this.nextTurn();
    }

    this._updatedAt = new Date();
  }

  public startGame(): void {
    if (this._status !== 'waiting') {
      throw new DomainException('Game is not in waiting status');
    }
    if (this._players.size < 1) {
      throw new DomainException(
        'At least 1 player is required to start the game',
      );
    }

    this._status = 'active';
    this._currentTurn = Array.from(this._players.keys())[0];
    this._turnCount = 1;
    this._updatedAt = new Date();
  }

  public placeItem(
    itemId: string,
    position: ItemPosition,
    playerId: PlayerId,
  ): void {
    if (this._status !== 'active') {
      throw new DomainException('Game is not active');
    }
    if (this._currentTurn !== playerId) {
      throw new DomainException("It is not this player's turn");
    }
    if (!this._players.has(playerId)) {
      throw new DomainException('Player is not in the game');
    }

    // Check if position is valid
    if (!this.isValidPosition(position)) {
      throw new DomainException('Invalid position for the grid size');
    }

    // Check if position is occupied
    if (this.isPositionOccupied(position)) {
      throw new DomainException('Position is already occupied');
    }

    // Place the item
    this._itemPositions.set(itemId, position);
    this._updatedAt = new Date();

    // Check if game should end
    if (this.shouldEndGame()) {
      this.endGame();
    } else {
      this.nextTurn();
    }
  }

  private isValidPosition(position: ItemPosition): boolean {
    return (
      position.x >= 0 &&
      position.x < this._gridSize &&
      position.y >= 0 &&
      position.y < this._gridSize
    );
  }

  private isPositionOccupied(position: ItemPosition): boolean {
    for (const existingPosition of this._itemPositions.values()) {
      if (existingPosition.equals(position)) {
        return true;
      }
    }
    return false;
  }

  private shouldEndGame(): boolean {
    return (
      this._turnCount >= this._maxTurns ||
      this._itemPositions.size >= this._gridSize * this._gridSize
    );
  }

  private nextTurn(): void {
    const playerIds = Array.from(this._players.keys());
    const currentIndex = playerIds.indexOf(this._currentTurn!);
    const nextIndex = (currentIndex + 1) % playerIds.length;

    this._currentTurn = playerIds[nextIndex];
    this._turnCount++;
  }

  private endGame(): void {
    this._status = 'completed';
    this._currentTurn = null;
    this._updatedAt = new Date();
  }

  public calculateFinalScores(): Map<PlayerId, number> {
    const scores = new Map<PlayerId, number>();

    // Calculate scores based on animal happiness logic
    // This would integrate with the frontend's animalHappiness utility
    this._players.forEach((player, playerId) => {
      scores.set(playerId, this.calculatePlayerScore(playerId));
    });

    return scores;
  }

  private calculatePlayerScore(playerId: PlayerId): number {
    // Placeholder for score calculation logic
    // This would be implemented based on the game rules
    return 0;
  }

  // Getters
  public get id(): GameId {
    return this._id;
  }

  public get createdBy(): PlayerId {
    return this._createdBy;
  }

  public get status(): GameStatus {
    return this._status;
  }

  public get difficulty(): GameDifficulty {
    return this._difficulty;
  }

  public get gridSize(): GridSize {
    return this._gridSize;
  }

  public get players(): ReadonlyMap<PlayerId, Player> {
    return new Map(this._players);
  }

  public get currentTurn(): PlayerId | null {
    return this._currentTurn;
  }

  public get turnCount(): number {
    return this._turnCount;
  }

  public get maxTurns(): number {
    return this._maxTurns;
  }

  public get itemPositions(): ReadonlyMap<string, ItemPosition> {
    return new Map(this._itemPositions);
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public toJSON() {
    return {
      id: this._id,
      createdBy: this._createdBy,
      status: this._status,
      difficulty: this._difficulty,
      gridSize: this._gridSize,
      players: Array.from(this._players.values()).map((p) => p.toJSON()),
      currentTurn: this._currentTurn,
      turnCount: this._turnCount,
      maxTurns: this._maxTurns,
      itemPositions: Array.from(this._itemPositions.entries()).map(
        ([id, pos]) => ({
          itemId: id,
          position: pos.toJSON(),
        }),
      ),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
