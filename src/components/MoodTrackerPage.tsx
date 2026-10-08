import React, { useState } from 'react';
import { MoodType, MoodEntry } from '../types';
import { MOODS, INITIAL_MOOD_ENTRIES } from '../utils/constants';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  MessageCircleHeart,
  PlusCircle,
  Tag,
  CheckCircle2,
  Trash2,
  Heart,
} from 'lucide-react';

interface MoodTrackerPageProps {
  onTalkAboutMood: (mood: MoodType) => void;
}

const COMMON_TAGS_MN = [
  'Ажил',
  'Харилцаа',
  'Гэр бүл',
  'Амралт',
  'Нойр',
  'Эрүүл мэнд',
  'Хичээл',
  'Нийгмийн харилцаа',
  'Ганцаараа байх',
  'Цаг агаар',
];

export const MoodTrackerPage: React.FC<MoodTrackerPageProps> = ({
  onTalkAboutMood,
}) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('hugme_mood_history_mn');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_MOOD_ENTRIES;
  });

  const [selectedMood, setSelectedMood] = useState<MoodType>('Calm');
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  const saveEntriesToStorage = (entries: MoodEntry[]) => {
    setMoodEntries(entries);
    localStorage.setItem('hugme_mood_history_mn', JSON.stringify(entries));
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleLogMood = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      mood: selectedMood,
      intensity,
      note: note.trim(),
      tags: selectedTags,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...moodEntries];
    saveEntriesToStorage(updated);
    setNote('');
    setSelectedTags([]);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = moodEntries.filter((item) => item.id !== id);
    saveEntriesToStorage(updated);
  };

  // Compute distribution
  const moodCounts: Record<MoodType, number> = {
    Happy: 0,
    Calm: 0,
    Okay: 0,
    Sad: 0,
    Anxious: 0,
    Angry: 0,
    Lonely: 0,
    Stressed: 0,
  };

  moodEntries.forEach((entry) => {
    if (moodCounts[entry.mood] !== undefined) {
      moodCounts[entry.mood]++;
    }
  });

  const totalLogged = moodEntries.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F7F4] text-[#4D7060] text-xs font-medium border border-[#C7DCD1] mb-2">
          <Heart className="w-3.5 h-3.5" />
          <span>Сэтгэл хөдлөлийн цаг агаар</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#2C2825]">
          Сэтгэл санааны хэмжүүр
        </h1>
        <p className="text-sm text-[#736B63] mt-1 max-w-xl">
          Өөрийгөө шүүмжлэх бус сонирхон ажиглаарай. Бүх төрлийн мэдрэмж энд тавтай
          морилно.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Log today's mood */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#EFE9E1] shadow-sm text-left">
          <h2 className="text-lg font-bold font-display text-[#2C2825] mb-4 flex items-center justify-between">
            <span>Та яг одоо ямар мэдрэмжтэй байна вэ?</span>
            {showSavedFeedback && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Зөөлөн хадгалагдлаа
              </span>
            )}
          </h2>

          <form onSubmit={handleLogMood} className="space-y-5">
            {/* Mood selector grid */}
            <div>
              <label className="text-xs font-semibold text-[#59524A] block mb-2">
                Мэдрэмжээ сонгох:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(MOODS) as MoodType[]).map((mKey) => {
                  const meta = MOODS[mKey];
                  const isSelected = selectedMood === mKey;
                  return (
                    <button
                      type="button"
                      key={mKey}
                      onClick={() => setSelectedMood(mKey)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-offset-1 ring-[#E07A5F] shadow-xs'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: meta.bgLight,
                        borderColor: isSelected ? meta.color : meta.borderColor,
                      }}
                    >
                      <span className="text-2xl mb-1">{meta.emoji}</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: meta.textColor }}
                      >
                        {meta.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Intensity slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#59524A] mb-1.5">
                <label className="font-semibold">Мэдрэмжийн хүч:</label>
                <span className="text-[#82786F]">Түвшин {intensity} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                className="w-full accent-[#E07A5F] h-2 bg-[#F0EAE1] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#998E84] mt-1 px-1">
                <span>Хөнгөн</span>
                <span>Дунд зэрэг</span>
                <span>Гүн хүчтэй</span>
              </div>
            </div>

            {/* Tags / Influences */}
            <div>
              <label className="text-xs font-semibold text-[#59524A] block mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#C77D5E]" />
                <span>Энэ мэдрэмжид юу нөлөөлсөн бэ? (Сонголтоор):</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_TAGS_MN.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[#E07A5F] text-white border-[#E07A5F]'
                          : 'bg-[#FAF7F2] text-[#686058] border-[#EFE9E1] hover:bg-[#F0EAE1]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Note */}
            <div>
              <label className="text-xs font-semibold text-[#59524A] block mb-1.5">
                Товч тэмдэглэл эсвэл бодол (Сонголтоор):
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Өнөөдөр юу тохиолдов? Эсвэл бие тань юу мэдэрч байна?"
                rows={2}
                className="w-full text-xs sm:text-sm p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-[#2C2825] placeholder:text-[#998E84] focus:outline-none focus:border-[#E07A5F]"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#E07A5F] hover:bg-[#D46B4E] text-white text-sm font-semibold transition-colors shadow-sm shadow-[#E07A5F]/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Өнөөдрийн мэдрэмжийг хадгалах</span>
              </button>
            </div>
          </form>

          {/* Quick jump to Uise */}
          <div className="mt-5 pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
            <span className="text-xs text-[#736B63]">
              Энэ мэдрэмжийн талаар ярилцмаар байна уу?
            </span>
            <button
              onClick={() => onTalkAboutMood(selectedMood)}
              className="text-xs font-semibold text-[#E07A5F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MessageCircleHeart className="w-3.5 h-3.5" />
              <span>Үйсэтэй ярилцах</span>
            </button>
          </div>
        </div>

        {/* Right Section: Visual History & Insights */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Uise's Caring Cat Insight Card */}
          <div className="bg-[#FAF7F2] border border-[#EFE9E1] rounded-3xl p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-[#EAE2D7] bg-[#FFF5EE]">
              <img
                src="/src/assets/images/uise_cat_avatar_1791454387844.jpg"
                alt="Үйсэ муур"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C77D5E] mb-1">
                Үйсэ муурнаас илгээх зөөлөн эргэцүүлэл 🐾
              </h3>
              <p className="text-xs sm:text-sm text-[#59524A] leading-relaxed">
                &ldquo;hiii! wuaaa!! Та бидэнтэй {totalLogged} удаа сэтгэлээ хуваалцсан байна шүү 🐾
                Мэдрэмж ирж буцдаг давалгаа мэт гэдгийг санаарай, okeyyy? Заримдаа &apos;ааш chincha&apos;
                гэмээр хэцүү өдрүүд ирдэг ч таны үнэ цэн хэзээд хэвээрээ байдаг юм шүү~&rdquo;
              </p>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-[#EFE9E1] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-display text-[#2C2825] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#6B8E7D]" />
                <span>Сэтгэл хөдлөлийн тойм</span>
              </h3>
              <span className="text-xs text-[#82786F]">
                Нийт тэмдэглэсэн: {totalLogged}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(MOODS) as MoodType[]).map((mKey) => {
                const count = moodCounts[mKey] || 0;
                const meta = MOODS[mKey];
                const percentage =
                  totalLogged > 0 ? Math.round((count / totalLogged) * 100) : 0;

                return (
                  <div
                    key={mKey}
                    className="p-3 rounded-2xl border text-center"
                    style={{
                      backgroundColor: meta.bgLight,
                      borderColor: meta.borderColor,
                    }}
                  >
                    <div className="text-xl mb-1">{meta.emoji}</div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: meta.textColor }}
                    >
                      {meta.label}
                    </div>
                    <div className="text-xs font-mono tabular-nums text-[#736B63] mt-0.5">
                      {count} удаа ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline of Logged Moods */}
          <div className="bg-white rounded-3xl p-6 border border-[#EFE9E1] shadow-sm">
            <h3 className="text-base font-bold font-display text-[#2C2825] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E07A5F]" />
              <span>Сүүлийн тэмдэглэлүүдийн түүх</span>
            </h3>

            {moodEntries.length === 0 ? (
              <p className="text-xs text-[#82786F] py-4 text-center">
                Одоогоор тэмдэглэл хийгдээгүй байна. Зүүн талд мэдрэмжээ тэмдэглээрэй!
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {moodEntries.map((entry) => {
                  const meta = MOODS[entry.mood];
                  const dateStr = new Date(entry.timestamp).toLocaleDateString(
                    'mn-MN',
                    {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  );

                  return (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-colors"
                      style={{
                        backgroundColor: meta.bgLight,
                        borderColor: meta.borderColor,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{meta.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs font-bold"
                              style={{ color: meta.textColor }}
                            >
                              {meta.label}
                            </span>
                            <span className="text-[11px] text-[#736B63]">
                              Хүч: {entry.intensity}/5
                            </span>
                            <span className="text-[11px] text-[#998E84]">
                              · {dateStr}
                            </span>
                          </div>

                          {entry.note && (
                            <p className="text-xs text-[#404D59] mt-1 italic">
                              &ldquo;{entry.note}&rdquo;
                            </p>
                          )}

                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {entry.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/70 text-[#59524A] border border-black/5"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onTalkAboutMood(entry.mood)}
                          className="p-1 text-[#736B63] hover:text-[#E07A5F] rounded cursor-pointer"
                          title="Энэ мэдрэмжийн талаар Үйсэтэй ярилцах"
                        >
                          <MessageCircleHeart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-[#998E84] hover:text-rose-600 rounded cursor-pointer"
                          title="Тэмдэглэл устгах"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
