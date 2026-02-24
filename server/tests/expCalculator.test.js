const { totalExpForLevel, calculateExpGoal } = require('../src/utils/expCalculator');

describe('totalExpForLevel', () => {
  test('level 1 returns 0 experience', () => {
    expect(totalExpForLevel(1)).toBe(0);
  });

  test('level 2 returns correct experience', () => {
    // (50/3) * (8 - 24 + 34 - 12) = (50/3) * 6 = 100
    expect(totalExpForLevel(2)).toBe(100);
  });

  test('level 8 returns correct experience (starting level in Tibia)', () => {
    // (50/3) * (512 - 384 + 136 - 12) = (50/3) * 252 = 4200
    expect(totalExpForLevel(8)).toBe(4200);
  });

  test('level 100 returns correct experience', () => {
    const expected = Math.floor((50 / 3) * (Math.pow(100, 3) - 6 * Math.pow(100, 2) + 17 * 100 - 12));
    expect(totalExpForLevel(100)).toBe(expected);
  });

  test('throws on invalid level (0)', () => {
    expect(() => totalExpForLevel(0)).toThrow('Level must be a positive integer');
  });

  test('throws on negative level', () => {
    expect(() => totalExpForLevel(-5)).toThrow('Level must be a positive integer');
  });

  test('throws on non-integer level', () => {
    expect(() => totalExpForLevel(5.5)).toThrow('Level must be a positive integer');
  });
});

describe('calculateExpGoal', () => {
  test('calculates correct goal for level 100 to 200 in 30 days, 4h/day', () => {
    const result = calculateExpGoal(100, 200, 30, 4);

    expect(result.currentLevel).toBe(100);
    expect(result.targetLevel).toBe(200);
    expect(result.days).toBe(30);
    expect(result.hoursPerDay).toBe(4);
    expect(result.currentExp).toBe(totalExpForLevel(100));
    expect(result.targetExp).toBe(totalExpForLevel(200));
    expect(result.remainingExp).toBe(result.targetExp - result.currentExp);
    expect(result.expPerDay).toBe(Math.ceil(result.remainingExp / 30));
    expect(result.expPerHour).toBe(Math.ceil(result.expPerDay / 4));
  });

  test('throws when target level <= current level', () => {
    expect(() => calculateExpGoal(100, 100, 10, 3)).toThrow('Target level must be greater than current level');
    expect(() => calculateExpGoal(200, 100, 10, 3)).toThrow('Target level must be greater than current level');
  });

  test('throws when days is 0 or negative', () => {
    expect(() => calculateExpGoal(100, 200, 0, 3)).toThrow('Days must be a positive number');
    expect(() => calculateExpGoal(100, 200, -5, 3)).toThrow('Days must be a positive number');
  });

  test('throws when hoursPerDay is invalid', () => {
    expect(() => calculateExpGoal(100, 200, 10, 0)).toThrow('Hours per day must be greater than 0 and at most 24');
    expect(() => calculateExpGoal(100, 200, 10, 25)).toThrow('Hours per day must be greater than 0 and at most 24');
  });
});
