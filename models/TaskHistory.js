import mongoose from 'mongoose';

const taskHistorySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    action: {
      type: String,
      enum: [
        'created',
        'updated',
        'status_changed',
        'progress_updated',
        'deleted',
      ],
      required: true,
    },
    changes: {
      type: Object, // 변경된 필드들 저장
    },
    notes: {
      type: String,
      trim: true,
    },
    // 변경 전 값
    previousValues: {
      type: Object,
    },
    // 변경 후 값
    newValues: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 설정
taskHistorySchema.index({ taskId: 1, createdAt: -1 });
taskHistorySchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('TaskHistory', taskHistorySchema);
