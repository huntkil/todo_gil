import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from '../controllers/categoryController.js';

const router = express.Router();

// 모든 카테고리 조회
router.get('/', getAllCategories);

// 카테고리 생성
router.post('/', createCategory);

// 단일 카테고리 조회
router.get('/:id', getCategoryById);

// 카테고리별 통계
router.get('/:id/stats', getCategoryStats);

// 카테고리 수정
router.put('/:id', updateCategory);

// 카테고리 삭제
router.delete('/:id', deleteCategory);

export default router;
