/**
 * Notification Service
 * خدمة الإشعارات باستخدام WebSocket
 */

/**
 * Send notification to user
 * إرسال إشعار لمستخدم محدد
 */
const sendNotification = (userId, notification) => {
  if (global.io) {
    global.io.to(`user_${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Send notification to manager
 * إرسال إشعار للمدير
 */
const notifyManager = (managerId, notification) => {
  sendNotification(managerId, notification);
};

/**
 * Send notification to team member
 * إرسال إشعار لعضو الفريق
 */
const notifyTeamMember = (memberId, notification) => {
  sendNotification(memberId, notification);
};

/**
 * Send task assignment notification
 * إشعار عند تعيين مهمة
 */
const notifyTaskAssignment = (userId, task) => {
  notifyTeamMember(userId, {
    type: 'task_assigned',
    title: 'تم تعيين مهمة جديدة',
    message: `تم تعيينك على المهمة: ${task.title}`,
    taskId: task._id,
    priority: task.priority,
  });
};

/**
 * Send task status change notification
 * إشعار عند تغيير حالة المهمة
 */
const notifyTaskStatusChange = (managerId, task, oldStatus, newStatus) => {
  notifyManager(managerId, {
    type: 'task_status_changed',
    title: 'تم تغيير حالة المهمة',
    message: `تم تغيير حالة المهمة "${task.title}" من ${oldStatus} إلى ${newStatus}`,
    taskId: task._id,
    oldStatus,
    newStatus,
  });
};

/**
 * Send note added notification
 * إشعار عند إضافة ملاحظة
 */
const notifyNoteAdded = (userId, note, task) => {
  sendNotification(userId, {
    type: 'note_added',
    title: 'تم إضافة ملاحظة جديدة',
    message: `تم إضافة ملاحظة على المهمة: ${task.title}`,
    noteId: note._id,
    taskId: task._id,
    isImportant: note.isImportant,
  });
};

module.exports = {
  sendNotification,
  notifyManager,
  notifyTeamMember,
  notifyTaskAssignment,
  notifyTaskStatusChange,
  notifyNoteAdded,
};

