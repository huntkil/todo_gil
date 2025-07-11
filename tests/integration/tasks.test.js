const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Task = require('../../models/Task');
const Category = require('../../models/Category');

describe('Task API Integration Tests', () => {
    let testCategory;
    let testTask;

    beforeAll(async () => {
        // 테스트 데이터베이스 연결
        await mongoose.connect(process.env.MONGODB_URI);
        
        // 테스트 카테고리 생성
        testCategory = await Category.create({
            name: '테스트 카테고리',
            color: '#ff0000'
        });
    });

    afterAll(async () => {
        // 테스트 데이터 정리
        await Task.deleteMany({});
        await Category.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // 각 테스트 전에 기존 태스크 삭제
        await Task.deleteMany({});
    });

    describe('GET /api/tasks', () => {
        test('모든 태스크 조회', async () => {
            // 테스트 태스크 생성
            await Task.create({
                title: '테스트 태스크',
                description: '테스트 설명',
                category: testCategory._id,
                priority: 3,
                status: 'pending',
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });

            const response = await request(app)
                .get('/api/tasks')
                .expect(200);

            expect(response.body).toHaveProperty('tasks');
            expect(response.body).toHaveProperty('pagination');
            expect(Array.isArray(response.body.tasks)).toBe(true);
            expect(response.body.tasks.length).toBe(1);
            expect(response.body.tasks[0].title).toBe('테스트 태스크');
        });

        test('빈 태스크 목록 조회', async () => {
            const response = await request(app)
                .get('/api/tasks')
                .expect(200);

            expect(response.body).toHaveProperty('tasks');
            expect(response.body).toHaveProperty('pagination');
            expect(Array.isArray(response.body.tasks)).toBe(true);
            expect(response.body.tasks.length).toBe(0);
        });
    });

    describe('POST /api/tasks', () => {
        test('새 태스크 생성', async () => {
            const newTask = {
                title: '새로운 태스크',
                description: '새로운 태스크 설명',
                category: testCategory._id,
                priority: 1,
                status: 'pending',
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            };

            const response = await request(app)
                .post('/api/tasks')
                .send(newTask)
                .expect(201);

            expect(response.body).toHaveProperty('task');
            expect(response.body).toHaveProperty('duplicates');
            expect(response.body.task.title).toBe(newTask.title);
            expect(response.body.task.description).toBe(newTask.description);
            expect(response.body.task.category).toBe(testCategory._id.toString());
        });

        test('필수 필드 누락 시 에러', async () => {
            const invalidTask = {
                description: '설명만 있는 태스크'
            };

            await request(app)
                .post('/api/tasks')
                .send(invalidTask)
                .expect(400);
        });
    });

    describe('GET /api/tasks/:id', () => {
        test('특정 태스크 조회', async () => {
            const task = await Task.create({
                title: '조회할 태스크',
                description: '조회할 태스크 설명',
                category: testCategory._id,
                priority: 3,
                status: 'pending',
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });

            const response = await request(app)
                .get(`/api/tasks/${task._id}`)
                .expect(200);

            expect(response.body.title).toBe('조회할 태스크');
            expect(response.body._id).toBe(task._id.toString());
        });

        test('존재하지 않는 태스크 조회', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            
            await request(app)
                .get(`/api/tasks/${fakeId}`)
                .expect(404);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        test('태스크 수정', async () => {
            const task = await Task.create({
                title: '수정할 태스크',
                description: '수정할 태스크 설명',
                category: testCategory._id,
                priority: 5,
                status: 'pending',
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });

            const updatedData = {
                title: '수정된 태스크',
                description: '수정된 설명',
                priority: 1
            };

            const response = await request(app)
                .put(`/api/tasks/${task._id}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.title).toBe(updatedData.title);
            expect(response.body.description).toBe(updatedData.description);
            expect(response.body.priority).toBe(updatedData.priority);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        test('태스크 삭제', async () => {
            const task = await Task.create({
                title: '삭제할 태스크',
                description: '삭제할 태스크 설명',
                category: testCategory._id,
                priority: 3,
                status: 'pending',
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });

            await request(app)
                .delete(`/api/tasks/${task._id}`)
                .expect(200);

            // 삭제 확인
            const deletedTask = await Task.findById(task._id);
            expect(deletedTask).toBeNull();
        });
    });

    describe('PATCH /api/tasks/:id/progress', () => {
        test('진행률 업데이트', async () => {
            const task = await Task.create({
                title: '진행률 업데이트 태스크',
                description: '진행률 업데이트 설명',
                category: testCategory._id,
                priority: 3,
                status: 'in_progress',
                progress: 0,
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });

            const progressData = {
                progress: 50
            };

            const response = await request(app)
                .patch(`/api/tasks/${task._id}/progress`)
                .send(progressData)
                .expect(200);

            expect(response.body.progress).toBe(50);
        });
    });

    describe('GET /api/tasks/stats', () => {
        test('대시보드 통계 조회', async () => {
            // 다양한 상태의 태스크 생성
            await Task.create([
                {
                    title: '완료된 태스크 1',
                    category: testCategory._id,
                    status: 'completed',
                    progress: 100,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                {
                    title: '진행중인 태스크 1',
                    category: testCategory._id,
                    status: 'in_progress',
                    progress: 50,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                {
                    title: '대기중인 태스크 1',
                    category: testCategory._id,
                    status: 'pending',
                    progress: 0,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
            ]);

            const response = await request(app)
                .get('/api/tasks/stats')
                .expect(200);

            expect(response.body).toHaveProperty('stats');
            expect(response.body).toHaveProperty('categoryStats');
            expect(response.body.stats).toHaveProperty('totalTasks');
            expect(response.body.stats).toHaveProperty('completedTasks');
            expect(response.body.stats).toHaveProperty('inProgressTasks');
            expect(response.body.stats).toHaveProperty('pendingTasks');
            expect(response.body.stats.totalTasks[0].count).toBe(3);
        });
    });
}); 