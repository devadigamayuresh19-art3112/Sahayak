import { Alert, InventoryTransaction, MessageRecord, Product, ShopStats } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'sahayak_products',
  TRANSACTIONS: 'sahayak_transactions',
  ALERTS: 'sahayak_alerts',
  MESSAGES: 'sahayak_messages',
};

// Seed demo dataset for Indian Kirana Store
export const INITIAL_DEMO_PRODUCTS = (userId: string): Product[] => [
  {
    id: 'prod_maggi_01',
    user_id: userId,
    name: 'Maggi 2-Minute Noodles 70g',
    category: 'Packaged Food',
    sku: 'MAG-70G-01',
    quantity: 4, // Below minimum of 10
    minimum_stock: 10,
    unit: 'packets',
    cost_price: 11.5,
    selling_price: 14.0,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_parleg_02',
    user_id: userId,
    name: 'Parle-G Glucose Biscuits 250g',
    category: 'Biscuits & Snacks',
    sku: 'PARLE-250G-02',
    quantity: 45,
    minimum_stock: 15,
    unit: 'packets',
    cost_price: 18.0,
    selling_price: 20.0,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_pepsi_03',
    user_id: userId,
    name: 'Pepsi Cold Drink 500ml Bottle',
    category: 'Beverages',
    sku: 'PEP-500ML-03',
    quantity: 18,
    minimum_stock: 10,
    unit: 'bottles',
    cost_price: 32.0,
    selling_price: 40.0,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_coke_04',
    user_id: userId,
    name: 'Coca-Cola 500ml Bottle',
    category: 'Beverages',
    sku: 'COKE-500ML-04',
    quantity: 24,
    minimum_stock: 10,
    unit: 'bottles',
    cost_price: 32.0,
    selling_price: 40.0,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_amul_05',
    user_id: userId,
    name: 'Amul Taaza Toned Milk 500ml',
    category: 'Dairy',
    sku: 'AMUL-TZ-500-05',
    quantity: 8, // Below minimum 15
    minimum_stock: 15,
    unit: 'pouches',
    cost_price: 25.5,
    selling_price: 28.0,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_britannia_06',
    user_id: userId,
    name: 'Britannia Good Day Butter Biscuits',
    category: 'Biscuits & Snacks',
    sku: 'BRIT-GD-600-06',
    quantity: 32,
    minimum_stock: 12,
    unit: 'packets',
    cost_price: 25.0,
    selling_price: 30.0,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_tatasalt_07',
    user_id: userId,
    name: 'Tata Salt Vacuum Evaporated 1kg',
    category: 'Staples & Spices',
    sku: 'TATA-SALT-1KG-07',
    quantity: 3, // Below minimum 8
    minimum_stock: 8,
    unit: 'packets',
    cost_price: 22.0,
    selling_price: 26.0,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_surf_08',
    user_id: userId,
    name: 'Surf Excel Easy Wash Detergent 1kg',
    category: 'Household & Cleaning',
    sku: 'SURF-EW-1KG-08',
    quantity: 15,
    minimum_stock: 5,
    unit: 'packets',
    cost_price: 120.0,
    selling_price: 140.0,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_DEMO_TRANSACTIONS = (userId: string): InventoryTransaction[] => {
  const dayMs = 86400000;
  const now = Date.now();

  return [
    // 6 Days Ago (Day -6): ~18 units sold
    {
      id: 'tx_d6_01',
      user_id: userId,
      product_id: 'prod_maggi_01',
      product_name: 'Maggi 2-Minute Noodles 70g',
      type: 'stock_out',
      quantity: 10,
      previous_quantity: 40,
      new_quantity: 30,
      source_message: '10 Maggi sold to customer',
      source_type: 'text',
      created_at: new Date(now - dayMs * 6 + 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'tx_d6_02',
      user_id: userId,
      product_id: 'prod_pepsi_03',
      product_name: 'Pepsi Cold Drink 500ml Bottle',
      type: 'stock_out',
      quantity: 8,
      previous_quantity: 32,
      new_quantity: 24,
      source_message: '8 Pepsi bottles sold',
      source_type: 'voice',
      created_at: new Date(now - dayMs * 6 + 1000 * 60 * 60 * 8).toISOString(),
    },

    // 5 Days Ago (Day -5): ~21 units sold
    {
      id: 'tx_d5_01',
      user_id: userId,
      product_id: 'prod_parleg_02',
      product_name: 'Parle-G Glucose Biscuits 250g',
      type: 'stock_out',
      quantity: 12,
      previous_quantity: 50,
      new_quantity: 38,
      source_message: '12 Parle-G bik gaye',
      source_type: 'text',
      created_at: new Date(now - dayMs * 5 + 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'tx_d5_02',
      user_id: userId,
      product_id: 'prod_amul_05',
      product_name: 'Amul Taaza Toned Milk 500ml',
      type: 'stock_out',
      quantity: 9,
      previous_quantity: 25,
      new_quantity: 16,
      source_message: '9 Amul milk packet bika',
      source_type: 'voice',
      created_at: new Date(now - dayMs * 5 + 1000 * 60 * 60 * 7).toISOString(),
    },

    // 4 Days Ago (Day -4): ~25 units sold
    {
      id: 'tx_d4_01',
      user_id: userId,
      product_id: 'prod_maggi_01',
      product_name: 'Maggi 2-Minute Noodles 70g',
      type: 'stock_out',
      quantity: 15,
      previous_quantity: 35,
      new_quantity: 20,
      source_message: '15 Maggi packets sold',
      source_type: 'text',
      created_at: new Date(now - dayMs * 4 + 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'tx_d4_02',
      user_id: userId,
      product_id: 'prod_coke_04',
      product_name: 'Coca-Cola 500ml Bottle',
      type: 'stock_out',
      quantity: 10,
      previous_quantity: 34,
      new_quantity: 24,
      source_message: '10 Coke bottle biki',
      source_type: 'text',
      created_at: new Date(now - dayMs * 4 + 1000 * 60 * 60 * 9).toISOString(),
    },

    // 3 Days Ago (Day -3): ~26 units sold
    {
      id: 'tx_d3_01',
      user_id: userId,
      product_id: 'prod_parleg_02',
      product_name: 'Parle-G Glucose Biscuits 250g',
      type: 'stock_out',
      quantity: 14,
      previous_quantity: 48,
      new_quantity: 34,
      source_message: '14 Parle-G sold',
      source_type: 'text',
      created_at: new Date(now - dayMs * 3 + 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'tx_d3_02',
      user_id: userId,
      product_id: 'prod_britannia_06',
      product_name: 'Britannia Good Day Butter Biscuits',
      type: 'stock_out',
      quantity: 12,
      previous_quantity: 40,
      new_quantity: 28,
      source_message: '12 Good Day biscuits bik gaye',
      source_type: 'voice',
      created_at: new Date(now - dayMs * 3 + 1000 * 60 * 60 * 8).toISOString(),
    },

    // 2 Days Ago (Day -2): ~30 units sold
    {
      id: 'tx_d2_01',
      user_id: userId,
      product_id: 'prod_maggi_01',
      product_name: 'Maggi 2-Minute Noodles 70g',
      type: 'stock_out',
      quantity: 18,
      previous_quantity: 32,
      new_quantity: 14,
      source_message: '18 Maggi packet sold',
      source_type: 'text',
      created_at: new Date(now - dayMs * 2 + 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'tx_d2_02',
      user_id: userId,
      product_id: 'prod_pepsi_03',
      product_name: 'Pepsi Cold Drink 500ml Bottle',
      type: 'stock_out',
      quantity: 12,
      previous_quantity: 30,
      new_quantity: 18,
      source_message: '12 Pepsi sold',
      source_type: 'voice',
      created_at: new Date(now - dayMs * 2 + 1000 * 60 * 60 * 9).toISOString(),
    },

    // 1 Day Ago (Yesterday): ~32 units sold
    {
      id: 'tx_d1_01',
      user_id: userId,
      product_id: 'prod_parleg_02',
      product_name: 'Parle-G Glucose Biscuits 250g',
      type: 'stock_out',
      quantity: 18,
      previous_quantity: 52,
      new_quantity: 34,
      source_message: 'Kal 18 Parle-G biki',
      source_type: 'text',
      created_at: new Date(now - dayMs * 1 + 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'tx_d1_02',
      user_id: userId,
      product_id: 'prod_tatasalt_07',
      product_name: 'Tata Salt Vacuum Evaporated 1kg',
      type: 'stock_out',
      quantity: 14,
      previous_quantity: 20,
      new_quantity: 6,
      source_message: '14 Tata Salt bika',
      source_type: 'voice',
      created_at: new Date(now - dayMs * 1 + 1000 * 60 * 60 * 8).toISOString(),
    },

    // Today (Day 0): 31 units sold, 46 added
    {
      id: 'tx_01',
      user_id: userId,
      product_id: 'prod_maggi_01',
      product_name: 'Maggi 2-Minute Noodles 70g',
      type: 'stock_in',
      quantity: 20,
      previous_quantity: 4,
      new_quantity: 24,
      source_message: 'Aaj 20 Maggi aayi',
      source_type: 'text',
      created_at: new Date(now - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 'tx_02',
      user_id: userId,
      product_id: 'prod_pepsi_03',
      product_name: 'Pepsi Cold Drink 500ml Bottle',
      type: 'stock_out',
      quantity: 7,
      previous_quantity: 25,
      new_quantity: 18,
      source_message: '7 Pepsi bottles sold',
      source_type: 'text',
      created_at: new Date(now - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'tx_03',
      user_id: userId,
      product_id: 'prod_parleg_02',
      product_name: 'Parle-G Glucose Biscuits 250g',
      type: 'stock_in',
      quantity: 26,
      previous_quantity: 35,
      new_quantity: 61,
      source_message: '26 Parle-G add karo',
      source_type: 'text',
      created_at: new Date(now - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'tx_04',
      user_id: userId,
      product_id: 'prod_maggi_01',
      product_name: 'Maggi 2-Minute Noodles 70g',
      type: 'stock_out',
      quantity: 24,
      previous_quantity: 28,
      new_quantity: 4,
      source_message: 'Maggi ke 24 packets bik gaye',
      source_type: 'voice',
      created_at: new Date(now - 1000 * 60 * 20).toISOString(),
    },
  ];
};

export const INITIAL_DEMO_ALERTS = (userId: string): Alert[] => [
  {
    id: 'alert_01',
    user_id: userId,
    product_id: 'prod_maggi_01',
    product_name: 'Maggi 2-Minute Noodles 70g',
    type: 'low_stock',
    message: 'Current stock: 4 packets. Below minimum threshold of 10. High daily turnover.',
    current_stock: 4,
    minimum_stock: 10,
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'alert_02',
    user_id: userId,
    product_id: 'prod_tatasalt_07',
    product_name: 'Tata Salt Vacuum Evaporated 1kg',
    type: 'low_stock',
    message: 'Current stock: 3 packets. Minimum buffer is 8 packets. Restock recommended.',
    current_stock: 3,
    minimum_stock: 8,
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'alert_03',
    user_id: userId,
    product_id: 'prod_amul_05',
    product_name: 'Amul Taaza Toned Milk 500ml',
    type: 'low_stock',
    message: 'Current stock: 8 pouches. Minimum buffer is 15 pouches.',
    current_stock: 8,
    minimum_stock: 15,
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  }
];

class DatabaseService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  // Initial load check
  public initUserCatalog(userId: string): void {
    const products = this.getProducts(userId);
    if (products.length === 0) {
      this.loadDemoShop(userId);
    }
  }

  // Products
  public getProducts(userId: string): Product[] {
    const all = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    return all.filter(p => p.user_id === userId);
  }

  public addProduct(userId: string, productData: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Product {
    const all = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const newProd: Product = {
      ...productData,
      id: 'prod_' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.unshift(newProd);
    this.setStorage(STORAGE_KEYS.PRODUCTS, all);

    // Check if new product triggers low stock
    if (newProd.quantity <= newProd.minimum_stock) {
      this.generateAlert(userId, newProd);
    }

    return newProd;
  }

  public updateProduct(userId: string, productId: string, updates: Partial<Product>): Product | null {
    const all = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const idx = all.findIndex(p => p.id === productId && p.user_id === userId);
    if (idx === -1) return null;

    all[idx] = {
      ...all[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.setStorage(STORAGE_KEYS.PRODUCTS, all);

    // Check alert status
    if (all[idx].quantity <= all[idx].minimum_stock) {
      this.generateAlert(userId, all[idx]);
    }

    return all[idx];
  }

  public deleteProduct(userId: string, productId: string): boolean {
    const all = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const filtered = all.filter(p => !(p.id === productId && p.user_id === userId));
    this.setStorage(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  }

  // Transactions
  public getTransactions(userId: string, limit = 50): InventoryTransaction[] {
    const all = this.getStorage<InventoryTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    return all
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  public recordTransaction(
    userId: string,
    productId: string,
    type: 'stock_in' | 'stock_out' | 'adjustment' | 'undo',
    quantity: number,
    sourceMessage: string,
    sourceType: 'voice' | 'text' | 'manual' | 'undo' = 'text'
  ): { product: Product; transaction: InventoryTransaction } | null {
    const allProds = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const pIdx = allProds.findIndex(p => p.id === productId && p.user_id === userId);
    if (pIdx === -1) return null;

    const prod = allProds[pIdx];
    const prevQty = prod.quantity;
    let newQty = prevQty;

    if (type === 'stock_in') {
      newQty = prevQty + quantity;
    } else if (type === 'stock_out') {
      newQty = Math.max(0, prevQty - quantity);
    } else if (type === 'adjustment') {
      newQty = quantity;
    }

    prod.quantity = newQty;
    prod.updated_at = new Date().toISOString();
    allProds[pIdx] = prod;
    this.setStorage(STORAGE_KEYS.PRODUCTS, allProds);

    // Save transaction
    const tx: InventoryTransaction = {
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      product_id: productId,
      product_name: prod.name,
      type,
      quantity,
      previous_quantity: prevQty,
      new_quantity: newQty,
      source_message: sourceMessage,
      source_type: sourceType,
      created_at: new Date().toISOString(),
    };

    const allTx = this.getStorage<InventoryTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    allTx.unshift(tx);
    this.setStorage(STORAGE_KEYS.TRANSACTIONS, allTx);

    // Check alerts
    if (newQty <= prod.minimum_stock) {
      this.generateAlert(userId, prod);
    }

    return { product: prod, transaction: tx };
  }

  // Undo last transaction
  public undoLastTransaction(userId: string): { success: boolean; message: string } {
    const transactions = this.getTransactions(userId, 10);
    if (!transactions.length) {
      return { success: false, message: 'No transaction to undo.' };
    }

    // Find the latest non-undo transaction
    const target = transactions.find(t => t.type !== 'undo');
    if (!target) {
      return { success: false, message: 'No transaction available to reverse.' };
    }

    const allProds = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const pIdx = allProds.findIndex(p => p.id === target.product_id && p.user_id === userId);
    if (pIdx === -1) {
      return { success: false, message: 'Associated product no longer exists.' };
    }

    const prod = allProds[pIdx];
    const prevQty = prod.quantity;
    const restoredQty = target.previous_quantity;
    prod.quantity = restoredQty;
    prod.updated_at = new Date().toISOString();
    allProds[pIdx] = prod;
    this.setStorage(STORAGE_KEYS.PRODUCTS, allProds);

    // Record an undo transaction
    const undoTx: InventoryTransaction = {
      id: 'tx_undo_' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      product_id: target.product_id,
      product_name: target.product_name,
      type: 'undo',
      quantity: Math.abs(restoredQty - prevQty),
      previous_quantity: prevQty,
      new_quantity: restoredQty,
      source_message: `Reversed: "${target.source_message}"`,
      source_type: 'undo',
      created_at: new Date().toISOString(),
    };

    const allTx = this.getStorage<InventoryTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    allTx.unshift(undoTx);
    this.setStorage(STORAGE_KEYS.TRANSACTIONS, allTx);

    return {
      success: true,
      message: `Undid last update for ${target.product_name}. Stock restored to ${restoredQty} ${prod.unit}.`
    };
  }

  // Alerts
  public getAlerts(userId: string): Alert[] {
    const all = this.getStorage<Alert[]>(STORAGE_KEYS.ALERTS, []);
    return all.filter(a => a.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public markAlertAsRead(userId: string, alertId: string): void {
    const all = this.getStorage<Alert[]>(STORAGE_KEYS.ALERTS, []);
    const idx = all.findIndex(a => a.id === alertId && a.user_id === userId);
    if (idx !== -1) {
      all[idx].is_read = true;
      this.setStorage(STORAGE_KEYS.ALERTS, all);
    }
  }

  public markAllAlertsAsRead(userId: string): void {
    const all = this.getStorage<Alert[]>(STORAGE_KEYS.ALERTS, []);
    all.forEach(a => {
      if (a.user_id === userId) a.is_read = true;
    });
    this.setStorage(STORAGE_KEYS.ALERTS, all);
  }

  private generateAlert(userId: string, prod: Product): void {
    const allAlerts = this.getStorage<Alert[]>(STORAGE_KEYS.ALERTS, []);
    // Don't duplicate unread alert for the same product
    const existing = allAlerts.find(a => a.user_id === userId && a.product_id === prod.id && !a.is_read);
    if (existing) {
      existing.current_stock = prod.quantity;
      existing.minimum_stock = prod.minimum_stock;
      existing.message = `Current stock: ${prod.quantity} ${prod.unit}. Minimum buffer is ${prod.minimum_stock} ${prod.unit}.`;
      this.setStorage(STORAGE_KEYS.ALERTS, allAlerts);
      return;
    }

    const newAlert: Alert = {
      id: 'alert_' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      product_id: prod.id,
      product_name: prod.name,
      type: prod.quantity === 0 ? 'out_of_stock' : 'low_stock',
      message: prod.quantity === 0
        ? `Out of stock! ${prod.name} has 0 ${prod.unit}. Immediate restocking required.`
        : `Low Stock! ${prod.name} has ${prod.quantity} ${prod.unit} left (Minimum: ${prod.minimum_stock}).`,
      current_stock: prod.quantity,
      minimum_stock: prod.minimum_stock,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    allAlerts.unshift(newAlert);
    this.setStorage(STORAGE_KEYS.ALERTS, allAlerts);
  }

  // Messages log
  public getMessages(userId: string): MessageRecord[] {
    const all = this.getStorage<MessageRecord[]>(STORAGE_KEYS.MESSAGES, []);
    return all.filter(m => m.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public saveMessageRecord(userId: string, message: Omit<MessageRecord, 'id' | 'user_id' | 'created_at'>): MessageRecord {
    const all = this.getStorage<MessageRecord[]>(STORAGE_KEYS.MESSAGES, []);
    const newMsg: MessageRecord = {
      ...message,
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    all.unshift(newMsg);
    this.setStorage(STORAGE_KEYS.MESSAGES, all);
    return newMsg;
  }

  // Duplicate message check (within 60 seconds)
  public isDuplicateMessage(userId: string, rawText: string): boolean {
    const msgs = this.getMessages(userId);
    if (!msgs.length) return false;
    const now = Date.now();
    const cleanCurrent = rawText.trim().toLowerCase();

    return msgs.some(m => {
      const timeDiff = now - new Date(m.created_at).getTime();
      return timeDiff < 60000 && m.raw_text.trim().toLowerCase() === cleanCurrent;
    });
  }

  // Statistics calculation from real store records
  public getStats(userId: string): ShopStats {
    const products = this.getProducts(userId);
    const transactions = this.getTransactions(userId, 500);

    const today = new Date().toDateString();
    let stockAddedToday = 0;
    let stockSoldToday = 0;

    for (const tx of transactions) {
      const txDate = new Date(tx.created_at).toDateString();
      if (txDate === today) {
        if (tx.type === 'stock_in') {
          stockAddedToday += tx.quantity;
        } else if (tx.type === 'stock_out') {
          stockSoldToday += tx.quantity;
        }
      }
    }

    const lowStockCount = products.filter(p => p.quantity <= p.minimum_stock).length;
    const totalStockUnits = products.reduce((acc, p) => acc + p.quantity, 0);

    return {
      totalProducts: products.length,
      stockAddedToday,
      stockSoldToday,
      lowStockCount,
      totalStockUnits
    };
  }

  // AI Daily Smart Summary generated purely from real transactions
  public getDailySummary(userId: string): string {
    const transactions = this.getTransactions(userId, 200);
    const products = this.getProducts(userId);

    if (transactions.length === 0 && products.length === 0) {
      return "Once you start recording inventory, Sahayak will summarize your shop activity here.";
    }

    const today = new Date().toDateString();
    const todayTxs = transactions.filter(t => new Date(t.created_at).toDateString() === today);

    if (todayTxs.length === 0) {
      const lowStockCount = products.filter(p => p.quantity <= p.minimum_stock).length;
      return `No new stock movements recorded today so far. You have ${products.length} products in stock, with ${lowStockCount} item${lowStockCount === 1 ? '' : 's'} running low.`;
    }

    let added = 0;
    let sold = 0;
    const itemMovement: Record<string, number> = {};

    todayTxs.forEach(t => {
      if (t.type === 'stock_in') added += t.quantity;
      if (t.type === 'stock_out') sold += t.quantity;
      itemMovement[t.product_name] = (itemMovement[t.product_name] || 0) + t.quantity;
    });

    let topProduct = '';
    let topCount = 0;
    for (const [name, count] of Object.entries(itemMovement)) {
      if (count > topCount) {
        topCount = count;
        topProduct = name;
      }
    }

    const lowStock = products.filter(p => p.quantity <= p.minimum_stock).length;
    const uniqueProductsCount = new Set(todayTxs.map(t => t.product_id)).size;

    return `Today you added ${added} items and sold ${sold} items across ${uniqueProductsCount} product${uniqueProductsCount === 1 ? '' : 's'}.${topProduct ? ` ${topProduct.split(' ')[0]} had the highest movement.` : ''} ${lowStock > 0 ? `${lowStock} product${lowStock === 1 ? ' is' : 's are'} currently below minimum stock level.` : 'All items are currently well-stocked.'}`;
  }

  // Load realistic demo shop data
  public loadDemoShop(userId: string): void {
    const demoProds = INITIAL_DEMO_PRODUCTS(userId);
    const demoTxs = INITIAL_DEMO_TRANSACTIONS(userId);
    const demoAlerts = INITIAL_DEMO_ALERTS(userId);

    // Overwrite user's items with fresh demo setup
    const allProds = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []).filter(p => p.user_id !== userId);
    allProds.push(...demoProds);
    this.setStorage(STORAGE_KEYS.PRODUCTS, allProds);

    const allTxs = this.getStorage<InventoryTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []).filter(t => t.user_id !== userId);
    allTxs.push(...demoTxs);
    this.setStorage(STORAGE_KEYS.TRANSACTIONS, allTxs);

    const allAlerts = this.getStorage<Alert[]>(STORAGE_KEYS.ALERTS, []).filter(a => a.user_id !== userId);
    allAlerts.push(...demoAlerts);
    this.setStorage(STORAGE_KEYS.ALERTS, allAlerts);
  }
}

export const dbService = new DatabaseService();
