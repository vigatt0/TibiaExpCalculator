/**
 * Calculate total experience needed to reach a given level.
 * Official Tibia formula: TotalExp = (50/3) * (L^3 - 6*L^2 + 17*L - 12)
 * @param {number} level - The target level (must be >= 1)
 * @returns {number} Total experience for that level
 */
function totalExpForLevel(level) {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error('Level must be a positive integer');
  }
  return Math.floor((50 / 3) * (Math.pow(level, 3) - 6 * Math.pow(level, 2) + 17 * level - 12));
}

/**
 * Calculate the EXP goal breakdown.
 * @param {number} currentLevel
 * @param {number} targetLevel
 * @param {number} days - Number of days to reach the goal
 * @param {number} hoursPerDay - Hours of play per day
 * @returns {object} Calculation results
 */
function calculateExpGoal(currentLevel, targetLevel, days, hoursPerDay) {
  if (currentLevel >= targetLevel) {
    throw new Error('Target level must be greater than current level');
  }
  if (days <= 0) {
    throw new Error('Days must be a positive number');
  }
  if (hoursPerDay <= 0 || hoursPerDay > 24) {
    throw new Error('Hours per day must be greater than 0 and at most 24');
  }

  const currentExp = totalExpForLevel(currentLevel);
  const targetExp = totalExpForLevel(targetLevel);
  const remainingExp = targetExp - currentExp;
  const expPerDay = Math.ceil(remainingExp / days);
  const expPerHour = Math.ceil(expPerDay / hoursPerDay);

  return {
    currentLevel,
    targetLevel,
    days,
    hoursPerDay,
    currentExp,
    targetExp,
    remainingExp,
    expPerDay,
    expPerHour,
  };
}

module.exports = { totalExpForLevel, calculateExpGoal };
