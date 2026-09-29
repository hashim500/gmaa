/**
 * Tafqeet Utility for Arabic financial and general number-to-words conversion.
 */

export interface CurrencyConfig {
  name: { one: string; two: string; plur: string; acc: string };
  adj?: { one: string; two: string; plur: string; acc: string };
  sub: { one: string; two: string; plur: string; acc: string; gender: 'm' | 'f' };
}

const ONES_M = [
  '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
  'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
  'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'
];

const ONES_F = [
  '', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثماني', 'تسع',
  'عشر', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة',
  'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'
];

const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];

const HUNDREDS = [
  '', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'
];

const SCALES = [
  { one: 'ألف', two: 'ألفان', plur: 'آلاف', acc: 'ألفًا' },
  { one: 'مليون', two: 'مليونان', plur: 'ملايين', acc: 'مليونًا' },
  { one: 'مليار', two: 'ملياران', plur: 'مليارات', acc: 'مليارًا' },
  { one: 'تريليون', two: 'تريليونان', plur: 'تريليونات', acc: 'تريليونًا' }
];

export const CURRENCIES: Record<string, CurrencyConfig> = {
  SAR: {
    name: { one: 'ريال', two: 'ريالان', plur: 'ريالات', acc: 'ريالًا' },
    adj: { one: 'سعودي', two: 'سعوديان', plur: 'سعودية', acc: 'سعوديًا' },
    sub: { one: 'هللة', two: 'هللتان', plur: 'هللات', acc: 'هللة', gender: 'f' }
  },
  AED: {
    name: { one: 'درهم', two: 'درهمان', plur: 'دراهم', acc: 'درهمًا' },
    adj: { one: 'إماراتي', two: 'إماراتيان', plur: 'إماراتية', acc: 'إماراتيًا' },
    sub: { one: 'فلس', two: 'فلسان', plur: 'فلوس', acc: 'فلسًا', gender: 'm' }
  },
  EGP: {
    name: { one: 'جنيه', two: 'جنيهان', plur: 'جنيهات', acc: 'جنيهًا' },
    adj: { one: 'مصري', two: 'مصريان', plur: 'مصرية', acc: 'مصريًا' },
    sub: { one: 'قرش', two: 'قرشان', plur: 'قروش', acc: 'قرشًا', gender: 'm' }
  },
  KWD: {
    name: { one: 'دينار', two: 'ديناران', plur: 'دنانير', acc: 'دينارًا' },
    adj: { one: 'كويتي', two: 'كويتيان', plur: 'كويتية', acc: 'كويتيًا' },
    sub: { one: 'فلس', two: 'فلسان', plur: 'فلوس', acc: 'فلسًا', gender: 'm' }
  },
  BHD: {
    name: { one: 'دينار', two: 'ديناران', plur: 'دنانير', acc: 'دينارًا' },
    adj: { one: 'بحريني', two: 'بحرينيان', plur: 'بحرينية', acc: 'بحرينيًا' },
    sub: { one: 'فلس', two: 'فلسان', plur: 'فلوس', acc: 'فلسًا', gender: 'm' }
  },
  OMR: {
    name: { one: 'ريال', two: 'ريالان', plur: 'ريالات', acc: 'ريالًا' },
    adj: { one: 'عماني', two: 'عمانيان', plur: 'عمانية', acc: 'عمانيًا' },
    sub: { one: 'بيسة', two: 'بيستان', plur: 'بيسات', acc: 'بيسة', gender: 'f' }
  },
  QAR: {
    name: { one: 'ريال', two: 'ريالان', plur: 'ريالات', acc: 'ريالًا' },
    adj: { one: 'قطري', two: 'قطريان', plur: 'قطرية', acc: 'قطريًا' },
    sub: { one: 'درهم', two: 'درهمان', plur: 'دراهم', acc: 'درهمًا', gender: 'm' }
  },
  USD: {
    name: { one: 'دولار', two: 'دولاران', plur: 'دولارات', acc: 'دولارًا' },
    adj: { one: 'أمريكي', two: 'أمريكيان', plur: 'أمريكية', acc: 'أمريكيًا' },
    sub: { one: 'سنت', two: 'سنتان', plur: 'سنتات', acc: 'سنتًا', gender: 'm' }
  },
  EUR: {
    name: { one: 'يورو', two: 'يورو', plur: 'يورو', acc: 'يورو' },
    adj: { one: 'أوروبي', two: 'أوروبيان', plur: 'أوروبية', acc: 'أوروبيًا' },
    sub: { one: 'سنت', two: 'سنتان', plur: 'سنتات', acc: 'سنتًا', gender: 'm' }
  }
};

