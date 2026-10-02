import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nlp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 border border-[#DCE8E0] shadow-xl relative text-[#173127]">
        {/* Close Button */}
        <button
          onClick={onCancel}
          aria-label="Close confirmation dialog"
          className="absolute top-5 right-5 text-[#89988F] hover:text-[#173127] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-center text-[#18583d]">
            <Sparkles className="w-5 h-5 text-[#18583d]" />
          </div>
          <div>
            <h3 id="nlp-modal-title" className="text-lg font-bold text-[#173127] font-heading">
              Review Inventory Update
            </h3>
            <p className="text-xs text-[#607269]">
              Language detected: <strong className="text-[#18583d] font-semibold">{parsedMessage.languageDetected}</strong>
            </p>
          </div>
        </div>

        {/* Raw Input Quote */}
        <div className="mb-4 p-3 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-xs text-[#173127] italic flex items-center justify-between">
          <span>&ldquo;{parsedMessage.rawText}&rdquo;</span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#EBF6F0] text-[#18583d] font-bold border border-[#DCE8E0]">
            {(parsedMessage.overallConfidence * 100).toFixed(0)}% Confidence
          </span>
        </div>

        {/* Duplicate Warning */}
        {isDuplicate && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Duplicate Notice:</strong> You submitted this exact message less than a minute ago. Verify before confirming.
            </span>
          </div>
        )}

        {/* Ambiguity Alert */}
        {parsedMessage.isAmbiguous && !isEditing && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{parsedMessage.suggestedClarification || "Ambiguous intent detected. Please verify action."}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 bg-amber-200 rounded text-[11px] font-bold text-amber-900 hover:bg-amber-300 cursor-pointer"
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
                className="p-4 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] space-y-3 shadow-2xs"
              >
                {!isEditing ? (
                  // Read-Only Preview
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#173127] text-sm">
                          {hasMatchedProduct ? item.matchedProductName : item.productName}
                        </span>
                        {!hasMatchedProduct && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F0F6F2] text-[#18583d] font-semibold border border-[#DCE8E0]">
                            New Product
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#607269] mt-0.5">
                        Action:{' '}
                        <strong className={item.operation === 'stock_in' ? 'text-[#18583d]' : 'text-red-600'}>
                          {item.operation === 'stock_in' ? 'Stock In (Add)' : 'Stock Out (Sold)'}
                        </strong>{' '}
                        · Qty:{' '}
                        <strong className="text-[#173127] font-mono">
                          {item.operation === 'stock_in' ? `+${item.quantity}` : `-${item.quantity}`} {item.unit}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-[#607269] hover:text-[#18583d] rounded-lg hover:bg-white cursor-pointer"
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
                        <label className="block text-[11px] text-[#607269] mb-1 font-semibold">Product Name</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleUpdateItem(idx, { productName: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#607269] mb-1 font-semibold">Select Action</label>
                        <select
                          value={item.operation}
                          onChange={(e) => handleUpdateItem(idx, { operation: e.target.value as NLPOperation })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d] cursor-pointer"
                        >
                          <option value="stock_in">Stock In (Maal Aaya / Received)</option>
                          <option value="stock_out">Stock Out (Bik Gaya / Sold)</option>
                          <option value="adjustment">Stock Adjustment</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#607269] mb-1 font-semibold">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, { quantity: parseInt(e.target.value, 10) || 1 })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#607269] mb-1 font-semibold">Unit</label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(idx, { unit: e.target.value })}
                          placeholder="packets / bottles"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* If new product detected, offer button to add to catalog with category/SKU */}
                {!hasMatchedProduct && (
                  <div className="pt-2 border-t border-[#DCE8E0] flex items-center justify-between text-xs">
                    <span className="text-[#607269]">New product not found in catalog.</span>
                    <button
                      type="button"
                      onClick={() => onAddNewProductRequested(item.productName, item.quantity, item.operation)}
                      className="px-2.5 py-1 rounded bg-[#18583d] text-white hover:bg-[#0d3d29] font-medium flex items-center gap-1 cursor-pointer"
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
        <div className="mt-6 pt-4 border-t border-[#DCE8E0] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[#DCE8E0] text-xs font-semibold text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-[#DCE8E0] text-xs font-semibold text-[#173127] hover:bg-[#F0F6F2] cursor-pointer"
              >
                Done Editing
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirmAll}
              className="px-6 py-2.5 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
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
