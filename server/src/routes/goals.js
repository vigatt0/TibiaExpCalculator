const { Router } = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { createGoal, getGoals, deleteGoal } = require('../controllers/goalController');

const router = Router();

router.use(auth);

router.post(
  '/',
  [
    body('characterName').trim().notEmpty().withMessage('Character name is required'),
    body('currentLevel').isInt({ min: 1 }).withMessage('Current level must be a positive integer'),
    body('targetLevel').isInt({ min: 2 }).withMessage('Target level must be at least 2'),
    body('days').isInt({ min: 1 }).withMessage('Days must be a positive integer'),
    body('hoursPerDay').isFloat({ min: 0.1, max: 24 }).withMessage('Hours per day must be between 0.1 and 24'),
  ],
  createGoal
);

router.get('/', getGoals);

router.delete('/:id', deleteGoal);

module.exports = router;
