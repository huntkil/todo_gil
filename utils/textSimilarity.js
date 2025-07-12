import stringSimilarity from 'string-similarity';
import natural from 'natural';
import Hangul from 'hangul-js';

// 한국어 텍스트 정규화
const normalizeKoreanText = (text) => {
  if (!text) return '';
  // 언더스코어 포함 모든 특수문자 제거
  const cleaned = text.replace(/[^\w\s가-힣]|_/gi, '');
  // 한글 정규화(분해 후 재조합)
  const disassembled = Hangul.disassemble(cleaned);
  const reassembled = Hangul.assemble(disassembled);
  return reassembled.toLowerCase().replace(/\s+/g, ' ').trim();
};

// 업무 제목 키워드 추출 (한글/영어 모두 공백 기준 분리)
const extractKeywords = (title) => {
  if (!title) return [];
  return title.split(/\s+/).filter((word) => word.length > 1);
};

// 음성학적 유사도 계산 (한국어 특화)
const calculatePhoneticSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;

  // 한글 자모 분해 후 유사도 계산
  const decomposed1 = Hangul.disassemble(text1).join('');
  const decomposed2 = Hangul.disassemble(text2).join('');

  return stringSimilarity.compareTwoStrings(decomposed1, decomposed2);
};

// 유사도 계산 (여러 알고리즘 조합)
const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;

  // 1. 문자열 유사도
  const stringSim = stringSimilarity.compareTwoStrings(text1, text2);

  // 2. 키워드 기반 유사도
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);
  const keywordSim = natural.JaroWinklerDistance(
    keywords1.join(' '),
    keywords2.join(' ')
  );

  // 3. 음성학적 유사도 (한국어 특화)
  const phoneticSim = calculatePhoneticSimilarity(text1, text2);

  // 가중 평균 계산
  return stringSim * 0.4 + keywordSim * 0.4 + phoneticSim * 0.2;
};

// 날짜 파싱 함수
const parseDateFromText = (text) => {
  if (!text) return null;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const datePatterns = {
    오늘: today,
    내일: tomorrow,
    모레: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    이번주: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    다음주: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
  };

  for (const [pattern, date] of Object.entries(datePatterns)) {
    if (text.includes(pattern)) {
      return date;
    }
  }

  return null;
};

// 중복 감지 메인 로직
const detectTaskDuplicates = async (inputTitle, inputCategory, Task) => {
  const normalizedInput = normalizeKoreanText(inputTitle);

  // 같은 카테고리 우선 검색
  const sameCategory = await Task.find({ category: inputCategory });
  const allTasks = await Task.find({});

  const results = {
    exactDuplicates: [],
    similarTasks: [],
    suggestions: [],
  };

  // 카테고리 내 검색 (가중치 높음)
  sameCategory.forEach((task) => {
    const similarity = calculateSimilarity(
      normalizedInput,
      task.normalizedTitle
    );
    if (similarity >= 0.9) {
      results.exactDuplicates.push({ task, similarity });
    } else if (similarity >= 0.7) {
      results.similarTasks.push({ task, similarity });
    }
  });

  // 전체 검색 (가중치 낮음)
  allTasks.forEach((task) => {
    if (task.category.toString() === inputCategory.toString()) return; // 이미 처리됨

    const similarity =
      calculateSimilarity(normalizedInput, task.normalizedTitle) * 0.8;
    if (similarity >= 0.6) {
      results.suggestions.push({ task, similarity });
    }
  });

  // 유사도 순으로 정렬
  results.exactDuplicates.sort((a, b) => b.similarity - a.similarity);
  results.similarTasks.sort((a, b) => b.similarity - a.similarity);
  results.suggestions.sort((a, b) => b.similarity - a.similarity);

  return results;
};

// 자동완성 제안 생성
const generateSuggestions = async (inputText, Task, limit = 5) => {
  const normalizedInput = normalizeKoreanText(inputText);
  const allTasks = await Task.find({});

  const suggestions = allTasks
    .map((task) => ({
      task,
      similarity: calculateSimilarity(normalizedInput, task.normalizedTitle),
    }))
    .filter((item) => item.similarity >= 0.3)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return suggestions;
};

export {
  normalizeKoreanText,
  extractKeywords,
  calculateSimilarity,
  parseDateFromText,
  detectTaskDuplicates,
  generateSuggestions,
};
