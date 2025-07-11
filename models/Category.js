const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    color: {
        type: String,
        default: '#3498db',
        match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    },
    icon: {
        type: String,
        default: 'folder'
    },
    description: {
        type: String,
        trim: true
    },
    // 카테고리별 통계 정보
    stats: {
        totalTasks: {
            type: Number,
            default: 0
        },
        completedTasks: {
            type: Number,
            default: 0
        },
        averageCompletionTime: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// 카테고리 삭제 시 관련 업무들의 카테고리를 기본값으로 변경하는 미들웨어
categorySchema.pre('remove', async function(next) {
    const Task = mongoose.model('Task');
    await Task.updateMany(
        { category: this._id },
        { category: null }
    );
    next();
});

module.exports = mongoose.model('Category', categorySchema); 