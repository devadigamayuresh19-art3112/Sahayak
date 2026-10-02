import { NLPOperation, ParsedIntentItem, ParsedMessage, Product } from '../types';

// Map of word representations of numbers in English, Hindi/Hinglish, and Marathi
const NUMBER_WORD_MAP: Record<string, number> = {
  // English
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
  'twenty-five': 25, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60,
  'seventy': 70, 'eighty': 80, 'ninety': 90, 'hundred': 100,

  // Hindi / Hinglish phonetics
  'ek': 1, 'do': 2, 'teen': 3, 'tin': 3, 'char': 4, 'chaar': 4,
  'paanch': 5, 'panch': 5, 'chhe': 6, 'che': 6, 'saat': 7, 'sat': 7,
  'aath': 8, 'ath': 8, 'nau': 9, 'das': 10, 'gyarah': 11, 'barah': 12,
  'terah': 13, 'chaudah': 14, 'pandrah': 15, 'pandrahh': 15, 'solah': 16,
  'satrah': 17, 'atharah': 18, 'unnis': 19, 'bees': 20, 'bis': 20,
  'pachees': 25, 'pachis': 25, 'tees': 30, 'tis': 30, 'chalis': 40,
  'pachaas': 50, 'pachas': 50, 'sau': 100,

  // Devanagari numerals
  '०': 0, '१': 1, '२': 2, '३': 3, '४': 4,
  '५': 5, '६': 6, '७': 7, '८': 8, '९': 9,
  '१०': 10, '१५': 15, '२०': 20, '२५': 25, '३०': 30, '५०': 50
};

// Known common units in Indian grocery stores
const UNIT_MAP: Record<string, string> = {
  'packet': 'packets', 'packets': 'packets', 'pkt': 'packets', 'pkts': 'packets',
  'bottle': 'bottles', 'bottles': 'bottles', 'btl': 'bottles',
  'box': 'boxes', 'boxes': 'boxes', 'carton': 'boxes', 'cartons': 'boxes',
  'kg': 'kg', 'kilo': 'kg', 'kilogram': 'kg',
  'gm': 'g', 'gram': 'g', 'grams': 'g',
  'litre': 'litres', 'litres': 'litres', 'ltr': 'litres', 'l': 'litres',
  'pouch': 'pouches', 'pouches': 'pouches',
  'dabba': 'boxes', 'dappe': 'boxes', 'bora': 'sacks', 'bori': 'sacks',
  'piece': 'units', 'pieces': 'units', 'pcs': 'units', 'unit': 'units', 'units': 'units'
};

// Stock In trigger patterns
const STOCK_IN_PATTERNS = [
  /\b(aayi|aaya|aaye|aagayi|aagaya|aa gaya|aa gayi|mangwaya|mangwayi|mili|mila|mile)\b/i,
  /\b(add karo|add kardo|add kar do|daal do|dal do|chadhado|chada do|store kiya)\b/i,
  /\b(maal aaya|stock aaya|delivery aayi|delivery aaya|receive hua|received)\b/i,
  /\b(inward|incoming|restock|restocked|bought|purchased|stock in)\b/i,
  // Marathi
  /(आली|आला|आले|भरले|मिळाले|स्टॉक आला|ऍड करा|जमा झाले|आणले)/i
];

// Stock Out trigger patterns
const STOCK_OUT_PATTERNS = [
  /\b(bik gaye|bik gaya|biki|bikli|bika|bik gya|becha|bech diya|bechi|beche)\b/i,
  /\b(sold|sell hua|sale hua|sold out|nikal do|nikala|de diya|dia)\b/i,
  /\b(khalaas|khatam|kam karo|deduct|minus karo|minus)\b/i,
  // Marathi
  /(विकल्या|विकले|विकला|गेले|गेला|संपले|खपले|कमी करा|विक्री झाली|दिले)/i
];

