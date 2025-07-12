import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // 기본 카테고리 생성
    await createDefaultCategories();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDefaultCategories = async () => {
  const { default: Category } = await import('../models/Category.js');

  const defaultCategories = [
    {
      name: '개발',
      color: '#3498db',
      icon: 'code',
      description: '소프트웨어 개발 관련 업무',
    },
    {
      name: '회의',
      color: '#e74c3c',
      icon: 'users',
      description: '회의 및 협업 관련 업무',
    },
    {
      name: '기획',
      color: '#f39c12',
      icon: 'lightbulb',
      description: '기획 및 설계 관련 업무',
    },
    {
      name: '문서작업',
      color: '#27ae60',
      icon: 'file-text',
      description: '문서 작성 및 편집 업무',
    },
    {
      name: '디자인',
      color: '#9b59b6',
      icon: 'palette',
      description: '디자인 관련 업무',
    },
    {
      name: '마케팅',
      color: '#e67e22',
      icon: 'trending-up',
      description: '마케팅 및 홍보 업무',
    },
    {
      name: '운영',
      color: '#34495e',
      icon: 'settings',
      description: '시스템 운영 및 관리 업무',
    },
    {
      name: '기타',
      color: '#95a5a6',
      icon: 'more-horizontal',
      description: '기타 업무',
    },
  ];

  for (const category of defaultCategories) {
    try {
      await Category.findOneAndUpdate({ name: category.name }, category, {
        upsert: true,
        new: true,
      });
    } catch (error) {
      console.log(
        `Category ${category.name} already exists or error:`,
        error.message
      );
    }
  }
};

export default connectDB;
