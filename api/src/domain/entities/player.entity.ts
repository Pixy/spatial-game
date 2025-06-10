import { DomainException } from '../../shared/exceptions/domain.exceptions';
import { PlayerId, PlayerName } from '../../shared/types/game.types';

export class Player {
  private constructor(
    private readonly _id: PlayerId,
    private _name: PlayerName,
    private _score: number = 0,
    private _isActive: boolean = true,
  ) {
    this.validatePlayer();
  }

  public static create(id: PlayerId, name: PlayerName): Player {
    return new Player(id, name);
  }

  public static fromPersistence(
    id: PlayerId,
    name: PlayerName,
    score: number,
    isActive: boolean,
  ): Player {
    return new Player(id, name, score, isActive);
  }

  private validatePlayer(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new DomainException('Player ID cannot be empty');
    }
    if (!this._name || this._name.trim().length === 0) {
      throw new DomainException('Player name cannot be empty');
    }
    if (this._name.length > 50) {
      throw new DomainException('Player name cannot exceed 50 characters');
    }
    if (this._score < 0) {
      throw new DomainException('Player score cannot be negative');
    }
  }

  public updateScore(points: number): void {
    if (points < 0) {
      throw new DomainException('Points to add cannot be negative');
    }
    this._score += points;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public activate(): void {
    this._isActive = true;
  }

  public changeName(newName: PlayerName): void {
    if (!newName || newName.trim().length === 0) {
      throw new DomainException('New name cannot be empty');
    }
    if (newName.length > 50) {
      throw new DomainException('New name cannot exceed 50 characters');
    }
    this._name = newName.trim();
  }

  // Getters
  public get id(): PlayerId {
    return this._id;
  }

  public get name(): PlayerName {
    return this._name;
  }

  public get score(): number {
    return this._score;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public equals(other: Player): boolean {
    return this._id === other._id;
  }

  public toJSON() {
    return {
      id: this._id,
      name: this._name,
      score: this._score,
      isActive: this._isActive,
    };
  }
}