// Clean stopwords for product extraction
const STOP_WORDS = new Set([
  'aaj', 'today', 'kal', 'abhi', 'please', 'bhai', 'bhaiya', 'sahayak',
  'ke', 'ki', 'ka', 'ko', 'se', 'me', 'mai', 'mein', 'par',
  'hai', 'tha', 'thi', 'the', 'karo', 'kar', 'do', 'huye', 'hua',
  'bottle', 'bottles', 'packet', 'packets', 'boxes', 'box', 'piece', 'pieces', 'units', 'unit',
  'aayi', 'aaya', 'aaye', 'bikli', 'bik', 'biki', 'bika', 'gaye', 'gaya', 'sold', 'add',
  'आणि', 'व', 'आहे', 'झाले'
]);

/**
 * Normalizes text and extracts number from a token or regex match
 */
function extractQuantityAndUnit(text: string): { quantity: number; unit: string; matchedText?: string } {
  // Try finding explicit digit followed optionally by unit
  // e.g. "20 Maggi", "20 packets", "5 bottles"
  const digitRegex = /(\d+)\s*(packets?|bottles?|boxes?|kg|litres?|ltr|units?|pouches?|dabba)?/i;
  const digitMatch = text.match(digitRegex);
  if (digitMatch && digitMatch[1]) {
    const qty = parseInt(digitMatch[1], 10);
    const unitRaw = digitMatch[2]?.toLowerCase();
    const unit = unitRaw && UNIT_MAP[unitRaw] ? UNIT_MAP[unitRaw] : 'units';
    return { quantity: qty, unit, matchedText: digitMatch[0] };
  }

  // Look for spelled-out numbers
  const tokens = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i].trim();
    if (NUMBER_WORD_MAP[word] !== undefined) {
      const nextWord = tokens[i + 1] ? tokens[i + 1].toLowerCase() : '';
      const unit = UNIT_MAP[nextWord] || 'units';
      return { quantity: NUMBER_WORD_MAP[word], unit, matchedText: word };
    }
  }

  return { quantity: 1, unit: 'units' };
}

/**
 * Calculates string similarity (Dice coefficient) between two terms
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.slice(i, i + 2));
    }
    return bigrams;
  };

  const bg1 = getBigrams(s1);
  const bg2 = getBigrams(s2);
  let intersection = 0;
  for (const bg of bg1) {
    if (bg2.has(bg)) intersection++;
  }

  return (2.0 * intersection) / (bg1.size + bg2.size || 1);
}

/**
 * Matches an extracted product name against store's existing product inventory
 */
export function matchProductWithCatalog(
  rawName: string,
  catalog: Product[]
): { matchedProduct?: Product; confidence: number; isExisting: boolean } {
  if (!rawName || !catalog.length) {
    return { confidence: 0.5, isExisting: false };
  }

  let bestMatch: Product | undefined;
  let highestScore = 0;

  for (const prod of catalog) {
    const score = calculateSimilarity(rawName, prod.name);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = prod;
    }
  }

  if (highestScore >= 0.65 && bestMatch) {
    return {
      matchedProduct: bestMatch,
      confidence: Math.min(0.98, highestScore),
      isExisting: true
    };
  }

  return {
    confidence: 0.88,
    isExisting: false
  };
}

/**
 * Extracts product candidate name by stripping stopwords, numbers, and trigger phrases
 */
