const { validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const { calculateExpGoal } = require('../utils/expCalculator');

async function createGoal(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { characterName, currentLevel, targetLevel, days, hoursPerDay } = req.body;
    const calc = calculateExpGoal(currentLevel, targetLevel, days, hoursPerDay);

    const goal = await Goal.create({
      user: req.userId,
      characterName,
      ...calc,
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getGoals(req, res) {
  try {
    const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

async function deleteGoal(req, res) {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found.' });
    }
    res.json({ message: 'Goal deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { createGoal, getGoals, deleteGoal };
