/**
 * Comprehensive Bilingual (Arabic & English) Text Normalization & Search Engine
 * Solves PDF extraction quirks:
 * 1. Arabic Harakat / Tashkeel (فتحة، ضمة، كسرة، تنوين، شدة، سكون)
 * 2. Arabic letter variants (أ, إ, آ, ٱ -> ا | ة <-> ه | ي <-> ى | ـ كشيدة تطويل)
 * 3. Arabic Presentation Forms-A and Forms-B (stored in older PDFs as single glyphs)
 * 4. Reversed Arabic characters (Visual vs Logical order in legacy PDF engines)
 * 5. English ligatures (fi, fl, ff, ffi, ffl) via Unicode NFKC
 * 6. Smart curly quotes, apostrophes, dashes, and varied whitespace
 */

// Arabic Diacritics (Harakat / Tashkeel) range
const ARABIC_DIACRITICS_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
// Arabic Tatweel / Kashida
const ARABIC_TATWEEL_REGEX = /\u0640/g;

/**
 * Normalizes text for robust indexing and comparison:
 * - Decomposes ligatures and presentation forms using Unicode NFKC
 * - Strips Arabic diacritics and tatweel
 * - Unifies Arabic letter variations (Hamzas, Taa Marbuta, Alif Maqsura)
 * - Normalizes quotes, hyphens, and whitespace
 */
export function normalizeTextForSearch(
  text: string,
  options: {
    caseSensitive?: boolean;
    normalizeArabic?: boolean;
  } = {}
): string {
  if (!text) return '';

  const { caseSensitive = false, normalizeArabic = true } = options;

  // 1. Unicode NFKC Normalization:
  // Converts English ligatures (ﬁ -> fi, ﬂ -> fl, ﬀ -> ff, etc.)
  // Converts Arabic Presentation Forms-A & B (\uFB50-\uFDFF, \uFE70-\uFEFF) to standard Arabic characters
  let normalized = text.normalize('NFKC');

  // 2. Normalize smart quotes and dashes
  normalized = normalized
    .replace(/[\u2018\u2019\u201A\u201B\u0060\u00B4]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2212\u2010\u2011]/g, '-');

  // 3. Normalize Arabic if enabled
  if (normalizeArabic) {
    normalized = normalized
      .replace(ARABIC_DIACRITICS_REGEX, '')
      .replace(ARABIC_TATWEEL_REGEX, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/[ىي]/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي');
  }

  // 4. Case sensitivity
  if (!caseSensitive) {
    normalized = normalized.toLowerCase();
  }

  // 5. Clean whitespace: collapse multiple spaces and newlines into single spaces
  normalized = normalized.replace(/\s+/g, ' ');

  return normalized;
}

/**
 * Reverses an Arabic word or string to catch text saved in visual RTL reverse order
 */
export function reverseString(str: string): string {
  return Array.from(str).reverse().join('');
}

/**
 * Checks if a string contains Arabic characters
 */
export function containsArabic(str: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(str);
}

/**
 * Builds a flexible RegExp for accurate highlight matching in the original snippet,
 * respecting Arabic diacritics, letter variations, and English case.
 */
export function createFlexibleSearchRegex(
  term: string,
  caseSensitive: boolean = false
): RegExp {
  const trimmed = term.trim();
  if (!trimmed) return /(?:)/;

  const chars = Array.from(trimmed);
  const optionalDiacritics = '[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640\\u200B-\\u200F\\uFEFF]*';
  const optionalInterChar = '[\\u200B-\\u200F\\uFEFF]?[\\s]?[\\u200B-\\u200F\\uFEFF]?';

  const patternParts: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (/\s/.test(ch)) {
      patternParts.push('\\s+');
      continue;
    }

    let charPattern = '';
    if (/[اأإآٱ]/.test(ch)) {
      charPattern = `[اأإآٱ]${optionalDiacritics}`;
    } else if (/[ةهہ]/.test(ch)) {
      charPattern = `[ةهہهٔ]${optionalDiacritics}`;
    } else if (/[يىئسیے]/.test(ch)) {
      charPattern = `[يىئسیے]${optionalDiacritics}`;
    } else if (/[كکگ]/.test(ch)) {
      charPattern = `[كکگ]${optionalDiacritics}`;
    } else if (ch === 'و' || ch === 'ؤ') {
      charPattern = `[وؤ]${optionalDiacritics}`;
    } else if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(ch)) {
      const escaped = ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      charPattern = `${escaped}${optionalDiacritics}`;
    } else if (ch === "'") {
      charPattern = "['\\u2018\\u2019\\u201A\\u201B`´]";
    } else if (ch === '"') {
      charPattern = '["\\u201C\\u201D\\u201E\\u201F]';
    } else if (ch === '-') {
      charPattern = '[-—–−‐\\u00AD]';
    } else {
      const escaped = ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      charPattern = escaped;
    }

    // Connect characters with optional inter-character spaces or soft breaks if not first
    if (patternParts.length > 0 && !patternParts[patternParts.length - 1].endsWith('\\s+')) {
      patternParts.push(optionalInterChar);
    }
    patternParts.push(charPattern);
  }

  const flags = caseSensitive ? 'g' : 'gi';
  return new RegExp(`(${patternParts.join('')})`, flags);
}

