import { DomainException } from '../../shared/exceptions/domain.exceptions';
import { Position } from '../../shared/types';

export class ItemPosition {
  constructor(
    private readonly _x: number,
    private readonly _y: number,
  ) {
    this.validatePosition(_x, _y);
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  // Legacy getters for backward compatibility
  get row(): number {
    return this._y;
  }

  get col(): number {
    return this._x;
  }

  equals(other: ItemPosition): boolean {
    return this._x === other._x && this._y === other._y;
  }

  isAdjacent(other: ItemPosition): boolean {
    const xDiff = Math.abs(this._x - other._x);
    const yDiff = Math.abs(this._y - other._y);

    return (xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1);
  }

  isAdjacentTo(other: ItemPosition): boolean {
    return this.isAdjacent(other);
  }

  distanceTo(other: ItemPosition): number {
    return Math.abs(this._x - other._x) + Math.abs(this._y - other._y);
  }

  isWithinBounds(maxX: number, maxY: number): boolean {
    return this._x >= 0 && this._x < maxX && this._y >= 0 && this._y < maxY;
  }

  toPosition(): Position {
    return { row: this._y, col: this._x };
  }

  toJSON() {
    return { x: this._x, y: this._y };
  }

  static fromPosition(position: Position): ItemPosition {
    return new ItemPosition(position.col, position.row);
  }

  static fromCoordinates(x: number, y: number): ItemPosition {
    return new ItemPosition(x, y);
  }

  static fromJSON(data: { x: number; y: number }): ItemPosition {
    return new ItemPosition(data.x, data.y);
  }

  private validatePosition(x: number, y: number): void {
    if (x < 0 || y < 0) {
      throw new DomainException('Position coordinates must be non-negative');
    }
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new DomainException('Position coordinates must be integers');
    }
    if (x > 100 || y > 100) {
      throw new DomainException('Position coordinates are too large (max 100)');
    }
  }
}
