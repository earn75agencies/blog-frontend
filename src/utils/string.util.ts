/**
 * String utility functions
 * Provides common string manipulation and formatting functions
 */

/**
 * Generate a random string
 * @param length - Length of the string
 * @param chars - Characters to use
 * @returns Random string
 */
export const randomString = (length: number = 10, chars: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a slug from a string
 * @param text - Text to convert to slug
 * @returns Slug string
 */
export const slugify = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove hyphens from start
    .replace(/-+$/, ''); // Remove hyphens from end
};

/**
 * Truncate string to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add if truncated
 * @returns Truncated string
 */
export const truncate = (text: string, length: number = 100, suffix: string = '...'): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length - suffix.length) + suffix;
};

/**
 * Capitalize first letter of string
 * @param text - Text to capitalize
 * @returns Capitalized string
 */
export const capitalize = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param text - Text to convert
 * @returns Title case string
 */
export const titleCase = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Extract excerpt from HTML content
 * @param html - HTML content
 * @param length - Maximum length
 * @returns Excerpt
 */
export const extractExcerpt = (html: string, length: number = 200): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');

  // Remove extra whitespace
  const cleaned = text.replace(/\s+/g, ' ').trim();

  return truncate(cleaned, length);
};

/**
 * Count words in a string
 * @param text - Text to count words in
 * @returns Word count
 */
export const wordCount = (text: string): number => {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  // Remove HTML tags if present
  const cleaned = text.replace(/<[^>]*>/g, '');

  // Count words
  const words = cleaned.trim().split(/\s+/);
  return words.length;
};

/**
 * Estimate reading time in minutes
 * @param text - Text to estimate
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export const readingTime = (text: string, wordsPerMinute: number = 200): number => {
  const words = wordCount(text);
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Mask email address
 * @param email - Email address
 * @returns Masked email
 */
export const maskEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return email;
  }

  const maskedLocal = localPart.length > 2
    ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
    : '*'.repeat(localPart.length);

  return `${maskedLocal}@${domain}`;
};

/**
 * Format number with commas
 * @param number - Number to format
 * @returns Formatted number
 */
export const formatNumber = (number: number): string => {
  if (typeof number !== 'number') {
    return '';
  }

  return number.toLocaleString('en-US');
};

/**
 * Pluralize a word based on count
 * @param count - Count
 * @param singular - Singular form
 * @param plural - Plural form (optional)
 * @returns Pluralized word
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) {
    return singular;
  }

  return plural || singular + 's';
};

/**
 * Generate initials from name
 * @param name - Full name
 * @returns Initials
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Remove HTML tags from string
 * @param html - HTML string
 * @returns Plain text
 */
export const stripHTML = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Escape special regex characters
 * @param string - String to escape
 * @returns Escaped string
 */
export const escapeRegex = (string: string): string => {
  if (!string || typeof string !== 'string') {
    return '';
  }

  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Check if string is a valid URL
 * @param url - URL to validate
 * @returns True if valid URL
 */
export const isValidURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if string is a valid email
 * @param email - Email to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Normalize whitespace in string
 * @param text - Text to normalize
 * @returns Normalized text
 */
export const normalizeWhitespace = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/\s+/g, ' ').trim();
};

/**
 * Convert camelCase to kebab-case
 * @param text - Text to convert
 * @returns Kebab-case string
 */
export const camelToKebab = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Convert kebab-case to camelCase
 * @param text - Text to convert
 * @returns CamelCase string
 */
export const kebabToCamel = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Remove diacritics from string
 * @param text - Text to process
 * @returns Text without diacritics
 */
export const removeDiacritics = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Generate a unique ID
 * @returns Unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Highlight search term in text
 * @param text - Text to highlight in
 * @param searchTerm - Search term to highlight
 * @param className - CSS class for highlighted text
 * @returns HTML string with highlighted text
 */
export const highlightText = (text: string, searchTerm: string, className: string = 'highlight'): string => {
  if (!text || !searchTerm) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
};

/**
 * Remove accents/diacritics from string
 * @param text - Text to process
 * @returns Text without accents
 */
export const removeAccents = (text: string): string => {
  return removeDiacritics(text);
};

/**
 * Convert string to sentence case
 * @param text - Text to convert
 * @returns Sentence case string
 */
