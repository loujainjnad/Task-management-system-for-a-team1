const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks.controller');
const { protect } = require('../middleware/auth.middleware');
const { isManager } = require('../middleware/role.middleware');
const { validate, validateObjectId } = require('../middleware/validation.middleware');
const { TASK_STATUS, TASK_PRIORITY } = require('../utils/constants');

const router = express.Router();

// جميع المسارات محمية
router.use(protect);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Private
 */
router.get('/', getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task
 * @access  Private
 */
router.get('/:id', validateObjectId(), getTask);

/**
 * @route   POST /api/tasks
 * @desc    Create task
 * @access  Private/Manager
 */
router.post(
  '/',
  isManager,
  [
    body('title').trim().notEmpty().withMessage('عنوان المهمة مطلوب'),
    body('description').optional().trim(),
    body('project').isMongoId().withMessage('معرف المشروع غير صحيح'),
    body('assignedTo').isMongoId().withMessage('معرف المستخدم غير صحيح'),
    body('dueDate').isISO8601().withMessage('تاريخ التسليم غير صحيح'),
    body('priority').optional().isIn(Object.values(TASK_PRIORITY)),
    body('tags').optional().isArray(),
  ],
  validate,
  createTask
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put(
  '/:id',
  validateObjectId(),
  [
    body('title').optional().trim().notEmpty().withMessage('عنوان المهمة مطلوب'),
    body('description').optional().trim(),
    body('dueDate').optional().isISO8601().withMessage('تاريخ التسليم غير صحيح'),
    body('priority').optional().isIn(Object.values(TASK_PRIORITY)),
    body('status').optional().isIn(Object.values(TASK_STATUS)),
    body('assignedTo').optional().isMongoId().withMessage('معرف المستخدم غير صحيح'),
    body('tags').optional().isArray(),
  ],
  validate,
  updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private/Manager
 */
router.delete('/:id', isManager, validateObjectId(), deleteTask);

module.exports = router;

