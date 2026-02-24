/**
 * Calculate total experience for a given level using Tibia's official formula.
 * TotalExp = (50/3) * (L^3 - 6*L^2 + 17*L - 12)
 */
export function totalExpForLevel(level) {
  return Math.floor((50 / 3) * (Math.pow(level, 3) - 6 * Math.pow(level, 2) + 17 * level - 12));
}

export function calculateExpGoal(currentLevel, targetLevel, days, hoursPerDay) {
  const currentExp = totalExpForLevel(currentLevel);
  const targetExp = totalExpForLevel(targetLevel);
  const remainingExp = targetExp - currentExp;
  const expPerDay = Math.ceil(remainingExp / days);
  const expPerHour = Math.ceil(expPerDay / hoursPerDay);

  return { currentExp, targetExp, remainingExp, expPerDay, expPerHour };
}

export function formatNumber(num) {
  return num.toLocaleString('en-US');
}
