import { ItemPosition } from '../../../domain/value-objects/item-position.vo';
import { DomainException } from '../../../shared/exceptions/domain.exceptions';

describe('ItemPosition Value Object', () => {
  describe('constructor', () => {
    it('should create a valid position', () => {
      const position = new ItemPosition(5, 10);

      expect(position.x).toBe(5);
      expect(position.y).toBe(10);
      expect(position.col).toBe(5); // legacy getter
      expect(position.row).toBe(10); // legacy getter
    });

    it('should throw error for invalid coordinates', () => {
      expect(() => new ItemPosition(-1, 10)).toThrow(DomainException);
      expect(() => new ItemPosition(5, -1)).toThrow(DomainException);
    });
  });

  describe('equals', () => {
    it('should return true for equal positions', () => {
      const pos1 = new ItemPosition(5, 10);
      const pos2 = new ItemPosition(5, 10);

      expect(pos1.equals(pos2)).toBe(true);
    });

    it('should return false for different positions', () => {
      const pos1 = new ItemPosition(5, 10);
      const pos2 = new ItemPosition(5, 11);

      expect(pos1.equals(pos2)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const position = new ItemPosition(5, 10);

      const json = position.toJSON();
      expect(json).toEqual({
        x: 5,
        y: 10,
      });
    });
  });
});
