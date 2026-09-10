/**
 * Calculate reading time for text containing Chinese and English
 */
export function getReadingTime(content: string): { text: string; minutes: number; words: number } {
  if (!content) {
    return { text: '1 分钟阅读', minutes: 1, words: 0 };
  }

  // Remove HTML tags and markdown formatting
  const clean = content
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`.*?`/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[#*_\-~]/g, '');

  // Count Chinese characters
  const chineseChars = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
  // Count English words
  const englishWords = (clean.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b[a-zA-Z0-9_-]+\b/g) || []).length;

  const totalWords = chineseChars + englishWords;
  // Average reading speed: 300 Chinese characters/words per minute
  const minutes = Math.max(1, Math.ceil(totalWords / 300));

  return {
    text: `${minutes} 分钟阅读`,
    minutes,
    words: totalWords,
  };
}
