const mongoose = require('mongoose');
const { ACTIVITY_TYPES } = require('../utils/constants');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستخدم مطلوب'],
    },
    activityType: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
      required: [true, 'نوع النشاط مطلوب'],
    },
    description: {
      type: String,
      required: [true, 'الوصف مطلوب'],
    },
    entityType: {
      type: String,
      enum: ['User', 'Project', 'Task', 'Note', 'Auth'],
      default: null,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// فهرس للبحث السريع
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ activityType: 1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;

