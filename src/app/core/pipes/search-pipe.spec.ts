import { SearchPipe } from './search-pipe';

interface TestModel {
  id: number;
  name: string;
  email: string;
}

describe('SearchPipe', () => {
  let pipe: SearchPipe;

  const testData: TestModel[] = [
    { id: 1, name: 'John', email: 'john@test.com' },
    { id: 2, name: 'Alice', email: 'alice@test.com' },
    { id: 3, name: 'Bob', email: 'bob@test.com' },
  ];

  beforeEach(() => {
    pipe = new SearchPipe();
  });

  it('should create pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array when items is null', () => {
    expect(pipe.transform(null, 'john')).toEqual([]);
  });

  it('should return original items when search text is empty', () => {
    expect(pipe.transform(testData, '')).toEqual(testData);
  });

  it('should search globally across all fields', () => {
    const result = pipe.transform(testData, 'john');

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('John');
  });

  it('should be case insensitive search', () => {
    const result = pipe.transform(testData, 'ALICE');

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Alice');
  });

  it('should search using specific fields only', () => {
    const result = pipe.transform(testData, 'bob', ['name']);

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Bob');
  });

  it('should not match when searching in wrong field', () => {
    const result = pipe.transform(testData, 'xyz', ['email']);

    expect(result).toEqual([]);
  });

  it('should handle undefined field values safely', () => {
    const dataWithUndefined = [{ id: 1, name: 'Test', email: undefined as any }];

    const result = pipe.transform(dataWithUndefined, 'test');

    expect(result.length).toBe(1);
  });
});
