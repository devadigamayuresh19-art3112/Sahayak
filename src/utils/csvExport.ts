import { InventoryTransaction, Product } from '../types';

/**
 * Escapes a cell value for standard RFC 4180 CSV compliance
 */
function escapeCSVValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Initiates a browser file download with UTF-8 BOM for Excel compatibility
 */
function triggerCSVDownload(content: string, filename: string): void {
  // \uFEFF is UTF-8 Byte Order Mark, crucial for Excel to recognize non-ASCII (Hindi/Marathi/Indian characters)
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports products catalog to CSV
 */
export function exportProductsToCSV(products: Product[], shopName = 'Shop'): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Sahayak_Inventory_${shopName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`;

  const headers = [
    'SKU',
    'Product Name',
    'Category',
    'Current Stock',
    'Minimum Buffer Stock',
    'Unit',
    'Cost Price (INR)',
    'Selling Price / MRP (INR)',
    'Total Stock Value (INR)',
    'Stock Status',
    'Last Updated',
  ];

  const rows = products.map((p) => {
    const isOutOfStock = p.quantity === 0;
    const isLowStock = !isOutOfStock && p.quantity <= p.minimum_stock;
    const status = isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock Warning' : 'In Stock';
    const totalVal = ((p.selling_price || 0) * p.quantity).toFixed(2);
    const updatedDate = new Date(p.updated_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return [
      escapeCSVValue(p.sku),
      escapeCSVValue(p.name),
      escapeCSVValue(p.category),
      p.quantity,
      p.minimum_stock,
      escapeCSVValue(p.unit),
      p.cost_price || 0,
      p.selling_price || 0,
      totalVal,
      escapeCSVValue(status),
      escapeCSVValue(updatedDate),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerCSVDownload(csvContent, filename);
  return filename;
}

/**
 * Exports inventory transactions ledger to CSV
 */
export function exportTransactionsToCSV(transactions: InventoryTransaction[], shopName = 'Shop'): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Sahayak_Transactions_${shopName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`;

  const headers = [
    'Transaction ID',
    'Date & Time',
    'Product Name',
    'Operation Type',
    'Quantity Changed',
    'Previous Stock',
    'New Stock Balance',
    'Source Channel',
    'Original Voice/Text Message',
  ];

  const rows = transactions.map((t) => {
    let operationLabel = 'Stock Adjustment';
    if (t.type === 'stock_in') operationLabel = 'Stock In (Received)';
    else if (t.type === 'stock_out') operationLabel = 'Stock Out (Sold)';
    else if (t.type === 'undo') operationLabel = 'Undo Reversal';

    const timestamp = new Date(t.created_at).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const qtySigned = t.type === 'stock_in' ? `+${t.quantity}` : t.type === 'stock_out' ? `-${t.quantity}` : t.quantity;

    return [
      escapeCSVValue(t.id),
      escapeCSVValue(timestamp),
      escapeCSVValue(t.product_name),
      escapeCSVValue(operationLabel),
      escapeCSVValue(qtySigned),
      t.previous_quantity,
      t.new_quantity,
      escapeCSVValue(t.source_type.toUpperCase()),
      escapeCSVValue(t.source_message),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerCSVDownload(csvContent, filename);
  return filename;
}
