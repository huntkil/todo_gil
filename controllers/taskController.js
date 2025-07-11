const Task = require('../models/Task');
// eslint-disable-next-line no-unused-vars
const Category = require('../models/Category');
const TaskHistory = require('../models/TaskHistory');
const { 
    normalizeKoreanText, 
    extractKeywords, 
    detectTaskDuplicates, 
    generateSuggestions,
    parseDateFromText 
} = require('../utils/textSimilarity');

// 모든 업무 조회
const getAllTasks = async (req, res) => {
    try {
        const { 
            status, 
            category, 
            priority, 
            search, 
            startDate, 
            endDate,
            page = 1,
            limit = 20
        } = req.query;

        const filter = {};

        // 상태 필터
        if (status) {
            filter.status = status;
        }

        // 카테고리 필터
        if (category) {
            filter.category = category;
        }

        // 우선순위 필터
        if (priority) {
            filter.priority = parseInt(priority);
        }

        // 날짜 범위 필터
        if (startDate || endDate) {
            filter.startDate = {};
            if (startDate) filter.startDate.$gte = new Date(startDate);
            if (endDate) filter.startDate.$lte = new Date(endDate);
        }

        // 검색 필터
        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (page - 1) * limit;
        
        const tasks = await Task.find(filter)
            .populate('category', 'name color icon')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(filter);

        res.json({
            tasks,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 단일 업무 조회
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('category', 'name color icon')
            .populate('similarTasks.taskId', 'title status progress');

        if (!task) {
            return res.status(404).json({ message: '업무를 찾을 수 없습니다.' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 업무 생성
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority,
            startDate,
            endDate,
            tags,
            estimatedTime
        } = req.body;

        // 제목 정규화 및 키워드 추출
        const normalizedTitle = normalizeKoreanText(title);
        const keywords = extractKeywords(title);

        // 중복 감지
        const duplicates = await detectTaskDuplicates(title, category, Task);

        // 날짜 파싱 (자연어 처리)
        let parsedStartDate = startDate ? new Date(startDate) : new Date();
        let parsedEndDate = endDate ? new Date(endDate) : new Date();

        // 설명에서 날짜 정보 추출
        if (description) {
            const dateFromDesc = parseDateFromText(description);
            if (dateFromDesc && !endDate) {
                parsedEndDate = dateFromDesc;
            }
        }

        const task = new Task({
            title,
            description,
            category,
            priority: priority || 3,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            tags: tags || [],
            normalizedTitle,
            keywords,
            estimatedTime
        });

        const savedTask = await task.save();

        // 이력 기록
        await TaskHistory.create({
            taskId: savedTask._id,
            action: 'created',
            newValues: savedTask.toObject()
        });

        // 중복 감지 결과와 함께 응답
        res.status(201).json({
            task: savedTask,
            duplicates: duplicates
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 업무 수정
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updates = req.body;

        // 기존 업무 조회
        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.status(404).json({ message: '업무를 찾을 수 없습니다.' });
        }

        // 제목이 변경된 경우 정규화 및 키워드 업데이트
        if (updates.title) {
            updates.normalizedTitle = normalizeKoreanText(updates.title);
            updates.keywords = extractKeywords(updates.title);
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            updates,
            { new: true, runValidators: true }
        ).populate('category', 'name color icon');

        // 이력 기록
        await TaskHistory.create({
            taskId: taskId,
            action: 'updated',
            previousValues: existingTask.toObject(),
            newValues: updatedTask.toObject(),
            changes: updates
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 업무 삭제
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: '업무를 찾을 수 없습니다.' });
        }

        await Task.findByIdAndDelete(req.params.id);

        // 이력 기록
        await TaskHistory.create({
            taskId: req.params.id,
            action: 'deleted',
            previousValues: task.toObject()
        });

        res.json({ message: '업무가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 진행률 업데이트
const updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: '업무를 찾을 수 없습니다.' });
        }

        const previousProgress = task.progress;
        task.progress = progress;

        // 진행률이 100%가 되면 상태를 완료로 변경
        if (progress >= 100) {
            task.status = 'completed';
        } else if (progress > 0 && task.status === 'pending') {
            task.status = 'in_progress';
        }

        const updatedTask = await task.save();

        // 이력 기록
        await TaskHistory.create({
            taskId: taskId,
            action: 'progress_updated',
            previousValues: { progress: previousProgress },
            newValues: { progress, status: updatedTask.status }
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 중복 감지 API
const checkDuplicates = async (req, res) => {
    try {
        const { title, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: '제목이 필요합니다.' });
        }

        const duplicates = await detectTaskDuplicates(title, category, Task);
        res.json(duplicates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 자동완성 제안
const getSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.json({ suggestions: [] });
        }

        const suggestions = await generateSuggestions(query, Task, 10);
        res.json({ suggestions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 대시보드 통계
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const stats = await Task.aggregate([
            {
                $facet: {
                    totalTasks: [{ $count: 'count' }],
                    completedTasks: [
                        { $match: { status: 'completed' } },
                        { $count: 'count' }
                    ],
                    pendingTasks: [
                        { $match: { status: 'pending' } },
                        { $count: 'count' }
                    ],
                    inProgressTasks: [
                        { $match: { status: 'in_progress' } },
                        { $count: 'count' }
                    ],
                    todayTasks: [
                        {
                            $match: {
                                startDate: {
                                    $gte: new Date(today.setHours(0, 0, 0, 0)),
                                    $lt: new Date(today.setHours(23, 59, 59, 999))
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    overdueTasks: [
                        {
                            $match: {
                                endDate: { $lt: today },
                                status: { $nin: ['completed', 'cancelled'] }
                            }
                        },
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        // 카테고리별 통계
        const categoryStats = await Task.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            }
        ]);

        res.json({
            stats: stats[0],
            categoryStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateProgress,
    checkDuplicates,
    getSuggestions,
    getDashboardStats
}; 