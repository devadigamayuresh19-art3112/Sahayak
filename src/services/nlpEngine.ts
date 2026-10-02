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

  // Marathi phonetics
  'don': 2, 'paach': 5, 'saha': 6, 'daha': 10, 'vis': 20, 'vees': 20,
  'panchvis': 25, 'pannas': 50, 'shambhar': 100,

  // Devanagari numerals
  '०': 0, '१': 1, '२': 2, '३': 3, '४': 4,
  '५': 5, '६': 6, '७': 7, '८': 8, '९': 9,
  '१०': 10, '१५': 15, '२०': 20, '२५': 25, '३०': 30, '५०': 50,

  // Hindi Devanagari words
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5,
  'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'ग्यारह': 11,
  'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15, 'सोलह': 16,
  'सत्रह': 17, 'अठारह': 18, 'उन्नीस': 19, 'बीस': 20, 'पच्चीस': 25,
  'तीस': 30, 'चालीस': 40, 'पचास': 50, 'सौ': 100,

  // Marathi Devanagari words
  'दोन': 2, 'पाच': 5, 'सहा': 6, 'दहा': 10, 'अकरा': 11, 'बारा': 12,
  'तेरा': 13, 'चौदा': 14, 'पंधरा': 15, 'सोळा': 16, 'सतरा': 17, 'अठरा': 18,
  'एकोणीस': 19, 'वीस': 20, 'पंचवीस': 25, 'चाळीस': 40, 'पन्नास': 50, 'शंभर': 100
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
  'piece': 'units', 'pieces': 'units', 'pcs': 'units', 'unit': 'units', 'units': 'units',
  // Devanagari units
  'पैकेट': 'packets', 'पैकेट्स': 'packets', 'पाकिट': 'packets', 'पाकिटे': 'packets',
  'बॉटल': 'bottles', 'बोतल': 'bottles', 'बाटली': 'bottles', 'बाटल्या': 'bottles',
  'लीटर': 'litres', 'लिटर': 'litres', 'किलो': 'kg', 'डबा': 'boxes', 'डबे': 'boxes'
};

// Stock In trigger patterns (English, Hindi, Marathi)
const STOCK_IN_PATTERNS = [
  /\b(arrived|arrival|arriving|received|receive|got|bought|purchased|restocked|restock|inward|incoming|stock\s*in)\b/i,
  /\b(aayi|aaya|aaye|aagayi|aagaya|aa gaya|aa gayi|mangwaya|mangwayi|mili|mila|mile)\b/i,
  /\b(add karo|add kardo|add kar do|daal do|dal do|chadhado|chada do|store kiya)\b/i,
  /\b(maal aaya|stock aaya|delivery aayi|delivery aaya|receive hua)\b/i,
  // Hindi Devanagari
  /(आई|आया|आये|आए|आ गई|आ गया|जोड़ो|ऐड करो|मंगवाया|प्राप्त हुए|स्टॉक आया)/,
  // Marathi Devanagari
  /(आली|आला|आले|भरले|मिळाले|स्टॉक आला|ऍड करा|जमा झाले|आणले|पोहचले)/
];

// Stock Out trigger patterns (English, Hindi, Marathi)
const STOCK_OUT_PATTERNS = [
  /\b(sold|sell|sold out|sale|dispensed|dispatched|deduct|deducted|removed|out)\b/i,
  /\b(bik gaye|bik gaya|biki|bikli|bika|bik gya|becha|bech diya|bechi|beche)\b/i,
  /\b(sell hua|sale hua|nikal do|nikala|de diya|dia|khalaas|khatam|kam karo|minus)\b/i,
  // Hindi Devanagari
  /(बिकी|बिका|बिक गए|बिक गया|बेची|बेचा|बेच दिया|कम करो|निकाला)/,
  // Marathi Devanagari
  /(विकल्या|विकले|विकली|विकला|गेले|गेला|संपले|खपले|कमी करा|विक्री झाली|दिले)/
];

