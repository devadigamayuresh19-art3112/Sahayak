export type NLPOperation = 'stock_in' | 'stock_out' | 'adjustment' | 'undo';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  shop_name: string;
  email: string;
  phone?: string;
  preferred_language: 'hi-IN' | 'mr-IN' | 'en-IN';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  minimum_stock: number;
  unit: string;
  cost_price: number;
  selling_price: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  type: NLPOperation;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  source_message: string;
  source_type: 'voice' | 'text' | 'manual' | 'undo';
  created_at: string;
}

export interface ParsedIntentItem {
  rawSegment: string;
  productName: string;
  matchedProductId?: string;
  matchedProductName?: string;
  isExistingProduct: boolean;
  quantity: number;
  operation: NLPOperation;
  unit: string;
  confidence: number;
}

export interface ParsedMessage {
  rawText: string;
  intents: ParsedIntentItem[];
  overallConfidence: number;
  isAmbiguous: boolean;
  suggestedClarification?: string;
  languageDetected: 'Hindi/Hinglish' | 'Marathi' | 'English';
}

export interface MessageRecord {
  id: string;
  user_id: string;
  raw_text: string;
  parsed_intent: ParsedIntentItem[];
  confidence: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'processed';
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  type: 'low_stock' | 'out_of_stock' | 'restock_suggestion';
  message: string;
  current_stock: number;
  minimum_stock: number;
  is_read: boolean;
  created_at: string;
}

export interface ShopStats {
  totalProducts: number;
  stockAddedToday: number;
  stockSoldToday: number;
  lowStockCount: number;
  totalStockUnits: number;
}
