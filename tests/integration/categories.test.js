/* eslint-env jest */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app.js');
const Category = require('../../models/Category.js');

describe('Category API Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await Category.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Category.deleteMany({});
  });

  describe('GET /api/categories', () => {
    test('모든 카테고리 조회', async () => {
      // 테스트 카테고리 생성
      const response = await request(app).get('/api/categories').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);

      // 생성한 카테고리들이 응답에 포함되어 있는지 확인
      const categoryNames = response.body.map((cat) => cat.name);
      expect(categoryNames).toContain('업무');
      expect(categoryNames).toContain('개인');
    });

    test('빈 카테고리 목록 조회', async () => {
      // 모든 카테고리 삭제
      await Category.deleteMany({});

      const response = await request(app).get('/api/categories').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('POST /api/categories', () => {
    test('새 카테고리 생성', async () => {
      const newCategory = {
        name: '새로운 카테고리',
        color: '#0000ff',
      };

      const response = await request(app)
        .post('/api/categories')
        .send(newCategory)
        .expect(201);

      expect(response.body.name).toBe(newCategory.name);
      expect(response.body.color).toBe(newCategory.color);
    });

    test('필수 필드 누락 시 에러', async () => {
      const invalidCategory = {
        color: '#ff0000',
      };

      await request(app)
        .post('/api/categories')
        .send(invalidCategory)
        .expect(400);
    });

    test('중복된 이름으로 생성 시 에러', async () => {
      // 첫 번째 카테고리 생성
      await Category.create({
        name: '중복 카테고리',
        color: '#ff0000',
      });

      // 같은 이름으로 다시 생성
      const duplicateCategory = {
        name: '중복 카테고리',
        color: '#00ff00',
      };

      await request(app)
        .post('/api/categories')
        .send(duplicateCategory)
        .expect(400);
    });
  });

  describe('GET /api/categories/:id', () => {
    test('특정 카테고리 조회', async () => {
      const category = await Category.create({
        name: '조회할 카테고리',
        color: '#ff0000',
      });

      const response = await request(app)
        .get(`/api/categories/${category._id}`)
        .expect(200);

      expect(response.body.name).toBe('조회할 카테고리');
      expect(response.body._id).toBe(category._id.toString());
    });

    test('존재하지 않는 카테고리 조회', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app).get(`/api/categories/${fakeId}`).expect(404);
    });
  });

  describe('PUT /api/categories/:id', () => {
    test('카테고리 수정', async () => {
      const category = await Category.create({
        name: '수정할 카테고리',
        color: '#ff0000',
      });

      const updatedData = {
        name: '수정된 카테고리',
        color: '#00ff00',
      };

      const response = await request(app)
        .put(`/api/categories/${category._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.color).toBe(updatedData.color);
    });

    test('존재하지 않는 카테고리 수정', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updatedData = {
        name: '수정된 카테고리',
        color: '#00ff00',
      };

      await request(app)
        .put(`/api/categories/${fakeId}`)
        .send(updatedData)
        .expect(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    test('카테고리 삭제', async () => {
      const category = await Category.create({
        name: '삭제할 카테고리',
        color: '#ff0000',
      });

      await request(app).delete(`/api/categories/${category._id}`).expect(200);

      // 삭제 확인
      const deletedCategory = await Category.findById(category._id);
      expect(deletedCategory).toBeNull();
    });

    test('존재하지 않는 카테고리 삭제', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app).delete(`/api/categories/${fakeId}`).expect(404);
    });
  });
});