// Multilingual product alias mappings for common Indian retail products
const PRODUCT_ALIASES: Record<string, string[]> = {
  'maggi': ['मैगी', 'मॅगी', 'maggie', 'magi', 'nodles', 'noodles', 'मॅगी 2', 'मॅगी नूडल्स', 'maggi noodles'],
  'pepsi': ['पेप्सी', 'पेप्सि', 'cold drink', 'pepsi bottle', 'पेप्सी बॉटल'],
  'parle-g': ['parle g', 'parleg', 'पारले', 'पार्ले', 'पारले जी', 'पार्ले-जी', 'glucose', 'parle-g glucose', 'parle'],
  'coca-cola': ['coke', 'कोक', 'कोका कोला', 'coca cola', 'cocacola'],
  'amul': ['amul milk', 'amul taaza', 'दूध', 'दोध', 'अमुल', 'अमूल'],
  'britannia': ['good day', 'गुड डे', 'ब्रिटानिया', 'goodday', 'butter biscuit', 'गुड-डे'],
  'tata salt': ['tata namak', 'टाटा नमक', 'टाटा मीठ', 'मीठ', 'नमक', 'salt'],
  'surf excel': ['surf', 'सर्फ', 'सर्फ एक्सेल', 'detergent', 'पावडर', 'surf wash']
};

// Clean stopwords for candidate product extraction
const STOP_WORDS = new Set([
  'aaj', 'today', 'kal', 'abhi', 'please', 'bhai', 'bhaiya', 'sahayak',
  'ke', 'ki', 'ka', 'ko', 'se', 'me', 'mai', 'mein', 'par',
  'hai', 'tha', 'thi', 'the', 'karo', 'kar', 'do', 'huye', 'hua',
  'bottle', 'bottles', 'packet', 'packets', 'boxes', 'box', 'piece', 'pieces', 'units', 'unit',
  'aayi', 'aaya', 'aaye', 'bikli', 'bik', 'biki', 'bika', 'gaye', 'gaya', 'sold', 'add',
  'arrived', 'received',
  // Devanagari units and stopwords
  'पैकेट', 'पैकेट्स', 'पाकिट', 'पाकिटे', 'बोतल', 'बॉटल', 'बाटली', 'बाटल्या', 'लीटर', 'लिटर', 'किलो', 'डबा', 'डबे',
  'आणि', 'व', 'आहे', 'झाले', 'और', 'का', 'की', 'के', 'में', 'पर', 'को', 'च्या', 'ची', 'चे', 'ने', 'ला', 'तुन'
]);

/**
 * Normalizes text and extracts number from a token or regex match
 */