export const toSentenceCase = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert string to camel case
 * @param text - Text to convert
 * @returns Camel case string
 */
export const toCamelCase = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Convert string to snake case
 * @param text - Text to convert
 * @returns Snake case string
 */
export const toSnakeCase = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/\s+/g, '_');
};

/**
 * Convert string to constant case
 * @param text - Text to convert
 * @returns Constant case string
 */
export const toConstantCase = (text: string): string => {
  return toSnakeCase(text).toUpperCase();
};

/**
 * Convert string to pascal case
 * @param text - Text to convert
 * @returns Pascal case string
 */
export const toPascalCase = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Pad string to specified length
 * @param text - Text to pad
 * @param length - Target length
 * @param padString - String to pad with
 * @param side - Side to pad ('start' or 'end')
 * @returns Padded string
 */
export const pad = (text: string, length: number, padString: string = ' ', side: 'start' | 'end' = 'end'): string => {
  if (!text || typeof text !== 'string') {
    text = '';
  }

  if (side === 'start') {
    return text.padStart(length, padString);
  } else {
    return text.padEnd(length, padString);
  }
};

/**
 * Remove leading and trailing whitespace
 * @param text - Text to trim
 * @returns Trimmed string
 */
export const trim = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.trim();
};

/**
 * Remove leading whitespace
 * @param text - Text to trim
 * @returns Trimmed string
 */
export const trimStart = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/^\s+/, '');
};

/**
 * Remove trailing whitespace
 * @param text - Text to trim
 * @returns Trimmed string
 */
export const trimEnd = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/\s+$/, '');
};

/**
 * Repeat string
 * @param text - Text to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 */
export const repeat = (text: string, count: number): string => {
  if (!text || typeof text !== 'string' || count < 0) {
    return '';
  }

  return text.repeat(count);
};

/**
 * Reverse string
 * @param text - Text to reverse
 * @returns Reversed string
 */
export const reverse = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.split('').reverse().join('');
};

/**
 * Check if string starts with substring
 * @param text - Text to check
 * @param substring - Substring to check for
 * @returns True if string starts with substring
 */
export const startsWith = (text: string, substring: string): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return text.startsWith(substring);
};

/**
 * Check if string ends with substring
 * @param text - Text to check
 * @param substring - Substring to check for
 * @returns True if string ends with substring
 */
export const endsWith = (text: string, substring: string): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return text.endsWith(substring);
};

/**
 * Check if string contains substring
 * @param text - Text to check
 * @param substring - Substring to check for
 * @returns True if string contains substring
 */
export const contains = (text: string, substring: string): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return text.includes(substring);
};

/**
 * Replace all occurrences of substring
 * @param text - Text to process
 * @param search - Substring to search for
 * @param replace - Replacement string
 * @returns String with replacements
 */
export const replaceAll = (text: string, search: string, replace: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.split(search).join(replace);
};

/**
 * Split string into chunks
 * @param text - Text to split
 * @param chunkSize - Size of each chunk
 * @returns Array of chunks
 */
export const chunk = (text: string, chunkSize: number): string[] => {
  if (!text || typeof text !== 'string' || chunkSize <= 0) {
    return [];
  }

  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
};

/**
 * Wrap string at specified length
 * @param text - Text to wrap
 * @param length - Maximum length per line
 * @returns Wrapped string
 */
export const wrap = (text: string, length: number): string => {
  if (!text || typeof text !== 'string' || length <= 0) {
    return text || '';
  }

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length <= length) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
};

/**
 * Count occurrences of substring in string
 * @param text - Text to search in
 * @param substring - Substring to count
 * @returns Number of occurrences
 */
export const countOccurrences = (text: string, substring: string): number => {
  if (!text || !substring) {
    return 0;
  }

  return (text.match(new RegExp(escapeRegex(substring), 'g')) || []).length;
};

/**
 * Remove empty lines from string
 * @param text - Text to process
 * @returns Text without empty lines
 */
export const removeEmptyLines = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
};

/**
 * Get first N characters of string
 * @param text - Text to process
 * @param n - Number of characters
 * @returns First N characters
 */
export const first = (text: string, n: number): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.substring(0, n);
};

/**
 * Get last N characters of string
 * @param text - Text to process
 * @param n - Number of characters
 * @returns Last N characters
 */
export const last = (text: string, n: number): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.substring(text.length - n);
};