function below100(r: number, g: 'm' | 'f'): string {
  const o = g === 'f' ? ONES_F : ONES_M;
  if (r < 20) return o[r];
  const t = Math.floor(r / 10);
  const u = r % 10;
  return u ? o[u] + ' و' + TENS[t] : TENS[t];
}

function below1000(n: number, g: 'm' | 'f'): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const p: string[] = [];
  if (h) p.push(HUNDREDS[h]);
  if (r) p.push(below100(r, g));
  return p.join(' و');
}

function formKey(rem: number): 'plur' | 'acc' | 'one' {
  return rem >= 3 && rem <= 10 ? 'plur' : rem >= 11 && rem <= 99 ? 'acc' : 'one';
}

function intWords(n: number, g: 'm' | 'f'): string {
  if (n === 0) return 'صفر';
  const groups: number[] = [];
  let x = n;
  while (x > 0) {
    groups.push(x % 1000);
    x = Math.floor(x / 1000);
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const k = groups[i];
    if (!k) continue;
    if (i === 0) {
      parts.push(below1000(k, g));
      continue;
    }
    const s = SCALES[i - 1];
    if (k === 1) parts.push(s.one);
    else if (k === 2) parts.push(s.two);
    else parts.push((k === 200 ? 'مئتا' : below1000(k, 'm')) + ' ' + s[formKey(k % 100)]);
  }
  return parts.join(' و');
}

function counted(
  n: number,
  g: 'm' | 'f',
  nouns: { one: string; two: string; plur: string; acc: string },
  adj?: { one: string; two: string; plur: string; acc: string }
): string {
  if (n === 1) return nouns.one + (adj ? ' ' + adj.one : '') + ' ' + (g === 'f' ? 'واحدة' : 'واحد');
  if (n === 2) return nouns.two + (adj ? ' ' + adj.two : '');
  const k = formKey(n % 100);
  return intWords(n, g) + ' ' + nouns[k] + (adj ? ' ' + adj[k] : '');
}

export function parseAmount(str: string | number): { int: number; frac: number } | null {
  const s = String(str)
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[,،\s]/g, '')
    .replace('٫', '.');
  if (!/^\d+(\.\d{1,3})?$/.test(s)) return null;
  const [i, f = ''] = s.split('.');
  if (i.length > 15) return null;
  return {
    int: parseInt(i, 10),
    frac: parseInt((f + '00').slice(0, 2), 10)
  };
}

export function tafqeet(
  amount: string | number,
  currencyCode?: string,
  frame: boolean = true
): string | null {
  const a = parseAmount(amount);
  if (!a) return null;

  let text = '';
  if (!currencyCode || !CURRENCIES[currencyCode]) {
    text = intWords(a.int, 'm') + (a.frac ? ' فاصلة ' + intWords(a.frac, 'm') + ' من مئة' : '');
  } else {
    const c = CURRENCIES[currencyCode];
    const parts: string[] = [];
    if (a.int > 0 || a.frac === 0) {
      parts.push(
        a.int === 0 ? 'صفر ' + c.name.one + (c.adj ? ' ' + c.adj.one : '') : counted(a.int, 'm', c.name, c.adj)
      );
    }
    if (a.frac > 0) {
      parts.push(counted(a.frac, c.sub.gender, c.sub, undefined));
    }
    text = parts.join(' و');
  }

  return frame ? `فقط ${text} لا غير` : text;
}
