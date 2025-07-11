const {
    normalizeKoreanText,
    extractKeywords,
    calculateSimilarity,
    parseDateFromText
} = require('../../utils/textSimilarity');

describe('Text Similarity Utils', () => {
    describe('normalizeKoreanText', () => {
        test('한국어 텍스트 정규화', () => {
            expect(normalizeKoreanText('안녕하세요!')).toBe('안녕하세요');
            expect(normalizeKoreanText('  공백  정리  ')).toBe('공백 정리');
            expect(normalizeKoreanText('대소문자 Test')).toBe('대소문자 test');
        });

        test('빈 값 처리', () => {
            expect(normalizeKoreanText('')).toBe('');
            expect(normalizeKoreanText(null)).toBe('');
            expect(normalizeKoreanText(undefined)).toBe('');
        });

        test('특수문자 제거', () => {
            expect(normalizeKoreanText('테스트@#$%^&*()')).toBe('테스트');
            expect(normalizeKoreanText('프로젝트-업무_관리')).toBe('프로젝트업무관리');
        });
    });

    describe('extractKeywords', () => {
        test('키워드 추출', () => {
            const keywords = extractKeywords('프로젝트 업무 관리 시스템');
            expect(Array.isArray(keywords)).toBe(true);
            expect(keywords.length).toBeGreaterThan(0);
        });

        test('빈 제목 처리', () => {
            expect(extractKeywords('')).toEqual([]);
            expect(extractKeywords(null)).toEqual([]);
        });
    });

    describe('calculateSimilarity', () => {
        test('동일한 텍스트', () => {
            expect(calculateSimilarity('테스트', '테스트')).toBe(1);
        });

        test('유사한 텍스트', () => {
            const similarity = calculateSimilarity('프로젝트 관리', '프로젝트 매니지먼트');
            expect(similarity).toBeGreaterThan(0);
            expect(similarity).toBeLessThan(1);
        });

        test('완전히 다른 텍스트', () => {
            const similarity = calculateSimilarity('프로젝트', '휴가');
            expect(similarity).toBeLessThan(0.5);
        });

        test('빈 값 처리', () => {
            expect(calculateSimilarity('', '테스트')).toBe(0);
            expect(calculateSimilarity('테스트', '')).toBe(0);
            expect(calculateSimilarity('', '')).toBe(0);
        });
    });

    describe('parseDateFromText', () => {
        test('오늘 날짜 파싱', () => {
            const result = parseDateFromText('오늘 회의');
            expect(result).toBeInstanceOf(Date);
        });

        test('내일 날짜 파싱', () => {
            const result = parseDateFromText('내일 데드라인');
            expect(result).toBeInstanceOf(Date);
        });

        test('날짜가 없는 텍스트', () => {
            const result = parseDateFromText('일반 업무');
            expect(result).toBeNull();
        });

        test('빈 텍스트', () => {
            expect(parseDateFromText('')).toBeNull();
            expect(parseDateFromText(null)).toBeNull();
        });
    });
}); 