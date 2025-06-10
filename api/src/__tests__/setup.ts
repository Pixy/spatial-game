// Global test setup
jest.setTimeout(10000);

// Mock UUID generation for consistent tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

// Global test utilities
global.createMockRepository = <T>() =>
  ({
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  }) as jest.Mocked<T>;
