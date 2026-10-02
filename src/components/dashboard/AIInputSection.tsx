import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2 } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';

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
    <div className="rounded-2xl bg-white p-6 sm:p-7 border border-[#DCE8E0] shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-center text-[#18583d]">
            <Sparkles className="w-5 h-5 text-[#18583d]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#173127] flex items-center gap-2 font-heading">
              <span>Tell Sahayak what happened...</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F0F6F2] border border-[#DCE8E0] text-[#18583d] font-semibold">
                AI NLP Active
              </span>
            </h3>
            <p className="text-xs text-[#607269]">
              Speak or type in Hindi, Hinglish, Marathi, or English. Sahayak records the stock automatically.
            </p>
          </div>
        </div>

        {/* Voice status pill */}
        {isListening && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Listening... speak now</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] focus-within:border-[#18583d] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#18583d]/15 transition-all shadow-inner">
          <input
            type="text"
            value={isListening && transcript ? transcript : inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='e.g. "Aaj 20 Maggi aayi", "5 Pepsi sold", "20 Maggi आली"'
            className="w-full py-3.5 pl-4 pr-28 text-[#173127] placeholder-[#89988F] bg-transparent text-sm sm:text-base focus:outline-none"
          />

          {/* Right Action Buttons */}
          <div className="absolute right-2 flex items-center gap-1.5">
            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleMic}
              aria-label={isListening ? 'Stop recording voice note' : 'Start speaking voice message in Hindi, Marathi, or English'}
              title={isListening ? 'Stop listening' : 'Start speaking voice message'}
              className={`p-2 rounded-lg transition-all cursor-pointer ${isListening ? 'bg-red-600 text-white animate-bounce' : 'bg-[#F0F6F2] hover:bg-[#DCE8E0] text-[#18583d] border border-[#DCE8E0]'}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !transcript.trim()}
              aria-label="Send inventory note to Sahayak"
              className="p-2 rounded-lg bg-[#18583d] hover:bg-[#0d3d29] text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-xs hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Voice Visualizer Waveform when listening */}
      {isListening && (
        <div className="mt-3 flex items-center justify-center gap-1.5 py-2" role="status" aria-live="polite">
          {[40, 75, 55, 90, 60, 80, 45, 85, 65, 50].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-[#18583d] rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                maxHeight: '24px',
                animationDuration: `${0.4 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
          <span className="text-xs text-[#18583d] font-mono ml-2 font-medium">Recording live audio...</span>
        </div>
      )}

      {/* Voice Error notice */}
      {voiceError && (
        <p className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1" role="alert">
          <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{voiceError} (You can type your message in the box above)</span>
        </p>
      )}

      {/* Quick Example Suggestions */}
      <div className="mt-4 pt-3 border-t border-[#DCE8E0] flex items-center flex-wrap gap-2 text-xs">
        <span className="text-[#607269] font-medium">Try asking Sahayak:</span>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('मॅगी 20 आली आणि पेप्सी 5 विकली')}
          className="px-2.5 py-1 rounded-lg bg-[#F0F6F2] hover:bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] transition-colors cursor-pointer"
        >
          &quot;मॅगी 20 आली आणि पेप्सी 5 विकली&quot; (मराठी)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('मैगी 10 आई और 3 पेप्सी बिकी')}
          className="px-2.5 py-1 rounded-lg bg-[#F0F6F2] hover:bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] transition-colors cursor-pointer"
        >
          &quot;मैगी 10 आई और 3 पेप्सी बिकी&quot; (हिंदी)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('20 Maggi arrived')}
          className="px-2.5 py-1 rounded-lg bg-[#F0F6F2] hover:bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] transition-colors cursor-pointer"
        >
          &quot;20 Maggi arrived&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('5 Pepsi sold')}
          className="px-2.5 py-1 rounded-lg bg-[#F0F6F2] hover:bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] transition-colors cursor-pointer"
        >
          &quot;5 Pepsi sold&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('10 Parle G received')}
          className="px-2.5 py-1 rounded-lg bg-[#F0F6F2] hover:bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] transition-colors cursor-pointer"
        >
          &quot;10 Parle G received&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('Aaj 20 Maggi aayi')}
          className="px-2.5 py-1 rounded-lg bg-[#F0F6F2] hover:bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] transition-colors cursor-pointer"
        >
          &quot;Aaj 20 Maggi aayi&quot;
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('Maggi ke 8 packets bik gaye')}
          className="px-2.5 py-1 rounded-lg bg-[#F0F6F2] hover:bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] transition-colors cursor-pointer"
        >
          &quot;Maggi ke 8 packets bik gaye&quot;
        </button>
      </div>
    </div>
  );
};
