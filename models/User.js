import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // 알림 설정
    notificationSettings: {
      email: {
        enabled: { type: Boolean, default: true },
        deadlineReminder: { type: Boolean, default: true },
        taskAssigned: { type: Boolean, default: true },
        statusChanged: { type: Boolean, default: false },
      },
      slack: {
        enabled: { type: Boolean, default: false },
        webhookUrl: { type: String },
        channel: { type: String, default: '#general' },
        deadlineReminder: { type: Boolean, default: true },
        taskAssigned: { type: Boolean, default: true },
        statusChanged: { type: Boolean, default: false },
      },
      push: {
        enabled: { type: Boolean, default: true },
        deadlineReminder: { type: Boolean, default: true },
        taskAssigned: { type: Boolean, default: true },
        statusChanged: { type: Boolean, default: false },
      },
    },
    // 외부 서비스 연동
    integrations: {
      googleCalendar: {
        enabled: { type: Boolean, default: false },
        accessToken: { type: String },
        refreshToken: { type: String },
        calendarId: { type: String, default: 'primary' },
        syncEnabled: { type: Boolean, default: true },
      },
      outlook: {
        enabled: { type: Boolean, default: false },
        accessToken: { type: String },
        refreshToken: { type: String },
        calendarId: { type: String },
        syncEnabled: { type: Boolean, default: true },
      },
    },
    // 알림 시간 설정
    reminderSettings: {
      deadlineReminderDays: { type: Number, default: 1 }, // 마감 몇일 전 알림
      dailyDigest: { type: Boolean, default: false },
      digestTime: { type: String, default: '09:00' }, // 일일 요약 시간
      timezone: { type: String, default: 'Asia/Seoul' },
    },
  },
  {
    timestamps: true,
  }
);

// 비밀번호 해싱
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 검증
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
