import { PlayerId } from '../../shared/types/game.types';
import { Game } from '../entities/game.entity';
import { ItemPosition } from '../value-objects/item-position.vo';

export class GameDomainService {
  /**
   * Calculate happiness score for animals based on their positions
   * This implements the core game logic from the frontend
   */
  public calculateHappinessScore(
    game: Game,
    animalPositions: Map<string, ItemPosition>,
  ): number {
    let totalHappiness = 0;
    const gridSize = game.gridSize;

    animalPositions.forEach((position, animalId) => {
      const animalHappiness = this.calculateAnimalHappiness(
        animalId,
        position,
        animalPositions,
        gridSize,
      );
      totalHappiness += animalHappiness;
    });

    return totalHappiness;
  }

  private calculateAnimalHappiness(
    animalId: string,
    position: ItemPosition,
    allPositions: Map<string, ItemPosition>,
    gridSize: number,
  ): number {
    // Base happiness from position
    let happiness = this.getPositionHappiness(position, gridSize);

    // Bonus from neighboring animals
    const neighbors = this.getNeighbors(position, allPositions);
    happiness += this.getNeighborBonus(animalId, neighbors);

    // Environmental factors
    happiness += this.getEnvironmentalBonus(position, gridSize);

    return Math.max(0, happiness); // Happiness cannot be negative
  }

  private getPositionHappiness(
    position: ItemPosition,
    gridSize: number,
  ): number {
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);

    const distanceFromCenter =
      Math.abs(position.x - centerX) + Math.abs(position.y - centerY);
    const maxDistance = centerX + centerY;

    // Animals are happier closer to center
    return Math.round((1 - distanceFromCenter / maxDistance) * 50);
  }

  private getNeighbors(
    position: ItemPosition,
    allPositions: Map<string, ItemPosition>,
  ): string[] {
    const neighbors: string[] = [];

    allPositions.forEach((otherPosition, animalId) => {
      if (
        !position.equals(otherPosition) &&
        position.isAdjacentTo(otherPosition)
      ) {
        neighbors.push(animalId);
      }
    });

    return neighbors;
  }

  private getNeighborBonus(animalId: string, neighbors: string[]): number {
    // Simple compatibility system - animals of same type like each other
    const animalType = this.getAnimalType(animalId);
    let bonus = 0;

    neighbors.forEach((neighborId) => {
      const neighborType = this.getAnimalType(neighborId);
      if (animalType === neighborType) {
        bonus += 10; // Same type bonus
      } else {
        bonus += 5; // Different type, smaller bonus
      }
    });

    return bonus;
  }

  private getAnimalType(animalId: string): string {
    // Extract animal type from ID (assuming format like "cat_1", "dog_2", etc.)
    return animalId.split('_')[0] || 'unknown';
  }

  private getEnvironmentalBonus(
    position: ItemPosition,
    gridSize: number,
  ): number {
    let bonus = 0;

    // Corner bonus
    if (this.isCorner(position, gridSize)) {
      bonus += 5;
    }

    // Edge bonus
    if (this.isEdge(position, gridSize)) {
      bonus += 3;
    }

    return bonus;
  }

  private isCorner(position: ItemPosition, gridSize: number): boolean {
    return (
      (position.x === 0 || position.x === gridSize - 1) &&
      (position.y === 0 || position.y === gridSize - 1)
    );
  }

  private isEdge(position: ItemPosition, gridSize: number): boolean {
    return (
      position.x === 0 ||
      position.x === gridSize - 1 ||
      position.y === 0 ||
      position.y === gridSize - 1
    );
  }

  /**
   * Validate if a player can make a move
   */
  public canPlayerMakeMove(
    game: Game,
    playerId: PlayerId,
    position: ItemPosition,
  ): boolean {
    if (game.status !== 'active') {
      return false;
    }

    if (game.currentTurn !== playerId) {
      return false;
    }

    if (!game.players.has(playerId)) {
      return false;
    }

    // Check if position is valid and not occupied
    if (
      position.x < 0 ||
      position.x >= game.gridSize ||
      position.y < 0 ||
      position.y >= game.gridSize
    ) {
      return false;
    }

    // Check if position is already occupied
    for (const existingPosition of game.itemPositions.values()) {
      if (existingPosition.equals(position)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determine game winner based on final scores
   */
  public determineWinner(finalScores: Map<PlayerId, number>): PlayerId | null {
    if (finalScores.size === 0) {
      return null;
    }

    let maxScore = -1;
    let winner: PlayerId | null = null;
    let hasTie = false;

    finalScores.forEach((score, playerId) => {
      if (score > maxScore) {
        maxScore = score;
        winner = playerId;
        hasTie = false;
      } else if (score === maxScore) {
        hasTie = true;
      }
    });

    return hasTie ? null : winner;
  }

  /**
   * Check if game should end based on current state
   */
  public shouldGameEnd(game: Game): boolean {
    if (game.status !== 'active') {
      return false;
    }

    // End if max turns reached
    if (game.turnCount >= game.maxTurns) {
      return true;
    }

    // End if grid is full
    if (game.itemPositions.size >= game.gridSize * game.gridSize) {
      return true;
    }

    // End if no players left
    if (game.players.size === 0) {
      return true;
    }

    return false;
  }
}
