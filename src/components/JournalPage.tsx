import React, { useState } from 'react';
import { JournalEntry, MoodType } from '../types';
import { MOODS, INITIAL_JOURNAL_ENTRIES } from '../utils/constants';
import {
  BookOpen,
  Plus,
  Pin,
  Search,
  Calendar,
  Sparkles,
  Trash2,
  Edit3,
  X,
  Check,
  Heart,
  Quote,
} from 'lucide-react';

interface JournalPageProps {
  draftContent?: string | null;
  draftMood?: MoodType | null;
  onClearDraft?: () => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  draftContent,
  draftMood,
  onClearDraft,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('hugme_journal_entries_mn');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_JOURNAL_ENTRIES;
  });

  const [isCreating, setIsCreating] = useState<boolean>(!!draftContent);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(draftContent || '');
  const [mood, setMood] = useState<MoodType>(draftMood || 'Calm');
  const [gratitude, setGratitude] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMood, setFilterMood] = useState<string>('all');

  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem('hugme_journal_entries_mn', JSON.stringify(updated));
  };

  const handleOpenCreate = () => {
    setTitle('');
    setContent('');
    setMood('Calm');
    setGratitude('');
    setTags([]);
    setEditingEntryId(null);
    setIsCreating(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setGratitude(entry.gratitude || '');
    setTags(entry.tags || []);
    setEditingEntryId(entry.id);
    setIsCreating(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingEntryId) {
      const updated = entries.map((entry) => {
        if (entry.id === editingEntryId) {
          return {
            ...entry,
            title: title.trim() || 'Гарчиггүй эргэцүүлэл',
            content: content.trim(),
            mood,
            gratitude: gratitude.trim(),
            tags,
          };
        }
        return entry;
      });
      saveEntries(updated);
    } else {
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}`,
        title: title.trim() || 'Гарчиггүй эргэцүүлэл',
        content: content.trim(),
        mood,
        gratitude: gratitude.trim(),
        isPinned: false,
        tags,
        timestamp: Date.now(),
      };
      saveEntries([newEntry, ...entries]);
    }

    setIsCreating(false);
    setEditingEntryId(null);
    if (onClearDraft) onClearDraft();
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleTogglePin = (id: string) => {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, isPinned: !entry.isPinned } : entry
    );
    saveEntries(updated);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Filter entries
  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.tags &&
          entry.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          ));
      const matchesMood = filterMood === 'all' || entry.mood === filterMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF3F0] text-[#C77D5E] text-xs font-medium border border-[#F8DFB4] mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Хувийн аюулгүй тэмдэглэлийн дэвтэр</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#2C2825]">
            Хувийн цахим тэмдэглэл
          </h1>
          <p className="text-sm text-[#736B63] mt-1">
            Өөрийгөө цензургүйгээр чөлөөтэй бичээрэй. Бүх зүйл таны төхөөрөмж дээр
            нууцлагдсан хэвээр үлдэнэ.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-full bg-[#E07A5F] hover:bg-[#D46B4E] text-white text-sm font-semibold transition-all shadow-sm shadow-[#E07A5F]/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Шинэ тэмдэглэл бичих</span>
        </button>
      </div>

      {/* Editor Modal / Drawer */}
      {isCreating && (
        <div className="mb-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE9E1] shadow-md animate-in fade-in slide-in-from-top-4 duration-200 text-left">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F0EAE1]">
            <h2 className="text-xl font-bold font-display text-[#2C2825]">
              {editingEntryId ? 'Тэмдэглэл засах' : 'Өдрийн тэмдэглэл бичих'}
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingEntryId(null);
                if (onClearDraft) onClearDraft();
              }}
              className="p-1 text-[#998E84] hover:text-[#2C2825] rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            {/* Title & Mood */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#59524A] block mb-1">
                  Гарчиг:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Энэ мөчид гарчиг өгөх..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-[#2C2825] text-sm focus:outline-none focus:border-[#E07A5F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#59524A] block mb-1">
                  Сэтгэл санаа:
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as MoodType)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-[#2C2825] text-sm focus:outline-none focus:border-[#E07A5F]"
                >
                  {(Object.keys(MOODS) as MoodType[]).map((mKey) => (
                    <option key={mKey} value={mKey}>
                      {MOODS[mKey].emoji} {MOODS[mKey].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content body */}
            <div>
              <label className="text-xs font-semibold text-[#59524A] block mb-1">
                Таны бодол ба мэдрэмжүүд:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
                placeholder="Сэтгэлд тань юу хүнд, хөнгөн эсвэл ойлгомжгүй байна вэ? Бүгдийг энд уудлаарай..."
                className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-[#2C2825] text-sm sm:text-base leading-relaxed placeholder:text-[#998E84] focus:outline-none focus:border-[#E07A5F]"
              />
            </div>

            {/* Gratitude / gentle prompt */}
            <div>
              <label className="text-xs font-semibold text-[#59524A] block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Өнөөдөр анзаарсан эсвэл талархсан нэгэн жижиг дулаан зүйл:</span>
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Халуун аяга цай, шувуудын жиргээ, цэвэр ор дэр, найрсаг дулаан харц..."
                className="w-full px-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-[#2C2825] text-xs sm:text-sm focus:outline-none focus:border-[#E07A5F]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-[#59524A] block mb-1">
                Шошго (Бичээд Enter дарна уу):
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-[#F2F7F4] text-[#4D7060] border border-[#C7DCD1] px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Шошго нэмэх..."
                className="w-full px-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-[#2C2825] text-xs focus:outline-none focus:border-[#E07A5F]"
              />
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingEntryId(null);
                  if (onClearDraft) onClearDraft();
                }}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#736B63] hover:bg-[#F0EAE1] cursor-pointer"
              >
                Болих
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-6 py-2.5 rounded-full bg-[#E07A5F] hover:bg-[#D46B4E] text-white text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-50"
              >
                Тэмдэглэл хадгалах
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#EFE9E1] shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#998E84] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Тэмдэглэл болон шошго хайх..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EFE9E1] text-xs text-[#2C2825] focus:outline-none focus:border-[#E07A5F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#82786F] whitespace-nowrap">Шүүлтүүр:</span>
          <button
            onClick={() => setFilterMood('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filterMood === 'all'
                ? 'bg-[#2C2825] text-white'
                : 'bg-[#FAF7F2] text-[#736B63] hover:bg-[#F0EAE1]'
            }`}
          >
            Бүгд
          </button>
          {(Object.keys(MOODS) as MoodType[]).map((mKey) => (
            <button
              key={mKey}
              onClick={() => setFilterMood(mKey)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterMood === mKey
                  ? 'bg-[#E07A5F] text-white'
                  : 'bg-[#FAF7F2] text-[#736B63] hover:bg-[#F0EAE1]'
              }`}
            >
              {MOODS[mKey].emoji} {MOODS[mKey].label}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EFE9E1] max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-[#C77D5E] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#2C2825]">Тэмдэглэл олдсонгүй</h3>
          <p className="text-xs text-[#736B63] mt-1">
            {searchQuery || filterMood !== 'all'
              ? 'Шүүлтүүр эсвэл хайлтын үгээ цэвэрлэж үзнэ үү.'
              : 'Таны тэмдэглэлийн дэвтэр анхны бодлыг тань хүлээж байна. Дээрх "Шинэ тэмдэглэл бичих" товчийг дарна уу.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {filteredEntries.map((entry) => {
            const meta = MOODS[entry.mood];
            const dateStr = new Date(entry.timestamp).toLocaleDateString(
              'mn-MN',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            );

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-3xl p-6 border transition-all hover:shadow-md flex flex-col justify-between ${
                  entry.isPinned
                    ? 'border-[#E07A5F]/40 shadow-xs'
                    : 'border-[#EFE9E1]'
                }`}
              >
                <div>
                  {/* Top metadata */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: meta.bgLight,
                          color: meta.textColor,
                          borderColor: meta.borderColor,
                        }}
                      >
                        {meta.emoji} {meta.label}
                      </span>
                      <span className="text-[#82786F] flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePin(entry.id)}
                        className={`p-1 rounded cursor-pointer ${
                          entry.isPinned
                            ? 'text-[#E07A5F]'
                            : 'text-[#C5BCB2] hover:text-[#736B63]'
                        }`}
                        title={entry.isPinned ? 'Бэхэлгээг арилгах' : 'Эхэнд бэхлэх'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-1 text-[#C5BCB2] hover:text-[#736B63] rounded cursor-pointer"
                        title="Засах"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 text-[#C5BCB2] hover:text-rose-500 rounded cursor-pointer"
                        title="Устгах"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Content */}
                  <h3 className="text-lg font-bold font-display text-[#2C2825] mb-2">
                    {entry.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#59524A] leading-relaxed whitespace-pre-line line-clamp-6">
                    {entry.content}
                  </p>

                  {/* Gratitude highlight if present */}
                  {entry.gratitude && (
                    <div className="mt-4 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-xs text-[#59524A] flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#E07A5F] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#2C2825]">
                          Жижиг гялбаа:{' '}
                        </span>
                        <span>{entry.gratitude}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags footer */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-[#F0EAE1]">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#736B63]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
