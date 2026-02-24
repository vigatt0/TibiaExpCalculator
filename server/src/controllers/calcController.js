const { validationResult } = require('express-validator');
const { calculateExpGoal } = require('../utils/expCalculator');

function calculate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentLevel, targetLevel, days, hoursPerDay } = req.body;
    const result = calculateExpGoal(currentLevel, targetLevel, days, hoursPerDay);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { calculate };
