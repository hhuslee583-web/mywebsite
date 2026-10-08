import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [cycle, setCycle] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(true);
      setPhase('Inhale');
      setSecondsLeft(4);
      setCycle(0);
      return;
    }

    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            soundEngine.playChime(480, 1.8);
            setPhase('Hold');
            return 4;
          } else if (phase === 'Hold') {
            soundEngine.playChime(384, 2.0);
            setPhase('Exhale');
            return 6;
          } else {
            soundEngine.playChime(432, 2.0);
            setPhase('Inhale');
            setCycle((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, phase]);

  if (!isOpen) return null;

  const phaseNamesMN: Record<string, string> = {
    Inhale: 'Амьсгал авах',
    Hold: 'Түгжих',
    Exhale: 'Амьсгал гаргах',
  };

  const phaseDescMN: Record<string, string> = {
    Inhale: 'Зөөлөн авах',
    Hold: 'Аядуухан барих',
    Exhale: 'Аажуухан гаргах',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-[#EFE9E1] shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#998E84] hover:text-[#2C2825] rounded cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F7F4] text-[#335243] text-xs font-semibold border border-[#C7DCD1]">
          <Wind className="w-3.5 h-3.5" />
          <span>1 минутын түргэн амьсгал</span>
        </div>

        {/* Breathing Circle */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-1000 ease-in-out shadow-lg ${
              phase === 'Inhale'
                ? 'bg-[#F28D77]/25 border-[#E07A5F] scale-110 shadow-[#E07A5F]/20'
                : phase === 'Hold'
                ? 'bg-[#8E84A6]/20 border-[#8E84A6] scale-100'
                : 'bg-[#6B8E7D]/20 border-[#6B8E7D] scale-90'
            }`}
          >
            <span className="text-xl font-bold font-display text-[#2C2825]">
              {phaseNamesMN[phase]}
            </span>
            <span className="text-3xl font-extrabold font-mono tabular-nums text-[#2C2825] mt-1">
              {secondsLeft}с
            </span>
            <span className="text-[10px] text-[#736B63] mt-0.5">
              {phaseDescMN[phase]}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#82786F]">
          Гүйцэтгэсэн амьсгал: <strong className="text-[#2C2825]">{cycle}</strong>
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-5 py-2 rounded-full bg-[#E07A5F] hover:bg-[#D46B4E] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Түр зогсоох' : 'Үргэлжлүүлэх'}</span>
          </button>

          <button
            onClick={() => {
              setPhase('Inhale');
              setSecondsLeft(4);
              setCycle(0);
            }}
            className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE1] text-[#736B63] cursor-pointer"
            title="Дахин эхлүүлэх"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