export interface MatchSnippetInfo {
  matchCount: number;
  snippets: string[];
}

/**
 * Searches for a query within page text using smart normalized matching.
 * Returns match count and surrounding context snippets.
 */
export function findMatchesInPage(
  rawPageText: string,
  searchQuery: string,
  options: {
    caseSensitive?: boolean;
    wholeWord?: boolean;
  } = {}
): MatchSnippetInfo {
  const queryTrimmed = searchQuery.trim();
  if (!queryTrimmed || !rawPageText) {
    return { matchCount: 0, snippets: [] };
  }

  const { caseSensitive = false, wholeWord = false } = options;

  // Clean raw page text spaces for consistent snippet slicing
  const cleanRawText = rawPageText.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n');

  // Build flexible search regex that matches directly in the clean raw text
  let regex: RegExp;
  try {
    const baseRegex = createFlexibleSearchRegex(queryTrimmed, caseSensitive);
    if (wholeWord) {
      regex = new RegExp(`(?:^|\\s|[.,!?;:"'()\\[\\]{}])${baseRegex.source}(?=$|\\s|[.,!?;:"'()\\[\\]{}])`, baseRegex.flags);
    } else {
      regex = baseRegex;
    }
  } catch {
    // Fallback simple escaped regex
    const escaped = queryTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regex = new RegExp(`(${escaped})`, caseSensitive ? 'g' : 'gi');
  }

  const snippets: string[] = [];
  let matchCount = 0;
  let match: RegExpExecArray | null;

  // 1. Primary forward search using flexible regex
  while ((match = regex.exec(cleanRawText)) !== null) {
    matchCount++;

    if (snippets.length < 5) {
      const matchIndex = match.index;
      const matchLength = match[0].length;

      const snippetStart = Math.max(0, matchIndex - 50);
      const snippetEnd = Math.min(cleanRawText.length, matchIndex + matchLength + 60);

      let snippet = cleanRawText.slice(snippetStart, snippetEnd).replace(/\s+/g, ' ').trim();
      if (snippetStart > 0) snippet = '...' + snippet;
      if (snippetEnd < cleanRawText.length) snippet = snippet + '...';

      snippets.push(snippet);
    }

    if (regex.lastIndex === match.index) {
      regex.lastIndex++;
    }
  }

  // 2. Secondary fallback: Normalized search
  // If no match found yet, try normalized comparison (useful if characters had disparate encoding)
  if (matchCount === 0) {
    const normalizedPage = normalizeTextForSearch(cleanRawText, { caseSensitive });
    const normalizedQuery = normalizeTextForSearch(queryTrimmed, { caseSensitive });

    if (normalizedQuery && normalizedPage.includes(normalizedQuery)) {
      let idx = 0;
      while ((idx = normalizedPage.indexOf(normalizedQuery, idx)) !== -1) {
        matchCount++;
        if (snippets.length < 5) {
          const start = Math.max(0, idx - 50);
          const end = Math.min(cleanRawText.length, idx + normalizedQuery.length + 60);
          let snippet = cleanRawText.slice(start, end).replace(/\s+/g, ' ').trim();
          if (start > 0) snippet = '...' + snippet;
          if (end < cleanRawText.length) snippet = snippet + '...';
          snippets.push(snippet);
        }
        idx += Math.max(1, normalizedQuery.length);
      }
    }
  }

  // 3. Tertiary fallback: Reverse Arabic search
  // In some PDFs, Arabic is printed in visual LTR order (letters reversed: e.g. "مرحبا" -> "ابحرم")
  if (matchCount === 0 && containsArabic(queryTrimmed)) {
    const reversedQuery = reverseString(queryTrimmed);
    const reversedRegex = createFlexibleSearchRegex(reversedQuery, caseSensitive);

    let revMatch: RegExpExecArray | null;
    while ((revMatch = reversedRegex.exec(cleanRawText)) !== null) {
      matchCount++;
      if (snippets.length < 5) {
        const start = Math.max(0, revMatch.index - 50);
        const end = Math.min(cleanRawText.length, revMatch.index + revMatch[0].length + 60);
        // Correct reversed snippet so user can read it in normal direction
        let rawSnippet = cleanRawText.slice(start, end).replace(/\s+/g, ' ').trim();
        // Reverse back word chunks if they were stored visually backward
        let snippet = reverseString(rawSnippet);
        if (start > 0) snippet = '...' + snippet;
        if (end < cleanRawText.length) snippet = snippet + '...';
        snippets.push(snippet);
      }
      if (reversedRegex.lastIndex === revMatch.index) {
        reversedRegex.lastIndex++;
      }
    }
  }

  return { matchCount, snippets };
}
