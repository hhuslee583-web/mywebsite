import React, { useState } from 'react';
import { NavTab, AmbientSoundType } from '../types';
import { Volume2, VolumeX, Sparkles, HeartHandshake, CloudRain, Waves, Flame, Bell, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCrisis: () => void;
  onQuickBreath: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenCrisis,
  onQuickBreath,
}) => {
  const [currentSound, setCurrentSound] = useState<AmbientSoundType>('off');
  const [volume, setVolume] = useState<number>(0.35);
  const [showSoundMenu, setShowSoundMenu] = useState<boolean>(false);

  const handleToggleSound = (type: AmbientSoundType) => {
    if (currentSound === type) {
      soundEngine.stop();
      setCurrentSound('off');
    } else {
      if (type === 'rain') soundEngine.playRain();
      else if (type === 'ocean') soundEngine.playOcean();
      else if (type === 'fire') soundEngine.playFire();
      else if (type === 'bowl') soundEngine.playBowl();
      setCurrentSound(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  const soundLabels: Record<AmbientSoundType, string> = {
    rain: 'Бороо',
    ocean: 'Давалгаа',
    fire: 'Зуух',
    bowl: 'Хонх',
    off: 'Хаалттай',
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EFE9E1] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 group text-left cursor-pointer"
          aria-label="Hugme Нүүр хуудас"
        >
          <span className="w-8 h-8 rounded-full bg-[#F28D77]/15 flex items-center justify-center text-[#E07A5F] group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-4 h-4" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-[#2C2825] group-hover:text-[#E07A5F] transition-colors">
            Hugme
          </span>
        </button>

        {/* Zone 2: Nav links, 1-2 word labels, single-line in Mongolian */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg ${
              activeTab === 'home'
                ? 'text-[#2C2825] font-semibold bg-[#F0EAE1]/70'
                : 'text-[#686058] hover:text-[#2C2825] hover:bg-[#F0EAE1]/40'
            }`}
          >
            Нүүр
          </button>
          <button
            onClick={() => onSelectTab('chat')}
            className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'text-[#E07A5F] font-semibold bg-[#FDF3F0]'
                : 'text-[#686058] hover:text-[#2C2825] hover:bg-[#F0EAE1]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-pulse"></span>
            Үйсэтэй ярилцах
          </button>
          <button
            onClick={() => onSelectTab('mood')}
            className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg ${
              activeTab === 'mood'
                ? 'text-[#2C2825] font-semibold bg-[#F0EAE1]/70'
                : 'text-[#686058] hover:text-[#2C2825] hover:bg-[#F0EAE1]/40'
            }`}
          >
            Сэтгэл санааны хэмжүүр
          </button>
          <button
            onClick={() => onSelectTab('journal')}
            className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg ${
              activeTab === 'journal'
                ? 'text-[#2C2825] font-semibold bg-[#F0EAE1]/70'
                : 'text-[#686058] hover:text-[#2C2825] hover:bg-[#F0EAE1]/40'
            }`}
          >
            Өдрийн тэмдэглэл
          </button>
          <button
            onClick={() => onSelectTab('selfcare')}
            className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg ${
              activeTab === 'selfcare'
                ? 'text-[#2C2825] font-semibold bg-[#F0EAE1]/70'
                : 'text-[#686058] hover:text-[#2C2825] hover:bg-[#F0EAE1]/40'
            }`}
          >
            Өөртөө анхаарах
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambience Sound Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                currentSound !== 'off'
                  ? 'bg-[#6B8E7D]/15 text-[#4D7060]'
                  : 'text-[#736B63] hover:text-[#2C2825] hover:bg-[#F0EAE1]'
              }`}
              title="Тайвшруулах орчны дуу авиа"
              aria-label="Тайвшруулах орчны дуу авиа"
            >
              {currentSound !== 'off' ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span className="hidden sm:inline capitalize text-[11px] font-semibold">
                    {soundLabels[currentSound]}
                  </span>
                </>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Sound Dropdown Popover */}
            {showSoundMenu && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white border border-[#EFE9E1] rounded-2xl shadow-xl shadow-stone-200/50 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0EAE1]">
                  <span className="text-xs font-semibold text-[#2C2825]">
                    Орчны тайван анир
                  </span>
                  <button
                    onClick={() => setShowSoundMenu(false)}
                    className="text-[#998E84] hover:text-[#2C2825] p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  <button
                    onClick={() => handleToggleSound('rain')}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      currentSound === 'rain'
                        ? 'bg-[#EFF5F9] text-[#294862] border border-[#C2D6E6]'
                        : 'bg-[#FAF7F2] text-[#686058] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <CloudRain className="w-3.5 h-3.5 text-[#5C7E9C]" />
                    <span>Зөөлөн бороо</span>
                  </button>

                  <button
                    onClick={() => handleToggleSound('ocean')}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      currentSound === 'ocean'
                        ? 'bg-[#F2F7F4] text-[#335243] border border-[#C7DCD1]'
                        : 'bg-[#FAF7F2] text-[#686058] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <Waves className="w-3.5 h-3.5 text-[#6B8E7D]" />
                    <span>Давалгаа</span>
                  </button>

                  <button
                    onClick={() => handleToggleSound('fire')}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      currentSound === 'fire'
                        ? 'bg-[#FDF3F0] text-[#7D2921] border border-[#F8DFB4]'
                        : 'bg-[#FAF7F2] text-[#686058] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Зуухны гал</span>
                  </button>

                  <button
                    onClick={() => handleToggleSound('bowl')}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      currentSound === 'bowl'
                        ? 'bg-[#F8F2F8] text-[#5E3860] border border-[#E6CFE7]'
                        : 'bg-[#FAF7F2] text-[#686058] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5 text-[#8E84A6]" />
                    <span>Бясалгалын хонх</span>
                  </button>
                </div>

                {currentSound !== 'off' && (
                  <div className="pt-2 border-t border-[#F0EAE1] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#736B63]">
                      <span>Дууны чанга</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-[#6B8E7D] h-1.5 bg-[#EAE2D7] rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => handleToggleSound(currentSound)}
                      className="mt-1 text-center text-xs text-[#A85844] hover:underline cursor-pointer"
                    >
                      Дууг унтраах
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Breath Button */}
          <button
            onClick={onQuickBreath}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#4D7060] bg-[#6B8E7D]/12 hover:bg-[#6B8E7D]/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Амьсгалах</span>
          </button>

          {/* Primary CTA: Talk to Uise */}
          <button
            onClick={() => onSelectTab('chat')}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D46B4E] transition-colors shadow-sm shadow-[#E07A5F]/20 cursor-pointer whitespace-nowrap"
          >
            Үйсэтэй ярилцах
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden border-t border-[#EFE9E1] bg-[#FAF7F2] px-2 py-1 justify-around text-xs">
        <button
          onClick={() => onSelectTab('home')}
          className={`py-1.5 px-2 rounded font-medium cursor-pointer ${
            activeTab === 'home' ? 'text-[#E07A5F] font-bold' : 'text-[#736B63]'
          }`}
        >
          Нүүр
        </button>
        <button
          onClick={() => onSelectTab('chat')}
          className={`py-1.5 px-2 rounded font-medium cursor-pointer ${
            activeTab === 'chat' ? 'text-[#E07A5F] font-bold' : 'text-[#736B63]'
          }`}
        >
          Үйсэ
        </button>
        <button
          onClick={() => onSelectTab('mood')}
          className={`py-1.5 px-2 rounded font-medium cursor-pointer ${
            activeTab === 'mood' ? 'text-[#E07A5F] font-bold' : 'text-[#736B63]'
          }`}
        >
          Мэдрэмж
        </button>
        <button
          onClick={() => onSelectTab('journal')}
          className={`py-1.5 px-2 rounded font-medium cursor-pointer ${
            activeTab === 'journal' ? 'text-[#E07A5F] font-bold' : 'text-[#736B63]'
          }`}
        >
          Тэмдэглэл
        </button>
        <button
          onClick={() => onSelectTab('selfcare')}
          className={`py-1.5 px-2 rounded font-medium cursor-pointer ${
            activeTab === 'selfcare' ? 'text-[#E07A5F] font-bold' : 'text-[#736B63]'
          }`}
        >
          Дасгал
        </button>
      </div>
    </header>
  );
};
