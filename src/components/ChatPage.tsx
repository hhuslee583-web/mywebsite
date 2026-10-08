import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MoodType } from '../types';
import { CONVERSATION_STARTERS, MOODS } from '../utils/constants';
import {
  Send,
  Volume2,
  VolumeX,
  BookmarkPlus,
  Wind,
  RotateCcw,
  Sparkles,
  User,
  Check,
} from 'lucide-react';

interface ChatPageProps {
  initialMood?: MoodType | null;
  onSaveToJournalDraft: (content: string, mood?: MoodType) => void;
  onOpenBreathingModal: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  initialMood,
  onSaveToJournalDraft,
  onOpenBreathingModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('hugme_chat_messages_cat_mn_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure no stale moja in parsed content
        const clean = parsed.map((m: any) => ({
          ...m,
          content: typeof m.content === 'string' ? m.content.replace(/игэ\s*мояя~?/gi, 'юу болсон бэ?') : m.content,
        }));
        return clean;
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content:
          "hiii! Би бяцхан Үйсэ муужгай байна 🐾 Манай аюулгүй зөөлөн буланд тавтай морил.\n\nЗөөлөн амьсгаа аваад, савар дээр минь тухтай суун өнөөдөр сэтгэлд тань юу болоод байгааг надад чөлөөтэй хуваалцаарай. Энд ямар ч дарамт байхгүй, хэн ч чамайг шүүмжлэхгүй, okeyyy? Өнөөдөр сэтгэл санаа нь ямархуу байна даа?",
        timestamp: Date.now(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMoodContext, setActiveMoodContext] = useState<MoodType | null>(
    initialMood || null
  );
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [savedMessageId, setSavedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom whenever messages or loading state changes
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  useEffect(() => {
    localStorage.setItem('hugme_chat_messages_cat_mn_v3', JSON.stringify(messages));
    // Trigger scroll immediately and with a small delay for DOM layout
    scrollToBottom('smooth');
    const timer = setTimeout(() => scrollToBottom('smooth'), 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialMood) {
      setActiveMoodContext(initialMood);
    }
  }, [initialMood]);

  // Always keep input focused for seamless typing
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Speech synthesis helper
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.15; // slightly higher, friendly cat tone

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Keep textarea focused and scroll
    setTimeout(() => {
      scrollToBottom('smooth');
      inputRef.current?.focus();
    }, 50);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMood: activeMoodContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content:
          data.reply ||
          "hiii! Би яг дэргэд чинь савраа тавиад сууж байна шүү. Зөөлөн амьсгаа аваарай, okeyyy? 🐾",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Error fetching dynamic chat reply:', err);
      const fallbackMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content:
          "hiii! Би чамайг маш анхааралтай сонсож байна шүү 🐾 Ааш chincha, одоогоор сүлжээ түр саатлаа... гэхдээ okeyyy, би дэргэд чинь байгаа тул хүссэнээрээ хуваалцаарай. Яасан бэ? Сэтгэлд чинь өөр юу бодогдож байна вэ?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom('smooth');
        inputRef.current?.focus();
      }, 80);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const freshWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content:
        "hiii! Бид яриагаа шинээр эхлүүллээ 🐾 Юу болсон бэ? Сэтгэл санаа нь яг одоо ямархуу байна даа?",
      timestamp: Date.now(),
    };
    setMessages([freshWelcome]);
    localStorage.removeItem('hugme_chat_messages_cat_mn_v3');
    setTimeout(() => {
      scrollToBottom('auto');
      inputRef.current?.focus();
    }, 50);
  };

  const handleSaveToJournal = (msg: ChatMessage) => {
    onSaveToJournalDraft(
      `Үйсэ мууртай хийсэн ярианаас:\n\n"${msg.content}"`,
      activeMoodContext || 'Calm'
    );
    setSavedMessageId(msg.id);
    setTimeout(() => setSavedMessageId(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Top Chat Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE9E1] shadow-sm mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#EAE2D7] bg-[#FFF5EE]">
              <img
                src="/src/assets/images/uise_cat_avatar_1791454387844.jpg"
                alt="Үйсэ муур"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"
              title="Үйсэ муур анхааралтай сонсож байна"
            ></span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#2C2825] font-display flex items-center gap-1">
                Үйсэ 🐱
              </h2>
              <span className="text-[11px] font-medium text-[#4D7060] bg-[#F2F7F4] px-2 py-0.5 rounded-full border border-[#C7DCD1]">
                Интерактив AI муужгай
              </span>
            </div>
            <p className="text-xs text-[#736B63] mt-0.5">
              Эелдэг, халамжтай, дулаахан сэтгэл зүйн туслах
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeMoodContext && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF7F2] border border-[#EFE9E1] text-[#59524A]">
              <span>Мэдрэмж:</span>
              <span className="font-semibold text-[#E07A5F]">
                {MOODS[activeMoodContext]?.emoji} {MOODS[activeMoodContext]?.label}
              </span>
              <button
                onClick={() => setActiveMoodContext(null)}
                className="text-[#998E84] hover:text-[#2C2825] ml-1 text-xs cursor-pointer"
                title="Мэдрэмжийг арилгах"
              >
                ×
              </button>
            </div>
          )}

          <button
            onClick={onOpenBreathingModal}
            className="p-2 rounded-xl text-[#4D7060] bg-[#F2F7F4] hover:bg-[#E5EFE9] border border-[#C7DCD1] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="1 минутын амьсгалын дасгал хийх"
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Амьсгаа авах</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-[#736B63] hover:text-[#2C2825] hover:bg-[#F0EAE1]/70 transition-colors cursor-pointer"
            title="Яриаг цэвэрлэх"
            aria-label="Яриаг цэвэрлэх"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Stream with direct ref and smooth auto-scroll */}
      <div
        ref={chatContainerRef}
        className="flex-1 bg-white/70 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-[#EFE9E1] shadow-sm overflow-y-auto max-h-[60vh] space-y-5 scroll-smooth"
      >
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          const isSpeaking = speakingMessageId === message.id;
          const isSaved = savedMessageId === message.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${
                isAssistant ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAssistant && (
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#EAE2D7] mt-1 bg-[#FFF5EE] shadow-2xs">
                  <img
                    src="/src/assets/images/uise_cat_avatar_1791454387844.jpg"
                    alt="Үйсэ муур"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 transition-all text-left ${
                  isAssistant
                    ? 'bg-[#FAF7F2] text-[#2C2825] border border-[#EFE9E1] rounded-tl-sm shadow-xs'
                    : 'bg-[#E07A5F] text-white rounded-tr-sm shadow-xs'
                }`}
              >
                <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-line font-normal">
                  {message.content}
                </div>

                {/* Sub-bar on assistant responses for gentle actions */}
                {isAssistant && (
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EFE9E1]/80 text-xs text-[#736B63]">
                    <span className="text-[11px] text-[#998E84]">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSpeak(message.id, message.content)}
                        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                          isSpeaking
                            ? 'bg-[#E07A5F]/20 text-[#E07A5F]'
                            : 'hover:bg-[#EAE2D7]/60 text-[#736B63]'
                        }`}
                        title={isSpeaking ? 'Зогсоох' : 'Сонсох'}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px] hidden sm:inline">
                          {isSpeaking ? 'Зогсоох' : 'Сонсох'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleSaveToJournal(message)}
                        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                          isSaved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'hover:bg-[#EAE2D7]/60 text-[#736B63]'
                        }`}
                        title="Тэмдэглэлд хадгалах"
                      >
                        {isSaved ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px] hidden sm:inline">
                          {isSaved ? 'Хадгалагдлаа' : 'Тэмдэглэл'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-9 h-9 rounded-full bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading typing bubble */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center animate-in fade-in duration-150">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#EAE2D7] bg-[#FFF5EE]">
              <img
                src="/src/assets/images/uise_cat_avatar_1791454387844.jpg"
                alt="Үйсэ муур"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#FAF7F2] border border-[#EFE9E1] rounded-3xl rounded-tl-sm px-4 py-3 text-xs text-[#736B63] flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-bounce"></span>
              <span
                className="w-2 h-2 rounded-full bg-[#E07A5F] animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></span>
              <span
                className="w-2 h-2 rounded-full bg-[#E07A5F] animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></span>
              <span className="ml-1 text-[#82786F]">Үйсэ муужгай бичиж байна... 🐾</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Optional Conversation Starters (Purely optional inspiration chips) */}
      <div className="mt-3 mb-2 text-left">
        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-[#736B63]">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Санал болгох сэдэв (хүсвэл дарж эхлүүлж болно):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CONVERSATION_STARTERS.map((starter, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(starter);
                inputRef.current?.focus();
              }}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#FDF3F0] border border-[#EFE9E1] hover:border-[#F28D77]/50 text-[#59524A] hover:text-[#E07A5F] transition-colors cursor-pointer text-left whitespace-nowrap shadow-2xs"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>

      {/* Free Text Input box with keyboard handling and auto-scroll */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#EFE9E1] shadow-sm">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Үйсэ мууранд юу ч хамаагүй чөлөөтэй бичээрэй... (Enter дарж илгээнэ)"
            rows={2}
            className="flex-1 resize-none bg-transparent text-sm sm:text-base text-[#2C2825] placeholder:text-[#998E84] focus:outline-none p-2 leading-relaxed text-left"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-2xl flex-shrink-0 transition-all cursor-pointer ${
              input.trim() && !isLoading
                ? 'bg-[#E07A5F] text-white hover:bg-[#D46B4E] shadow-sm shadow-[#E07A5F]/30 scale-100 active:scale-95'
                : 'bg-[#F0EAE1] text-[#A69B90] cursor-not-allowed'
            }`}
            aria-label="Үйсэд зурвас илгээх"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 px-2 text-[11px] text-[#998E84] border-t border-[#F0EAE1]">
          <span>
            Enter дарж илгээнэ · Shift + Enter шинэ мөр · Та юу ч чөлөөтэй бичиж болно 🐾
          </span>
          <span>{input.length} тэмдэгт</span>
        </div>
      </div>
    </div>
  );
};
