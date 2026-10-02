import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle,
  Edit2,
  Minus,
  Plus,
  Search,
  Trash2,
  X,
  PackagePlus,
  FileSpreadsheet,
  Package,
  Layers,
  IndianRupee,
  LayoutGrid,
  List
} from 'lucide-react';
import { Product } from '../../types';
import { exportProductsToCSV } from '../../utils/csvExport';

interface InventoryTableProps {
  products: Product[];
  shopName?: string;
  onAddProduct: (prod: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onQuickAdjust: (id: string, delta: number) => void;
  prefillNewProduct?: { name: string; quantity: number } | null;
  onClearPrefill?: () => void;
  onExportSuccess?: (filename: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  shopName = 'Sharma Kirana',
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onQuickAdjust,
  prefillNewProduct,
  onClearPrefill,
  onExportSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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
  useEffect(() => {
    if (prefillNewProduct) {
      setEditingProduct(null);
      setName(prefillNewProduct.name);
      setQuantity(prefillNewProduct.quantity || 10);
      setSku('SKU-' + Math.random().toString(36).substring(2, 7).toUpperCase());
      setIsModalOpen(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillNewProduct, onClearPrefill]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  // Inventory KPI Metrics
  const summaryMetrics = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalValue = products.reduce((acc, p) => acc + (p.selling_price || 0) * p.quantity, 0);
    const lowStockItems = products.filter(p => p.quantity <= p.minimum_stock);

    return {
      totalUnits,
      totalValue,
      lowStockCount: lowStockItems.length,
      itemCount: products.length,
    };
  }, [products]);

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
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
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
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Handle CSV Download
  const handleDownloadCSV = () => {
    const filename = exportProductsToCSV(filteredProducts, shopName);
    if (onExportSuccess) {
      onExportSuccess(filename);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick KPI Summary Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Products */}
        <div className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Total SKUs</span>
            <Package className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#173127] font-mono">
            {summaryMetrics.itemCount}
          </div>
          <span className="text-[11px] text-[#89988F] font-mono">Active catalog lines</span>
        </div>

        {/* Total Units */}
        <div className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Total Units</span>
            <Layers className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#173127] font-mono">
            {summaryMetrics.totalUnits}
          </div>
          <span className="text-[11px] text-[#89988F] font-mono">Physical inventory</span>
        </div>

        {/* Total Value */}
        <div className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Stock Retail Value</span>
            <IndianRupee className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#18583d] font-mono">
            ₹{summaryMetrics.totalValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#89988F] font-mono">Estimated shop value</span>
        </div>

        {/* Low Stock Alert Counter */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          className={`rounded-2xl bg-white p-4 border transition-all cursor-pointer flex flex-col justify-between shadow-sm ${statusFilter === 'LOW_STOCK' ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/40' : 'border-[#DCE8E0] hover:border-amber-400'}`}
        >
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span>Low Stock Attention</span>
            <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
            {summaryMetrics.lowStockCount}
          </div>
          <span className="text-[11px] text-amber-700 font-mono">
            {statusFilter === 'LOW_STOCK' ? 'Click to show all' : 'Click to filter low stock'}
          </span>
        </div>
      </div>

      {/* 2. Controls & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#89988F]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, or category..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus:outline-none focus:border-[#18583d] focus:ring-1 focus:ring-[#18583d]/20 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#89988F] hover:text-[#173127]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters & Export / Add Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d] cursor-pointer shadow-2xs"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-white text-[#173127]">
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d] cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="IN_STOCK">In Stock Only</option>
            <option value="LOW_STOCK">Low Stock Warning</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] p-1">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              title="Table view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-[#18583d] text-white shadow-xs' : 'text-[#607269] hover:text-[#173127]'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              aria-label="Card grid view"
              title="Card grid view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'cards' ? 'bg-[#18583d] text-white shadow-xs' : 'text-[#607269] hover:text-[#173127]'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCSV}
            aria-label="Download inventory record as CSV"
            title="Download inventory record as Excel/Google Sheets compatible CSV"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0F6F2] border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#18583d]" />
            <span>Download CSV</span>
          </button>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAdd}
            aria-label="Add new inventory product"
            className="px-4 py-2.5 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 3. Products View Container */}
      <div className="rounded-2xl bg-white border border-[#DCE8E0] overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-[#607269] space-y-3">
            <Package className="w-12 h-12 mx-auto text-[#DCE8E0]" />
            <div>
              <p className="text-sm font-semibold text-[#173127]">No products found matching your search</p>
              <p className="text-xs text-[#607269] mt-1 max-w-sm mx-auto">
                Try clearing search filters, or click &quot;Add Product&quot; to register new stock items.
              </p>
            </div>
            <button
              onClick={() => { setSearchTerm(''); setCategoryFilter('ALL'); setStatusFilter('ALL'); }}
              className="px-4 py-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-[#173127] text-xs hover:border-[#18583d]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {/* Context Subheader Bar */}
            <div className="px-5 py-2.5 bg-[#F7FAF8] border-b border-[#DCE8E0] flex items-center justify-between text-xs text-[#607269] font-mono">
              <span>
                Showing {filteredProducts.length} of {products.length} catalog items
              </span>
              <span className="hidden sm:inline">
                Tap + / - to make instant sales &amp; restock adjustments
              </span>
            </div>

            {/* Desktop Table View (active when viewMode === 'table') */}
            {viewMode === 'table' && (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F0F6F2] border-b border-[#DCE8E0] text-[#173127] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Product Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 font-mono">SKU</th>
                      <th className="py-3.5 px-4 text-right">In Stock</th>
                      <th className="py-3.5 px-4 text-right">Min Buffer</th>
                      <th className="py-3.5 px-4 text-right">Price / Value</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE8E0]">
                    {filteredProducts.map((p) => {
                      const isOutOfStock = p.quantity === 0;
                      const isLowStock = !isOutOfStock && p.quantity <= p.minimum_stock;
                      const totalLineVal = (p.selling_price || 0) * p.quantity;

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-[#F7FAF8] transition-colors group"
                        >
                          {/* Product Name */}
                          <td className="py-3.5 px-4 font-medium text-[#173127]">
                            <div className="font-semibold text-sm text-[#173127] group-hover:text-[#18583d] transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-[#607269] font-mono flex items-center gap-1.5 mt-0.5">
                              <span>Cost: ₹{p.cost_price || 0}</span>
                              <span aria-hidden="true">·</span>
                              <span>Selling: ₹{p.selling_price || 0}</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 text-[#607269]">
                            {p.category}
                          </td>

                          {/* SKU */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#607269]">
                            {p.sku}
                          </td>

                          {/* Current Stock */}
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#173127]">
                            <span className={isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-[#18583d]'}>
                              {p.quantity}
                            </span>{' '}
                            <span className="text-[11px] font-normal text-[#607269]">{p.unit}</span>
                          </td>

                          {/* Minimum Stock */}
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-[#607269]">
                            {p.minimum_stock} {p.unit}
                          </td>

                          {/* Price / Line Value */}
                          <td className="py-3.5 px-4 text-right font-mono text-xs">
                            <div className="font-semibold text-[#173127]">₹{p.selling_price || 0}</div>
                            <div className="text-[11px] text-[#607269]">Tot: ₹{totalLineVal.toLocaleString('en-IN')}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#18583d] bg-[#EBF6F0] border border-[#DCE8E0] px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#18583d]" />
                                In Stock
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Sell (-1) */}
                              <button
                                onClick={() => onQuickAdjust(p.id, -1)}
                                aria-label={`Sell 1 unit of ${p.name}`}
                                title="Sell 1 unit"
                                disabled={p.quantity <= 0}
                                className="p-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-[#173127] hover:bg-[#18583d] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick Add (+1) */}
                              <button
                                onClick={() => onQuickAdjust(p.id, 1)}
                                aria-label={`Restock 1 unit of ${p.name}`}
                                title="Add 1 unit"
                                className="p-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-[#173127] hover:bg-[#18583d] hover:text-white transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(p)}
                                aria-label={`Edit ${p.name}`}
                                title="Edit product"
                                className="p-1.5 rounded-lg text-[#607269] hover:text-[#18583d] hover:bg-[#F0F6F2] transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                aria-label={`Delete ${p.name}`}
                                title="Delete product"
                                className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
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

            {/* Mobile Cards (active on mobile < 768px, or when viewMode === 'cards' on any screen) */}
            <div className={`${viewMode === 'cards' ? 'block' : 'block md:hidden'} p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
              {filteredProducts.map((p) => {
                const isOutOfStock = p.quantity === 0;
                const isLowStock = !isOutOfStock && p.quantity <= p.minimum_stock;
                const totalLineVal = (p.selling_price || 0) * p.quantity;

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-white border border-[#DCE8E0] flex flex-col justify-between space-y-3 hover:border-[#18583d] transition-all shadow-2xs"
                  >
                    {/* Header: Title + Category + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#173127] text-sm">{p.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#607269] font-mono">
                          <span>{p.category}</span>
                          <span>·</span>
                          <span>{p.sku}</span>
                        </div>
                      </div>
                      <div>
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF6F0] text-[#18583d] border border-[#DCE8E0]">
                            In Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Numbers & Pricing Row */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-xs">
                      <div>
                        <span className="text-[10px] text-[#607269] block">Current Stock</span>
                        <div className="text-lg font-extrabold font-mono text-[#173127]">
                          <span className={isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-[#18583d]'}>
                            {p.quantity}
                          </span>{' '}
                          <span className="text-xs font-normal text-[#607269]">{p.unit}</span>
                        </div>
                        <span className="text-[10px] text-[#89988F] font-mono">Min buffer: {p.minimum_stock}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#607269] block">Selling Price</span>
                        <div className="text-lg font-extrabold font-mono text-[#173127]">
                          ₹{p.selling_price || 0}
                        </div>
                        <span className="text-[10px] text-[#89988F] font-mono">Total: ₹{totalLineVal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Quick Adjust & Actions */}
                    <div className="pt-2 border-t border-[#DCE8E0] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onQuickAdjust(p.id, -1)}
                          disabled={p.quantity <= 0}
                          aria-label={`Sell 1 unit of ${p.name}`}
                          className="px-3 py-1.5 rounded-lg bg-[#F0F6F2] hover:bg-[#18583d] hover:text-white border border-[#DCE8E0] text-[#173127] font-bold text-xs flex items-center gap-1 disabled:opacity-30 cursor-pointer transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                          <span>Sell</span>
                        </button>
                        <button
                          onClick={() => onQuickAdjust(p.id, 1)}
                          aria-label={`Restock 1 unit of ${p.name}`}
                          className="px-3 py-1.5 rounded-lg bg-[#F0F6F2] hover:bg-[#18583d] hover:text-white border border-[#DCE8E0] text-[#173127] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          aria-label={`Edit ${p.name}`}
                          className="p-2 rounded-lg text-[#607269] hover:text-[#18583d] hover:bg-[#F0F6F2] cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          aria-label={`Delete ${p.name}`}
                          className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
          aria-describedby="product-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 border border-[#DCE8E0] shadow-xl relative text-[#173127]">
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close product modal"
              className="absolute top-5 right-5 text-[#89988F] hover:text-[#173127] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 id="product-modal-title" className="text-lg font-bold text-[#173127] mb-1 font-heading">
              {editingProduct ? 'Edit Product Details' : 'Add New Inventory Product'}
            </h3>
            <p id="product-modal-desc" className="text-xs text-[#607269] mb-5">
              Fill in the stock metadata. Sahayak will track this item in natural language messages.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#173127] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maggi 2-Minute Noodles 70g"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus:outline-none focus:border-[#18583d] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#173127] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d] cursor-pointer focus:bg-white"
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
                  <label className="block text-xs font-semibold text-[#173127] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. MAG-70G"
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] font-mono text-xs focus:outline-none focus:border-[#18583d] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#173127] mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] font-mono text-xs focus:outline-none focus:border-[#18583d] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173127] mb-1">
                    Min Stock Buffer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={minimumStock}
                    onChange={(e) => setMinimumStock(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] font-mono text-xs focus:outline-none focus:border-[#18583d] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173127] mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d] cursor-pointer focus:bg-white"
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
                  <label className="block text-xs font-semibold text-[#173127] mb-1">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] font-mono text-xs focus:outline-none focus:border-[#18583d] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173127] mb-1">
                    Selling Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127] font-mono text-xs focus:outline-none focus:border-[#18583d] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#DCE8E0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE8E0] text-xs font-medium text-[#607269] hover:bg-[#F0F6F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white font-bold text-xs shadow-sm cursor-pointer"
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
