import Category from '../models/Category.js';
import Task from '../models/Task.js';

// 모든 카테고리 조회
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 단일 카테고리 조회
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 카테고리 생성
const createCategory = async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;

    // 중복 이름 체크
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: '이미 존재하는 카테고리명입니다.' });
    }

    const category = new Category({
      name,
      color: color || '#3498db',
      icon: icon || 'folder',
      description,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 카테고리 수정
const updateCategory = async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;
    const categoryId = req.params.id;

    // 이름 변경 시 중복 체크
    if (name) {
      const existingCategory = await Category.findOne({
        name,
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: '이미 존재하는 카테고리명입니다.' });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, color, icon, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 카테고리 삭제
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 해당 카테고리의 업무 수 확인
    const taskCount = await Task.countDocuments({ category: categoryId });
    if (taskCount > 0) {
      return res.status(400).json({
        message: `이 카테고리에 ${taskCount}개의 업무가 있어 삭제할 수 없습니다.`,
      });
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }

    res.json({ message: '카테고리가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 카테고리별 통계
const getCategoryStats = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const stats = await Task.aggregate([
      { $match: { category: categoryId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalProgress: { $sum: '$progress' },
          avgProgress: { $avg: '$progress' },
        },
      },
    ]);

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }

    res.json({
      category,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
};
