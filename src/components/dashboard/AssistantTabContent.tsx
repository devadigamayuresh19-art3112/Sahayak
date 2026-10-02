import React from 'react';
import {
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Package,
  Layers,
  Info
} from 'lucide-react';
import { MessageRecord, Product } from '../../types';

interface AssistantTabContentProps {
  messages: MessageRecord[];
  products: Product[];
  onSelectPhrase: (phrase: string) => void;
}

export const AssistantTabContent: React.FC<AssistantTabContentProps> = ({
  messages,
  products,
  onSelectPhrase,
}) => {
  const sampleTestSuites = [
    {
      title: 'Marathi Regional Speech (मराठी)',
      language: 'Marathi',
      color: 'border-[#DCE8E0] bg-[#F7FAF8] text-[#173127]',
      items: [
        {
          phrase: 'मॅगी 20 आली आणि पेप्सी 5 विकली',
          meaning: 'Restock 20 Maggi + Sell 5 Pepsi (Multi-item action)',
        },
        {
          phrase: '20 Maggi आली aur 5 Pepsi विकल्या',
          meaning: 'Colloquial Marathi/Hinglish stock in & out',
        },
        {
          phrase: 'मॅगी वीस आली',
          meaning: 'Spoken Marathi word numeral (वीस = 20 units Inward)',
        },
      ],
    },
    {
      title: 'Hindi / Hinglish Everyday Speech (हिंदी)',
      language: 'Hindi/Hinglish',
      color: 'border-[#DCE8E0] bg-[#F7FAF8] text-[#173127]',
      items: [
        {
          phrase: 'मैगी 10 आई और 3 पेप्सी बिकी',
          meaning: '10 Maggi Inward + 3 Pepsi Sold (Multi-item)',
        },
        {
          phrase: 'Aaj 20 Maggi aayi',
          meaning: 'Stock In 20 units Maggi (Everyday Kirana Hinglish)',
        },
        {
          phrase: 'Maggi ke 8 packets bik gaye',
          meaning: 'Stock Out 8 packets Maggi',
        },
        {
          phrase: '10 Parle-G add karo',
          meaning: 'Quick Restock 10 Parle-G packets',
        },
      ],
    },
    {
      title: 'Retail English (Retail & POS Voice)',
      language: 'English',
      color: 'border-[#DCE8E0] bg-[#F7FAF8] text-[#173127]',
      items: [
        {
          phrase: '20 Maggi arrived',
          meaning: 'Stock In 20 units Maggi',
        },
        {
          phrase: '5 Pepsi sold',
          meaning: 'Stock Out 5 bottles Pepsi',
        },
        {
          phrase: '10 Parle G received',
          meaning: 'Stock In 10 packets Parle-G',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Quick Testing Deck */}
      <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#18583d]" />
            <h3 className="text-base font-bold text-[#173127] font-heading">
              Instant Natural Language Tester
            </h3>
          </div>
          <span className="text-xs text-[#18583d] font-mono font-medium">
            Click any phrase to parse &amp; test Sahayak immediately
          </span>
        </div>

        <p className="text-xs text-[#607269]">
          Sahayak is built to process messy, fast real-world Kirana speech. Test combinations of stock additions, customer sales, and regional numbers below:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
          {sampleTestSuites.map((suite, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-4 border flex flex-col justify-between ${suite.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-[#173127] tracking-wide">
                    {suite.title}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white text-[#18583d] border border-[#DCE8E0] font-semibold">
                    {suite.language}
                  </span>
                </div>

                <div className="space-y-2">
                  {suite.items.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onSelectPhrase(item.phrase)}
                      className="w-full text-left p-2.5 rounded-xl bg-white border border-[#DCE8E0] hover:border-[#18583d] hover:bg-[#F0F6F2] text-xs transition-all hover:translate-x-1 cursor-pointer group shadow-2xs"
                    >
                      <div className="font-semibold text-[#173127] group-hover:text-[#18583d] flex items-center justify-between">
                        <span>&ldquo;{item.phrase}&rdquo;</span>
                        <ArrowRight className="w-3 h-3 text-[#89988F] group-hover:text-[#18583d] shrink-0 ml-1" />
                      </div>
                      <div className="text-[11px] text-[#607269] mt-0.5">
                        {item.meaning}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Message History & NLP Audit Log */}
      <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#18583d]" />
            <h3 className="text-base font-bold text-[#173127] font-heading">
              NLP Message Audit History
            </h3>
          </div>
          <span className="text-xs font-mono text-[#607269]">
            {messages.length} message records
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="py-12 text-center text-[#607269] space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-[#DCE8E0]" />
            <p className="text-sm font-semibold text-[#173127]">No natural language messages yet</p>
            <p className="text-xs text-[#607269] max-w-sm mx-auto">
              Type or speak any inventory note using the assistant input above to see real-time parsing audits.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {/* Left: Input Text & Parsed summary */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#173127]">
                      &ldquo;{record.raw_text}&rdquo;
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#18583d] border border-[#DCE8E0] font-bold">
                      {(record.confidence * 100).toFixed(0)}% Match
                    </span>
                  </div>

                  {/* Badges for each parsed intent */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    {record.parsed_intent.map((intent, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                          intent.operation === 'stock_in'
                            ? 'bg-[#EBF6F0] text-[#18583d] border-[#DCE8E0]'
                            : 'bg-[#FFF5F5] text-red-700 border-red-200'
                        }`}
                      >
                        {intent.operation === 'stock_in' ? '+ In' : '− Out'}{' '}
                        {intent.quantity} {intent.unit} {intent.productName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Timestamp and Status */}
                <div className="flex items-center gap-3 shrink-0 text-xs text-[#607269]">
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#89988F]" />
                    <span>{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      record.status === 'confirmed'
                        ? 'bg-[#EBF6F0] text-[#18583d] border border-[#DCE8E0]'
                        : record.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {record.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Catalog Voice Triggers Cheatsheet */}
      <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#18583d]" />
          <h3 className="text-base font-bold text-[#173127] font-heading">
            Your Active Shop Vocabulary ({products.length} Products)
          </h3>
        </div>
        <p className="text-xs text-[#607269]">
          Sahayak automatically listens for these products and their Hindi/Marathi names:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {products.map((p) => (
            <div
              key={p.id}
              className="px-3 py-1.5 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#173127] flex items-center gap-1.5"
            >
              <span className="font-semibold">{p.name}</span>
              <span className="text-[10px] text-[#607269] font-mono">({p.unit})</span>
              <span className="text-[10px] text-[#18583d] font-bold font-mono">₹{p.selling_price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
