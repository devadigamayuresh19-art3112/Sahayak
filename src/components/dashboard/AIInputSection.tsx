import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2 } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { ParsedMessage } from '../../types';

interface AIInputSectionProps {
  onProcessInput: (text: string, sourceType: 'voice' | 'text') => void;
  preferredLanguage: string;
}

export const AIInputSection: React.FC<AIInputSectionProps> = ({
  onProcessInput,
  preferredLanguage,
}) => {
  const [inputText, setInputText] = useState('');

  const handleVoiceFinal = (spokenText: string) => {
    if (spokenText.trim()) {
      setInputText(spokenText);
      onProcessInput(spokenText, 'voice');
    }
  };

  const {
    isListening,
    transcript,
    status: voiceStatus,
    errorMessage: voiceError,
    startListening,
    stopListening
  } = useVoiceInput(handleVoiceFinal);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = (inputText || transcript).trim();
    if (!clean) return;

    onProcessInput(clean, isListening ? 'voice' : 'text');
    setInputText('');
    if (isListening) stopListening();
  };

  const handleQuickSuggestion = (phrase: string) => {
    setInputText(phrase);
    onProcessInput(phrase, 'text');
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(preferredLanguage || 'hi-IN');
    }
  };

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#18583d]/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#18583d] border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5 text-[#61b487] animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Tell Sahayak what happened...</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/50 text-emerald-400">
                AI NLP Active
              </span>
            </h3>
            <p className="text-xs text-emerald-200/70">
              Speak or type in Hindi, Hinglish, Marathi, or English. Sahayak records the stock automatically.
            </p>
          </div>
        </div>

        {/* Voice status pill */}
        {isListening && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-200 text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Listening... speak now</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-2xl bg-[#061810] border-2 border-emerald-600/40 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all shadow-inner">
          <input
            type="text"
            value={isListening && transcript ? transcript : inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='e.g. "Aaj 20 Maggi aayi", "5 Pepsi sold", "20 Maggi आली"'
            className="w-full py-4 pl-5 pr-28 text-white placeholder-emerald-700/60 bg-transparent text-sm sm:text-base focus:outline-none"
          />

          {/* Right Action Buttons */}
          <div className="absolute right-2.5 flex items-center gap-2">
            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleMic}
              title={isListening ? 'Stop listening' : 'Start speaking voice message'}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${isListening ? 'bg-red-600 text-white animate-bounce' : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-600/40'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !transcript.trim()}
              className="p-2.5 rounded-xl bg-[#61b487] hover:bg-[#78cea0] text-[#05110b] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Voice Visualizer Waveform when listening */}
      {isListening && (
        <div className="mt-3 flex items-center justify-center gap-1.5 py-2">
          {[40, 75, 55, 90, 60, 80, 45, 85, 65, 50].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-[#61b487] rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                maxHeight: '28px',
                animationDuration: `${0.4 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
          <span className="text-xs text-emerald-400 font-mono ml-2">Recording live audio...</span>
        </div>
      )}

      {/* Voice Error notice */}
      {voiceError && (
        <p className="mt-2 text-xs text-amber-300/90 flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" />
          <span>{voiceError} (You can type your message in the box above)</span>
        </p>
      )}

      {/* Quick Example Suggestions */}
      <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center flex-wrap gap-2 text-xs">
        <span className="text-emerald-400/80 font-medium">Quick examples:</span>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('Aaj 20 Maggi aayi')}
          className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/40 text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
        >
          &quot;Aaj 20 Maggi aayi&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('5 Pepsi bottles sold')}
          className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/40 text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
        >
          &quot;5 Pepsi bottles sold&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('10 Parle-G add karo')}
          className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/40 text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
        >
          &quot;10 Parle-G add karo&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('Maggi ke 4 packets bik gaye')}
          className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/40 text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
        >
          &quot;Maggi ke 4 packets bik gaye&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('20 Maggi आली aur 5 Pepsi विकल्या')}
          className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/40 text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
        >
          &quot;20 Maggi आली aur 5 Pepsi विकल्या&quot; (Marathi)
        </button>
      </div>
    </div>
  );
};
