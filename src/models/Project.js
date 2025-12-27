const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم المشروع مطلوب'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'تاريخ البداية مطلوب'],
    },
    endDate: {
      type: Date,
      required: [true, 'تاريخ الانتهاء مطلوب'],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية',
      },
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المدير مطلوب'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'on_hold'],
      default: 'active',
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// فهرس للبحث السريع
projectSchema.index({ manager: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });

// Virtual لحساب عدد المهام
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

