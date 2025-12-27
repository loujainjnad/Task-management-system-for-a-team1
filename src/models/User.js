

const mongoose = require('mongoose');
const { USER_ROLES } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'الاسم مطلوب'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صحيح'],
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: [8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'],
      select: false, // لا يتم إرجاع كلمة المرور تلقائياً
    },
    role: {
      type: String,
      enum: [USER_ROLES.MANAGER, USER_ROLES.TEAM_MEMBER],
      default: USER_ROLES.TEAM_MEMBER,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // حقول إعادة تعيين كلمة المرور
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt و updatedAt تلقائياً
  }
);

// فهرس للبحث السريع
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Method لإزالة البيانات الحساسة عند التحويل إلى JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

