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
  
  // Simple avg calculation
  const expPerDay = Math.ceil(remainingExp / days);
  const expPerHour = Math.ceil(expPerDay / hoursPerDay);

  // Stamina Calculation (3 hours Green Stamina @ 150%)
  const bonusHours = Math.min(hoursPerDay, 3);
  const normalHours = Math.max(hoursPerDay - 3, 0);
  
  // "Effective" hours if we normalize everything to 100% speed
  // (e.g. 1 hour of green stamina does the work of 1.5 hours of normal stamina)
  const effectiveHours = (bonusHours * 1.5) + (normalHours * 1.0);
  
  // The base XP/hr required at 100% speed to meet the daily goal
  const baseExpPerHour = Math.ceil(expPerDay / effectiveHours);
  
  // XP/hr you see in analyzer when at 150%
  const greenExpPerHour = Math.ceil(baseExpPerHour * 1.5);
  
  // XP/hr you see in analyzer when at 100% (Orange)
  const orangeExpPerHour = Math.ceil(baseExpPerHour * 1.0);

  return { 
    currentExp, 
    targetExp, 
    remainingExp, 
    expPerDay, 
    expPerHour,
    greenExpPerHour,
    orangeExpPerHour
  };
}

export function formatNumber(num) {
  return num.toLocaleString('en-US');
}
