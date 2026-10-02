import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Edit3, Plus, Sparkles, X } from 'lucide-react';
import { NLPOperation, ParsedIntentItem, ParsedMessage, Product } from '../../types';

interface NLPConfirmationModalProps {
  parsedMessage: ParsedMessage;
  existingCatalog: Product[];
  isDuplicate: boolean;
  onConfirm: (finalIntents: ParsedIntentItem[]) => void;
  onCancel: () => void;
  onAddNewProductRequested: (productName: string, initialQty: number, operation: NLPOperation) => void;
}

export const NLPConfirmationModal: React.FC<NLPConfirmationModalProps> = ({
  parsedMessage,
  existingCatalog,
  isDuplicate,
  onConfirm,
  onCancel,
  onAddNewProductRequested,
}) => {
  // Local state allowing user to edit items if confidence is ambiguous or they want to adjust
  const [editableIntents, setEditableIntents] = useState<ParsedIntentItem[]>(
    parsedMessage.intents.map(intent => ({ ...intent }))
  );
  const [isEditing, setIsEditing] = useState(parsedMessage.isAmbiguous);

  const handleUpdateItem = (index: number, updates: Partial<ParsedIntentItem>) => {
    setEditableIntents(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleConfirmAll = () => {
    onConfirm(editableIntents);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl glass-panel p-6 sm:p-8 border border-emerald-400/40 shadow-2xl relative bg-[#081f15]">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-emerald-400/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#18583d] border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5 text-[#61b487]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Review Inventory Update</h3>
            <p className="text-xs text-emerald-300/80">
              Language detected: <strong className="text-emerald-200">{parsedMessage.languageDetected}</strong>
            </p>
          </div>
        </div>

        {/* Raw Input Quote */}
        <div className="mb-4 p-3 rounded-xl bg-[#05110b] border border-emerald-800/40 text-xs text-emerald-200/90 italic flex items-center justify-between">
          <span>&ldquo;{parsedMessage.rawText}&rdquo;</span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
            {(parsedMessage.overallConfidence * 100).toFixed(0)}% Confidence
          </span>
        </div>

        {/* Duplicate Warning */}
        {isDuplicate && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Duplicate Notice:</strong> You submitted this exact message less than a minute ago. Verify before confirming.
            </span>
          </div>
        )}

        {/* Ambiguity Alert */}
        {parsedMessage.isAmbiguous && !isEditing && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{parsedMessage.suggestedClarification || "Ambiguous intent detected. Please verify action."}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 bg-amber-800/60 rounded text-[11px] font-bold text-white hover:bg-amber-700"
            >
              Edit Now
            </button>
          </div>
        )}

        {/* Parsed Items List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {editableIntents.map((item, idx) => {
            const hasMatchedProduct = item.isExistingProduct && item.matchedProductName;

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#061810] border border-emerald-700/40 space-y-3"
              >
                {!isEditing ? (
                  // Read-Only Preview
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {hasMatchedProduct ? item.matchedProductName : item.productName}
                        </span>
                        {!hasMatchedProduct && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                            New Product
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-400/80 mt-0.5">
                        Action:{' '}
                        <strong className={item.operation === 'stock_in' ? 'text-[#61b487]' : 'text-red-400'}>
                          {item.operation === 'stock_in' ? 'Stock In (Add)' : 'Stock Out (Sold)'}
                        </strong>{' '}
                        · Qty:{' '}
                        <strong className="text-white font-mono">
                          {item.operation === 'stock_in' ? `+${item.quantity}` : `-${item.quantity}`} {item.unit}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-emerald-400 hover:text-white rounded-lg hover:bg-emerald-900/40 cursor-pointer"
                        title="Edit details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Editable Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-emerald-400 mb-1">Product Name</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleUpdateItem(idx, { productName: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#081f15] border border-emerald-600/40 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-emerald-400 mb-1">Select Action</label>
                        <select
                          value={item.operation}
                          onChange={(e) => handleUpdateItem(idx, { operation: e.target.value as NLPOperation })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#081f15] border border-emerald-600/40 text-white text-xs focus:outline-none focus:border-emerald-400"
                        >
                          <option value="stock_in">Stock In (Maal Aaya / Received)</option>
                          <option value="stock_out">Stock Out (Bik Gaya / Sold)</option>
                          <option value="adjustment">Stock Adjustment</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-emerald-400 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, { quantity: parseInt(e.target.value, 10) || 1 })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#081f15] border border-emerald-600/40 text-white text-xs focus:outline-none focus:border-emerald-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-emerald-400 mb-1">Unit</label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(idx, { unit: e.target.value })}
                          placeholder="packets / bottles"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#081f15] border border-emerald-600/40 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* If new product detected, offer button to add to catalog with category/SKU */}
                {!hasMatchedProduct && (
                  <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-xs">
                    <span className="text-emerald-400/80">New product not found in catalog.</span>
                    <button
                      type="button"
                      onClick={() => onAddNewProductRequested(item.productName, item.quantity, item.operation)}
                      className="px-2.5 py-1 rounded bg-[#18583d] text-emerald-200 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Shop Catalog</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-emerald-800/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-emerald-800 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-950 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-emerald-600 text-xs font-semibold text-emerald-200 hover:bg-emerald-900 cursor-pointer"
              >
                Done Editing
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirmAll}
              className="px-6 py-2.5 rounded-xl bg-[#61b487] hover:bg-[#79ce9f] text-[#05110b] font-bold text-xs transition-all shadow-[0_0_20px_rgba(97,180,135,0.4)] flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Update Inventory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