function extractProductName(segment: string): string {
  let cleaned = segment
    // Remove digits
    .replace(/\b\d+\b/g, '')
    // Remove Devanagari digits
    .replace(/[०-९]+/g, '')
    .trim();

  // Strip known stock in/out phrases
  for (const pat of STOCK_IN_PATTERNS) {
    cleaned = cleaned.replace(pat, '');
  }
  for (const pat of STOCK_OUT_PATTERNS) {
    cleaned = cleaned.replace(pat, '');
  }

  // Tokenize and filter stop words
  const tokens = cleaned
    .replace(/[^\w\s\u0900-\u097F-]/gi, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !STOP_WORDS.has(t.toLowerCase()) && NUMBER_WORD_MAP[t.toLowerCase()] === undefined);

  if (tokens.length === 0) {
    return 'Item';
  }

  // Capitalize nicely
  return tokens
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Detects whether message contains Hindi, Marathi, or English markers
 */
function detectLanguage(text: string): 'Hindi/Hinglish' | 'Marathi' | 'English' {
  if (/[\u0900-\u097F]/.test(text)) {
    if (/(आली|गेले|विकल्या|विकले|आहे|आणि|संपले|खपले)/.test(text)) {
      return 'Marathi';
    }
    return 'Hindi/Hinglish';
  }
  if (/\b(aayi|aaya|bikli|bik|bika|aaye|karo|bhai|gaya|gaye)\b/i.test(text)) {
    return 'Hindi/Hinglish';
  }
  return 'English';
}

/**
 * Main NLP Parsing Function
 * Processes input message into structured inventory operations
 */
export function parseInventoryMessage(
  rawText: string,
  existingCatalog: Product[] = []
): ParsedMessage {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return {
      rawText,
      intents: [],
      overallConfidence: 0,
      isAmbiguous: true,
      suggestedClarification: 'Please speak or type a message, e.g. "Aaj 20 Maggi aayi"',
      languageDetected: 'English'
    };
  }

  const languageDetected = detectLanguage(trimmed);

  // Split on multi-sentence or compound conjunctions: "aur", "and", "ani", "व", "+", ",", ";"
  const segmentSeparators = /\b(?:aur|and|ani|तसेच|प्लस|\+)\b|[;,]|\n/i;
  const rawSegments = trimmed.split(segmentSeparators).map(s => s.trim()).filter(Boolean);

  const intents: ParsedIntentItem[] = [];

  for (const segment of rawSegments) {
    // Determine operation
    let operation: NLPOperation = 'adjustment';
    let isExplicitStockIn = false;
    let isExplicitStockOut = false;

    for (const pat of STOCK_IN_PATTERNS) {
      if (pat.test(segment)) {
        isExplicitStockIn = true;
        break;
      }
    }

    for (const pat of STOCK_OUT_PATTERNS) {
      if (pat.test(segment)) {
        isExplicitStockOut = true;
        break;
      }
    }

    if (isExplicitStockIn && !isExplicitStockOut) {
      operation = 'stock_in';
    } else if (isExplicitStockOut && !isExplicitStockIn) {
      operation = 'stock_out';
    } else {
      // Ambiguous: default to stock_in with lowered confidence
      operation = 'stock_in';
    }

    const { quantity, unit } = extractQuantityAndUnit(segment);
    const candidateName = extractProductName(segment);

    // Catalog matching
    const match = matchProductWithCatalog(candidateName, existingCatalog);

    // Calculate confidence
    let confidence = 0.94;
    let ambiguous = false;

    if (!isExplicitStockIn && !isExplicitStockOut) {
      // e.g. "20 Pepsi" without verbs
      confidence = 0.65;
      ambiguous = true;
    }

    if (!match.isExisting) {
      confidence = Math.min(confidence, 0.85);
    }

    intents.push({
      rawSegment: segment,
      productName: match.isExisting && match.matchedProduct ? match.matchedProduct.name : candidateName,
      matchedProductId: match.matchedProduct?.id,
      matchedProductName: match.matchedProduct?.name,
      isExistingProduct: match.isExisting,
      quantity,
      operation,
      unit: match.matchedProduct?.unit || unit,
      confidence: parseFloat(confidence.toFixed(2))
    });
  }

  const overallConfidence = intents.length > 0
    ? parseFloat((intents.reduce((acc, i) => acc + i.confidence, 0) / intents.length).toFixed(2))
    : 0;

  const isAmbiguous = overallConfidence < 0.8 || intents.some(i => i.confidence < 0.7);

  let suggestedClarification: string | undefined;
  if (isAmbiguous) {
    suggestedClarification = "I detected the product and quantity, but could you confirm if this is Stock In (received) or Stock Out (sold)?";
  }

  return {
    rawText: trimmed,
    intents,
    overallConfidence,
    isAmbiguous,
    suggestedClarification,
    languageDetected
  };
}