function extractQuantityAndUnit(text: string): { quantity: number; unit: string; matchedText?: string } {
  // Try explicit digit followed optionally by unit
  const digitRegex = /(\d+|[०-९]+)\s*(packets?|bottles?|boxes?|kg|litres?|ltr|units?|pouches?|dabba|पैकेट|बोतल|बॉटल|लीटर|किलो)?/i;
  const digitMatch = text.match(digitRegex);
  if (digitMatch && digitMatch[1]) {
    let digitStr = digitMatch[1];
    // Map devanagari digits if any
    const devanagariMap: Record<string, string> = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
    digitStr = digitStr.replace(/[०-९]/g, (ch) => devanagariMap[ch] || ch);

    const qty = parseInt(digitStr, 10);
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
  if (s1.includes(s2) || s2.includes(s1)) return 0.88;

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
 * using direct names, token bigrams, and Indian language aliases.
 */
export function matchProductWithCatalog(
  rawName: string,
  catalog: Product[]
): { matchedProduct?: Product; confidence: number; isExisting: boolean } {
  if (!rawName || !catalog.length) {
    return { confidence: 0.5, isExisting: false };
  }

  const cleanInput = rawName.toLowerCase().trim();
  const normalizedInput = cleanInput.replace(/[-_]/g, ' ').replace(/\s+/g, ' ');

  // 1. Direct alias dictionary lookup (handles Marathi/Hindi e.g. "मॅगी" -> Maggi, "पेप्सी" -> Pepsi, "पारले जी" -> Parle-G)
  for (const [key, aliases] of Object.entries(PRODUCT_ALIASES)) {
    const normKey = key.replace(/[-_]/g, ' ');
    const isAliasMatch = aliases.some(alias => {
      const normAlias = alias.toLowerCase().replace(/[-_]/g, ' ');
      return normalizedInput.includes(normAlias) || normAlias.includes(normalizedInput);
    });

    if (isAliasMatch || normalizedInput.includes(normKey) || normKey.includes(normalizedInput)) {
      const matched = catalog.find(p => {
        const normP = p.name.toLowerCase().replace(/[-_]/g, ' ');
        return normP.includes(normKey) || normP.includes(normalizedInput) || calculateSimilarity(normP, normKey) > 0.45;
      });
      if (matched) {
        return {
          matchedProduct: matched,
          confidence: 0.98,
          isExisting: true
        };
      }
    }
  }

  // 2. Similarity match against catalog product names
  let bestMatch: Product | undefined;
  let highestScore = 0;

  for (const prod of catalog) {
    const normProd = prod.name.toLowerCase().replace(/[-_]/g, ' ');
    if (normProd.includes(normalizedInput) || normalizedInput.includes(normProd)) {
      return {
        matchedProduct: prod,
        confidence: 0.96,
        isExisting: true
      };
    }

    const score = calculateSimilarity(normalizedInput, normProd);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = prod;
    }
  }

  if (highestScore >= 0.50 && bestMatch) {
    return {
      matchedProduct: bestMatch,
      confidence: Math.min(0.98, Math.max(0.85, highestScore)),
      isExisting: true
    };
  }

  return {
    confidence: 0.85,
    isExisting: false
  };
}

/**
 * Extracts product candidate name by stripping stopwords, numbers, and trigger phrases
 */
function extractProductName(segment: string): string {
  let cleaned = segment
    // Remove digits
    .replace(/\d+/g, '')
    // Remove Devanagari digits
    .replace(/[०-९]+/g, '')
    .trim();

  // Strip known stock in/out phrases globally
  for (const pat of STOCK_IN_PATTERNS) {
    cleaned = cleaned.replace(new RegExp(pat.source, pat.flags.includes('g') ? pat.flags : pat.flags + 'g'), ' ');
  }
  for (const pat of STOCK_OUT_PATTERNS) {
    cleaned = cleaned.replace(new RegExp(pat.source, pat.flags.includes('g') ? pat.flags : pat.flags + 'g'), ' ');
  }

  // Tokenize and filter stop words
  const tokens = cleaned
    .replace(/[^\w\s\u0900-\u097F-]/gi, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0 && !STOP_WORDS.has(t.toLowerCase()) && NUMBER_WORD_MAP[t.toLowerCase()] === undefined);

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
    if (/(आली|गेले|विकल्या|विकले|आहे|आणि|संपले|खपले|विकली)/.test(text)) {
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
      suggestedClarification: 'Please speak or type a message, e.g. "20 Maggi arrived"',
      languageDetected: 'English'
    };
  }

  const languageDetected = detectLanguage(trimmed);

  // Split on multi-sentence or compound conjunctions: "aur", "and", "ani", "आणि", "और", "व", "+", ",", ";"
  const segmentSeparators = /\b(?:aur|and|ani|तसेच|प्लस|\+)\b|[;,]|\n|(?:आणि|और)/i;
  const rawSegments = trimmed.split(segmentSeparators).map(s => s.trim()).filter(Boolean);

  const intents: ParsedIntentItem[] = [];

  for (const segment of rawSegments) {
    // Determine operation
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

    let operation: NLPOperation = 'adjustment';
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

    // Catalog matching with alias support
    const match = matchProductWithCatalog(candidateName, existingCatalog);

    // Calculate confidence
    let confidence = 0.96;
    if (!isExplicitStockIn && !isExplicitStockOut) {
      confidence = 0.65;
    }
    if (!match.isExisting) {
      confidence = Math.min(confidence, 0.88);
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

  const isAmbiguous = overallConfidence < 0.75 || intents.some(i => i.confidence < 0.7);

  let suggestedClarification: string | undefined;
  if (isAmbiguous) {
    suggestedClarification = "I detected the product and quantity. Please confirm whether this is Stock In (received) or Stock Out (sold).";
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
