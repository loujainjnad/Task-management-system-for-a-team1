const mongoose = require('mongoose');
const { TASK_STATUS, TASK_PRIORITY } = require('../utils/constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان المهمة مطلوب'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'المشروع مطلوب'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستخدم المسؤول مطلوب'],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستخدم الذي عين المهمة مطلوب'],
    },
    dueDate: {
      type: Date,
      required: [true, 'تاريخ التسليم مطلوب'],
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.PENDING,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// فهرس للبحث السريع
taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

// Virtual للملاحظات
taskSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'task',
});

// Middleware لتحديث تاريخ الإنجاز عند تغيير الحالة
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === TASK_STATUS.COMPLETED && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('status') && this.status !== TASK_STATUS.COMPLETED) {
    this.completedAt = null;
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

