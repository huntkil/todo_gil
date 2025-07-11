const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    priority: {
        type: Number,
        enum: [1, 2, 3, 4, 5], // 1: 매우 높음, 5: 매우 낮음
        default: 3
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'],
        default: 'pending'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    // 중복 감지를 위한 정규화된 제목
    normalizedTitle: {
        type: String,
        index: true
    },
    // 업무 키워드 (검색 최적화용)
    keywords: [{
        type: String,
        trim: true
    }],
    // 반복 업무 정보
    recurring: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        pattern: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        parentTaskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    },
    // 유사 업무 참조 (중복 감지 시 연결)
    similarTasks: [{
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        },
        similarity: {
            type: Number,
            min: 0,
            max: 1
        }
    }],
    // 예상 소요 시간 (분 단위)
    estimatedTime: {
        type: Number,
        min: 0
    },
    // 실제 소요 시간 (분 단위)
    actualTime: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true
});

// 인덱스 설정
taskSchema.index({ title: 'text', description: 'text', keywords: 'text' });
taskSchema.index({ startDate: 1, endDate: 1 });
taskSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('Task', taskSchema); 