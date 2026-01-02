const Task = require('../models/Task');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS, ACTIVITY_TYPES, TASK_STATUS } = require('../utils/constants');

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = asyncHandler(async (req, res) => {
  let query = {};

  // إذا كان المستخدم عضو فريق، يعرض فقط مهامه
  if (req.user.role === 'Team Member') {
    query.assignedTo = req.user._id;
  }

  // فلترة حسب المشروع
  if (req.query.project) {
    query.project = req.query.project;
  }

  // فلترة حسب الحالة
  if (req.query.status) {
    query.status = req.query.status;
  }

  // فلترة حسب الأولوية
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  const features = new APIFeatures(
    Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email'),
    req.query
  )
    .filter()
    .search(['title', 'description'])
    .sort()
    .limitFields()
    .paginate();

  const tasks = await features.query;
  const total = await Task.countDocuments(features.query.getQuery());

  const pagination = await features.getPaginationInfo(total);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: tasks.length,
    pagination,
    data: {
      tasks,
    },
  });
});

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'name description')
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email')
    .populate({
      path: 'notes',
      populate: {
        path: 'createdBy',
        select: 'name email',
      },
      options: {
        sort: { createdAt: -1 },
      },
    });

  if (!task) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'المهمة غير موجودة',
    });
  }

  // التحقق من الصلاحيات
  if (req.user.role === 'Team Member' && task.assignedTo._id.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'ليس لديك صلاحية للوصول إلى هذه المهمة',
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      task,
    },
  });
});

/**
 * @desc    Create task
 * @route   POST /api/tasks
 * @access  Private/Manager
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignedTo, dueDate, priority, tags } = req.body;

  // التحقق من وجود المشروع
  const projectExists = await Project.findById(project);
  if (!projectExists) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'المشروع غير موجود',
    });
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo,
    assignedBy: req.user._id,
    dueDate,
    priority: priority || 'medium',
    tags: tags || [],
  });

  await ActivityLog.create({
    user: req.user._id,
    activityType: ACTIVITY_TYPES.TASK_CREATED,
    description: `تم إنشاء مهمة جديدة: ${task.title}`,
    entityType: 'Task',
    entityId: task._id,
    metadata: {
      assignedTo: assignedTo,
      project: project,
    },
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'تم إنشاء المهمة بنجاح',
    data: {
      task,
    },
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'المهمة غير موجودة',
    });
  }

  // التحقق من الصلاحيات
  const isAssignedTo = task.assignedTo.toString() === req.user._id.toString();
  const isManager = req.user.role === 'Manager';

  if (!isAssignedTo && !isManager) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'ليس لديك صلاحية لتعديل هذه المهمة',
    });
  }

  const { title, description, dueDate, priority, status, tags } = req.body;
  const oldStatus = task.status;

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (dueDate) task.dueDate = dueDate;
  if (priority) task.priority = priority;
  if (tags) task.tags = tags;

  // عضو الفريق يمكنه تحديث الحالة فقط
  // المدير يمكنه تحديث جميع الحقول
  if (isManager) {
    if (status) task.status = status;
    if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;
  } else if (isAssignedTo && status) {
    task.status = status;
  }

  await task.save();

  // تسجيل تغيير الحالة
  if (status && status !== oldStatus) {
    await ActivityLog.create({
      user: req.user._id,
      activityType: ACTIVITY_TYPES.TASK_STATUS_CHANGED,
      description: `تم تغيير حالة المهمة "${task.title}" من ${oldStatus} إلى ${status}`,
      entityType: 'Task',
      entityId: task._id,
      metadata: {
        oldStatus,
        newStatus: status,
      },
    });
  } else {
    await ActivityLog.create({
      user: req.user._id,
      activityType: ACTIVITY_TYPES.TASK_UPDATED,
      description: `تم تحديث المهمة: ${task.title}`,
      entityType: 'Task',
      entityId: task._id,
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'تم تحديث المهمة بنجاح',
    data: {
      task,
    },
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private/Manager
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'المهمة غير موجودة',
    });
  }

  await task.deleteOne();

  await ActivityLog.create({
    user: req.user._id,
    activityType: ACTIVITY_TYPES.TASK_DELETED,
    description: `تم حذف المهمة: ${task.title}`,
    entityType: 'Task',
    entityId: task._id,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'تم حذف المهمة بنجاح',
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

