import { abusiveWords } from './abusiveWords';

export const filterAbusiveContent = (content) => {
  const words = content.split(/\s+/);
  const filteredWords = words.map((word) => {
    if (abusiveWords.includes(word.toLowerCase())) {
      return '*'.repeat(word.length);
    }
    return word;
  });
  return filteredWords.join(' ');
};
