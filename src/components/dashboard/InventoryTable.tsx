import React, { useState } from 'react';
import {
  AlertTriangle,
  Edit2,
  Minus,
  Plus,
  Search,
  Trash2,
  X,
  PackagePlus,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Product } from '../../types';

interface InventoryTableProps {
  products: Product[];
  onAddProduct: (prod: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onQuickAdjust: (id: string, delta: number) => void;
  prefillNewProduct?: { name: string; quantity: number } | null;
  onClearPrefill?: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onQuickAdjust,
  prefillNewProduct,
  onClearPrefill,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Packaged Food');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [minimumStock, setMinimumStock] = useState(5);
  const [unit, setUnit] = useState('packets');
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  // Open modal for prefilled new product if triggered by NLP
  React.useEffect(() => {
    if (prefillNewProduct) {
      setEditingProduct(null);
      setName(prefillNewProduct.name);
      setQuantity(prefillNewProduct.quantity || 10);
      setSku('SKU-' + Math.random().toString(36).substring(2, 7).toUpperCase());
      setIsModalOpen(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillNewProduct, onClearPrefill]);

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Packaged Food');
    setSku('SKU-' + Math.random().toString(36).substring(2, 7).toUpperCase());
    setQuantity(20);
    setMinimumStock(10);
    setUnit('packets');
    setCostPrice(20);
    setSellingPrice(25);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setSku(p.sku);
    setQuantity(p.quantity);
    setMinimumStock(p.minimum_stock);
    setUnit(p.unit);
    setCostPrice(p.cost_price || 0);
    setSellingPrice(p.selling_price || 0);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, {
        name,
        category,
        sku,
        quantity,
        minimum_stock: minimumStock,
        unit,
        cost_price: costPrice,
        selling_price: sellingPrice,
      });
    } else {
      onAddProduct({
        name,
        category,
        sku,
        quantity,
        minimum_stock: minimumStock,
        unit,
        cost_price: costPrice,
        selling_price: sellingPrice,
      });
    }

    setIsModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === 'OUT_OF_STOCK') matchesStatus = p.quantity === 0;
    else if (statusFilter === 'LOW_STOCK') matchesStatus = p.quantity > 0 && p.quantity <= p.minimum_stock;
    else if (statusFilter === 'IN_STOCK') matchesStatus = p.quantity > p.minimum_stock;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500/60">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product, category, or SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-700/60 text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-emerald-200 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#081a13] text-white">
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-emerald-200 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="ALL" className="bg-[#081a13] text-white">All Statuses</option>
            <option value="IN_STOCK" className="bg-[#081a13] text-white">In Stock</option>
            <option value="LOW_STOCK" className="bg-[#081a13] text-white">Low Stock Warning</option>
            <option value="OUT_OF_STOCK" className="bg-[#081a13] text-white">Out of Stock</option>
          </select>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#61b487] hover:bg-[#79ce9f] text-[#05110b] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table Surface */}
      <div className="rounded-3xl glass-panel border border-emerald-500/25 overflow-hidden shadow-2xl">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-emerald-300/70">
            <PackagePlus className="w-10 h-10 mx-auto mb-3 text-emerald-500/50" />
            <p className="text-sm font-semibold">No products found matching filters.</p>
            <p className="text-xs text-emerald-400/60 mt-1">Try resetting search or adding a new inventory item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081f15] border-b border-emerald-800/40 text-emerald-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 font-mono">SKU</th>
                  <th className="py-3.5 px-4 text-right">Current Stock</th>
                  <th className="py-3.5 px-4 text-right">Min Buffer</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.quantity === 0;
                  const isLowStock = !isOutOfStock && p.quantity <= p.minimum_stock;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-emerald-950/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-white">
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-[11px] text-emerald-500 font-mono">
                          MRP ₹{p.selling_price || '--'} · Cost ₹{p.cost_price || '--'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-emerald-200/80">{p.category}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-emerald-400/80">{p.sku}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sm text-white">
                        <span className={isLowStock || isOutOfStock ? 'text-amber-400' : 'text-emerald-300'}>
                          {p.quantity}
                        </span>{' '}
                        <span className="text-[11px] font-normal text-emerald-400/80">{p.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-emerald-400/70">
                        {p.minimum_stock} {p.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick decrement (-1) */}
                          <button
                            onClick={() => onQuickAdjust(p.id, -1)}
                            title="Quick Sell (-1)"
                            className="p-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-white hover:border-emerald-600 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          {/* Quick increment (+1) */}
                          <button
                            onClick={() => onQuickAdjust(p.id, 1)}
                            title="Quick Add (+1)"
                            className="p-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-white hover:border-emerald-600 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product"
                            className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/50 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            title="Delete Product"
                            className="p-1 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-emerald-500/40 shadow-2xl relative bg-[#081f15]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-emerald-400/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingProduct ? 'Edit Product Details' : 'Add New Inventory Product'}
            </h3>
            <p className="text-xs text-emerald-300/80 mb-5">
              Fill in the stock metadata. Sahayak will track this item in natural language messages.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maggi 2-Minute Noodles 70g"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-700/60 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Biscuits & Snacks">Biscuits &amp; Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Staples & Spices">Staples &amp; Spices</option>
                    <option value="Household & Cleaning">Household &amp; Cleaning</option>
                    <option value="Personal Care">Personal Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. MAG-70G"
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    Min Stock Buffer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={minimumStock}
                    onChange={(e) => setMinimumStock(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="packets">packets</option>
                    <option value="bottles">bottles</option>
                    <option value="boxes">boxes</option>
                    <option value="pouches">pouches</option>
                    <option value="kg">kg</option>
                    <option value="litres">litres</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    Selling Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-emerald-800 text-xs font-medium text-emerald-300 hover:bg-emerald-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#61b487] hover:bg-[#78cca0] text-[#05110b] font-bold text-xs shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
