import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateProgress,
  checkDuplicates,
  getSuggestions,
  getDashboardStats,
} from '../controllers/taskController.js';

const router = express.Router();

// 모든 업무 조회
router.get('/', getAllTasks);

// 대시보드 통계
router.get('/stats', getDashboardStats);

// 자동완성 제안
router.get('/suggestions', getSuggestions);

// 중복 감지
router.post('/check-duplicates', checkDuplicates);

// 업무 생성
router.post('/', createTask);

// 단일 업무 조회
router.get('/:id', getTaskById);

// 업무 수정
router.put('/:id', updateTask);

// 업무 삭제
router.delete('/:id', deleteTask);

// 진행률 업데이트
router.patch('/:id/progress', updateProgress);

export default router;
