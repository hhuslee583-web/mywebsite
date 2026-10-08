import React, { useState, useEffect } from 'react';
import { COMFORT_AFFIRMATIONS } from '../utils/constants';
import { soundEngine } from '../utils/soundEngine';
import {
  Wind,
  Sparkles,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Coffee,
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
} from 'lucide-react';

export const SelfCarePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'breathing' | 'grounding' | 'meditation' | 'affirmations' | 'activities'
  >('breathing');

  // ================= BREATHING STATE =================
  const [breathPattern, setBreathPattern] = useState<'4-7-8' | 'box' | 'calm'>(
    'calm'
  );
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(0);
  const [breathTimerSec, setBreathTimerSec] = useState<number>(4);
  const [breathSoundEnabled, setBreathSoundEnabled] = useState<boolean>(true);

  // Breathing pacer loop
  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('Inhale');
      setBreathTimerSec(breathPattern === 'calm' ? 4 : 4);
      return;
    }

    let timer: NodeJS.Timeout;

    const patterns = {
      calm: [
        { phase: 'Inhale' as const, duration: 4 },
        { phase: 'Exhale' as const, duration: 6 },
      ],
      box: [
        { phase: 'Inhale' as const, duration: 4 },
        { phase: 'Hold' as const, duration: 4 },
        { phase: 'Exhale' as const, duration: 4 },
        { phase: 'Rest' as const, duration: 4 },
      ],
      '4-7-8': [
        { phase: 'Inhale' as const, duration: 4 },
        { phase: 'Hold' as const, duration: 7 },
        { phase: 'Exhale' as const, duration: 8 },
      ],
    };

    const currentSequence = patterns[breathPattern];
    let currentIndex = currentSequence.findIndex((s) => s.phase === breathPhase);
    if (currentIndex === -1) currentIndex = 0;

    let timeLeft = breathTimerSec;

    timer = setInterval(() => {
      timeLeft -= 1;
      setBreathTimerSec(timeLeft);

      if (timeLeft <= 0) {
        const nextIndex = (currentIndex + 1) % currentSequence.length;
        const nextStep = currentSequence[nextIndex];
        setBreathPhase(nextStep.phase);
        setBreathTimerSec(nextStep.duration);
        currentIndex = nextIndex;

        if (nextIndex === 0) {
          setBreathCount((prev) => prev + 1);
        }

        if (breathSoundEnabled) {
          const freq =
            nextStep.phase === 'Inhale' ? 432 : nextStep.phase === 'Exhale' ? 384 : 480;
          soundEngine.playChime(freq, 2.0);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathTimerSec, breathPattern, breathSoundEnabled]);

  const handleToggleBreathing = () => {
    if (!isBreathingActive && breathSoundEnabled) {
      soundEngine.playChime(432, 2.5);
    }
    setIsBreathingActive(!isBreathingActive);
  };

  const handleResetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setBreathTimerSec(4);
    setBreathCount(0);
  };

  const phaseNamesMN: Record<string, string> = {
    Inhale: 'Амьсгал авах',
    Hold: 'Түгжих',
    Exhale: 'Амьсгал гаргах',
    Rest: 'Тайвшрах',
  };

  const phaseDescriptionsMN: Record<string, string> = {
    Inhale: 'Зөөлөн амьсгал аваарай',
    Hold: 'Аядуухан бариарай',
    Exhale: 'Бүх хурцадмал байдлыг гаргаарай',
    Rest: 'Амран тайвшир',
  };

  // ================= GROUNDING 5-4-3-2-1 STATE =================
  const [groundingStep, setGroundingStep] = useState<number>(0);
  const GROUNDING_STEPS_MN = [
    {
      num: 5,
      sense: 'ХАРАХ',
      title: 'ХАРЖ чадах 5 зүйл',
      instruction:
        'Эргэн тойрноо тайван ажиглаарай. Модны ширхэг, нарнаас тусах гэрэл, таалагдсан өнгө, сүүдэр эсвэл ном гэх мэт жижиг зүйлсийг хараарай.',
      items: [
        'Ойр байгаа ямар нэгэн дүрс, эд зүйл',
        'Сэтгэлд таатай өнгө',
        'Өрөөний ямар нэгэн хээ угалз, гадаргуу',
        'Гэрэл сүүдрийн тусгал',
        'Өмнө нь анзаарч байгаагүй жижиг нарийн ширийн зүйл',
      ],
    },
    {
      num: 4,
      sense: 'ХҮРЭХ',
      title: 'ХҮРЧ мэдрэх 4 зүйл',
      instruction:
        'Бие махбодынхоо мэдрэмжид анхаарлаа хандуулаарай. Одоо таны бие ямар гадаргууд тулгуурлаж байгааг анзаараарай.',
      items: [
        'Таны хөл эсвэл сууж буй сандлын тулгуур',
        'Хувцасны зөөлөн даавуу',
        'Арьсанд мэдрэгдэх агаарын температур',
        'Хоёр гараа нийлүүлж эсвэл өвдөг дээрээ тавьсан зөөлөн мэдрэмж',
      ],
    },
    {
      num: 3,
      sense: 'СОНСОХ',
      title: 'СОНСОЖ чадах 3 зүйл',
      instruction:
        'Нүдээ 3 секунд аниад гадаад болон дотоод чимээг сонсоорой.',
      items: [
        'Алсад сонсогдох чимээ (салхи, замын чимээ, хол сонсогдох дуу чимээ)',
        'Өрөөнд байгаа чимээ (цагны чаг чаг, сэнс, агааржуулагч)',
        'Өөрийн чинь зөөлөн, жигд амьсгалын чимээ',
      ],
    },
    {
      num: 2,
      sense: 'ҮНЭРТЭХ',
      title: 'ҮНЭРТЭЖ чадах 2 зүйл',
      instruction:
        'Хамраараа зөөлөн амьсгал аваад агаар дахь үнэрийг мэдрээрэй.',
      items: [
        'Өрөөний агаар, цай эсвэл ургамлын үнэр',
        'Хувцас, үнэртэй ус эсвэл цэвэр агаарын үнэр',
      ],
    },
    {
      num: 1,
      sense: 'АМТАЛЖ МЭДРЭХ',
      title: 'АМТАЛЖ эсвэл мэдэрч чадах 1 зүйл',
      instruction:
        'Амандаа байгаа амтыг анзаарах, ус балгах эсвэл яг энэ мөчийн аюулгүй тайван байдлыг дотроо мэдрээрэй.',
      items: ['Сэрүүн эсвэл бүлээн ус балгах, амар амгалан байгаагаа мэдрэх'],
    },
  ];

  // ================= MEDITATION STATE =================
  const [meditationDuration, setMeditationDuration] = useState<number>(60);
  const [meditationRemaining, setMeditationRemaining] = useState<number>(60);
  const [isMeditationActive, setIsMeditationActive] = useState<boolean>(false);
  const [meditationPromptIndex, setMeditationPromptIndex] = useState<number>(0);

  const MEDITATION_PROMPTS_MN = [
    'Нүдээ зөөлөн аниарай. Яг одоо ямар нэгэн зүйлийг хийх эсвэл засах гэж бүү яар.',
    'Нүд, эрүү, амны эргэн тойрон дахь булчингуудаа сулла.',
    'Мөрөө доошлуулж тайвшруул. Амьсгал гаргахдаа хэвлийгээ зөөлөн сулла.',
    'Бодлууд усны урсгал дахь навчис мэт урсан өнгөрөг. Тэднийг зүгээр л тавьж явуул.',
    'Энэ нам гүм хоромд та аюулгүй байна. Танаас юу ч нэхэхгүй.',
    'Цээж тань жигд дээшлэн доошлох зөөлөн хэмнэлийг мэдэр.',
    'Та амьд, та энд байна, та амар амгаланг хүртэх бүрэн эрхтэй.',
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMeditationActive && meditationRemaining > 0) {
      timer = setInterval(() => {
        setMeditationRemaining((prev) => {
          if (prev <= 1) {
            setIsMeditationActive(false);
            soundEngine.playChime(432, 4.0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMeditationActive, meditationRemaining]);

  useEffect(() => {
    if (!isMeditationActive) return;
    const interval = setInterval(() => {
      setMeditationPromptIndex((prev) => (prev + 1) % MEDITATION_PROMPTS_MN.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [isMeditationActive]);

  const handleStartMeditation = (durationSec: number) => {
    setMeditationDuration(durationSec);
    setMeditationRemaining(durationSec);
    setIsMeditationActive(true);
    soundEngine.playChime(432, 3.5);
  };

  const handleStopMeditation = () => {
    setIsMeditationActive(false);
  };

  // ================= AFFIRMATION DRAWER =================
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState<number>(0);

  // ================= COZY CHECKLIST =================
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Цэвэр ус эсвэл халуун цай аажуухан уух', done: false },
    { id: '2', text: 'Эрүүгээ суллаж, мөрөө чихнээсээ холдуулах', done: true },
    { id: '3', text: 'Дэлгэц харахгүйгээр 2 минут цонхоор харах', done: false },
    { id: '4', text: 'Хүзүүгээ зөөлөн сунгаж, бугуйгаа эргүүлэх', done: false },
    { id: '5', text: 'Утсаа 15 минут дуугүй горимд шилжүүлэх', done: false },
  ]);

  const handleToggleChecklist = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title */}
      <div className="text-left mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F2F8] text-[#8E84A6] text-xs font-medium border border-[#E6CFE7] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Мэдрэлийн системийг тайвшруулах булан</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#2C2825]">
          Өөртөө анхаарал тавих ба тайвшрах дасгалууд
        </h1>
        <p className="text-sm text-[#736B63] mt-1">
          Түгшүүрийг намжаах, хэт их бодлыг тайвшруулах, дотоод амар амгаланг
          сэргээх энгийн дасгалууд.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#EFE9E1] rounded-2xl shadow-xs overflow-x-auto mb-8">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'breathing'
              ? 'bg-[#E07A5F] text-white shadow-xs'
              : 'text-[#736B63] hover:text-[#2C2825] hover:bg-[#FAF7F2]'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Амьсгалын дасгал</span>
        </button>

        <button
          onClick={() => setActiveTab('grounding')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'grounding'
              ? 'bg-[#6B8E7D] text-white shadow-xs'
              : 'text-[#736B63] hover:text-[#2C2825] hover:bg-[#FAF7F2]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>5-4-3-2-1 Газардах техник</span>
        </button>

        <button
          onClick={() => setActiveTab('meditation')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'meditation'
              ? 'bg-[#8E84A6] text-white shadow-xs'
              : 'text-[#736B63] hover:text-[#2C2825] hover:bg-[#FAF7F2]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Тайван бясалгал</span>
        </button>

        <button
          onClick={() => setActiveTab('affirmations')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'affirmations'
              ? 'bg-[#C77D5E] text-white shadow-xs'
              : 'text-[#736B63] hover:text-[#2C2825] hover:bg-[#FAF7F2]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Сэтгэл дэмжих үгс</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'activities'
              ? 'bg-[#E5A93C] text-white shadow-xs'
              : 'text-[#736B63] hover:text-[#2C2825] hover:bg-[#FAF7F2]'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Тав тухтай бяцхан дадлууд</span>
        </button>
      </div>

      {/* ================= TAB 1: BREATHING ================= */}
      {activeTab === 'breathing' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE9E1] shadow-sm">
          {/* Pattern selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#82786F]">Дасгалын төрөл:</span>
              <button
                onClick={() => {
                  setBreathPattern('calm');
                  setIsBreathingActive(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  breathPattern === 'calm'
                    ? 'bg-[#F2F7F4] text-[#335243] border border-[#C7DCD1]'
                    : 'bg-[#FAF7F2] text-[#736B63]'
                }`}
              >
                Зөөлөн амгалан (4с авах / 6с гаргах)
              </button>
              <button
                onClick={() => {
                  setBreathPattern('box');
                  setIsBreathingActive(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  breathPattern === 'box'
                    ? 'bg-[#FDF3F0] text-[#7D2921] border border-[#F8DFB4]'
                    : 'bg-[#FAF7F2] text-[#736B63]'
                }`}
              >
                Дөрвөлжин амьсгал (4-4-4-4)
              </button>
              <button
                onClick={() => {
                  setBreathPattern('4-7-8');
                  setIsBreathingActive(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  breathPattern === '4-7-8'
                    ? 'bg-[#F8F2F8] text-[#5E3860] border border-[#E6CFE7]'
                    : 'bg-[#FAF7F2] text-[#736B63]'
                }`}
              >
                4-7-8 Гүн амралт
              </button>
            </div>

            <button
              onClick={() => setBreathSoundEnabled(!breathSoundEnabled)}
              className="flex items-center gap-1.5 text-xs text-[#736B63] hover:text-[#2C2825] cursor-pointer"
            >
              {breathSoundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#6B8E7D]" />
                  <span>Хонхтой</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#998E84]" />
                  <span>Дуугүй</span>
                </>
              )}
            </button>
          </div>

          {/* Visual Breathing Orb */}
          <div className="py-10 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#FDF3F0] via-[#FAF7F2] to-[#F2F7F4] border border-[#EFE9E1] transition-all duration-1000 ease-in-out ${
                  breathPhase === 'Inhale'
                    ? 'scale-110 opacity-100 shadow-xl shadow-[#E07A5F]/15'
                    : breathPhase === 'Hold'
                    ? 'scale-105 opacity-90'
                    : 'scale-90 opacity-60'
                }`}
              />

              <div
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out border-2 shadow-inner ${
                  breathPhase === 'Inhale'
                    ? 'bg-[#F28D77]/20 border-[#E07A5F] scale-105'
                    : breathPhase === 'Hold'
                    ? 'bg-[#8E84A6]/20 border-[#8E84A6] scale-100'
                    : 'bg-[#6B8E7D]/20 border-[#6B8E7D] scale-90'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold font-display text-[#2C2825]">
                  {phaseNamesMN[breathPhase] || breathPhase}
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-[#2C2825] mt-1">
                  {breathTimerSec}с
                </span>
                <span className="text-[11px] text-[#736B63] mt-1">
                  {phaseDescriptionsMN[breathPhase] || ''}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#82786F] mt-6">
              Гүйцэтгэсэн амьсгал: <strong className="text-[#2C2825]">{breathCount}</strong>
            </p>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleToggleBreathing}
                className="px-6 py-3 rounded-full bg-[#E07A5F] hover:bg-[#D46B4E] text-white text-sm font-semibold transition-all shadow-md shadow-[#E07A5F]/20 flex items-center gap-2 cursor-pointer"
              >
                {isBreathingActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Түр зогсоох</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Амьсгалж эхлэх</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetBreathing}
                className="p-3 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE1] text-[#736B63] transition-colors cursor-pointer"
                title="Тоолуурыг дахин эхлүүлэх"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: 5-4-3-2-1 GROUNDING ================= */}
      {activeTab === 'grounding' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE9E1] shadow-sm text-left">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Step navigation dots */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                {GROUNDING_STEPS_MN.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGroundingStep(idx)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      groundingStep === idx
                        ? 'bg-[#6B8E7D] text-white shadow-xs'
                        : idx < groundingStep
                        ? 'bg-[#C7DCD1] text-[#335243]'
                        : 'bg-[#FAF7F2] text-[#998E84]'
                    }`}
                  >
                    {step.num}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#82786F]">
                Алхам {groundingStep + 1} / 5
              </span>
            </div>

            {/* Current Step Card */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F7F4] text-[#335243] text-xs font-semibold border border-[#C7DCD1]">
                <span>Мэдрэхүй: {GROUNDING_STEPS_MN[groundingStep].sense}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2C2825]">
                {GROUNDING_STEPS_MN[groundingStep].title}
              </h2>

              <p className="text-sm text-[#59524A] leading-relaxed">
                {GROUNDING_STEPS_MN[groundingStep].instruction}
              </p>

              {/* Items checklist */}
              <div className="space-y-2 pt-2">
                {GROUNDING_STEPS_MN[groundingStep].items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] flex items-center gap-3 text-xs sm:text-sm text-[#2C2825]"
                  >
                    <span className="w-5 h-5 rounded-full bg-white border border-[#E0D7CC] flex items-center justify-center text-[10px] font-bold text-[#6B8E7D]">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next / Previous */}
            <div className="flex items-center justify-between pt-6 border-t border-[#F0EAE1]">
              <button
                disabled={groundingStep === 0}
                onClick={() => setGroundingStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#736B63] hover:bg-[#FAF7F2] disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Өмнөх мэдрэхүй</span>
              </button>

              {groundingStep < GROUNDING_STEPS_MN.length - 1 ? (
                <button
                  onClick={() => setGroundingStep((prev) => prev + 1)}
                  className="px-6 py-2.5 rounded-full bg-[#6B8E7D] hover:bg-[#587869] text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Дараагийн мэдрэхүй</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setGroundingStep(0)}
                  className="px-6 py-2.5 rounded-full bg-[#E07A5F] hover:bg-[#D46B4E] text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Дууслаа · Дахин эхлэх</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: MINDFUL PAUSE MEDITATION ================= */}
      {activeTab === 'meditation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE9E1] shadow-sm text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2C2825]">
              Амар амгаланг мэдрэх нам гүм хором
            </h2>
            <p className="text-sm text-[#736B63]">
              Хэдэн минут амрахаа сонгоорой. Бид бясалгалын хонх дуугаргаж, таны оюун
              бодлыг зөөлөн чиглүүлнэ.
            </p>

            {/* Duration pickers */}
            {!isMeditationActive && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleStartMeditation(60)}
                  className="px-5 py-3 rounded-2xl bg-[#F8F2F8] hover:bg-[#F0E6F0] border border-[#E6CFE7] text-xs font-bold text-[#5E3860] cursor-pointer"
                >
                  1 минутын завсарлага
                </button>
                <button
                  onClick={() => handleStartMeditation(180)}
                  className="px-5 py-3 rounded-2xl bg-[#F2F7F4] hover:bg-[#E5EFE9] border border-[#C7DCD1] text-xs font-bold text-[#335243] cursor-pointer"
                >
                  3 минутын анир
                </button>
                <button
                  onClick={() => handleStartMeditation(300)}
                  className="px-5 py-3 rounded-2xl bg-[#FDF3F0] hover:bg-[#FCEBE6] border border-[#F8DFB4] text-xs font-bold text-[#7D2921] cursor-pointer"
                >
                  5 минутын амар амгалан
                </button>
              </div>
            )}

            {/* Active Meditation Display */}
            {isMeditationActive && (
              <div className="py-6 space-y-6 animate-in fade-in duration-300">
                <div className="w-48 h-48 mx-auto rounded-full bg-[#F8F2F8] border-2 border-[#8E84A6] flex flex-col items-center justify-center shadow-lg shadow-[#8E84A6]/10">
                  <span className="text-4xl font-extrabold font-mono tabular-nums text-[#2C2825]">
                    {Math.floor(meditationRemaining / 60)}:
                    {(meditationRemaining % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#8E84A6] mt-1">Үлдсэн хугацаа</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE9E1] text-sm text-[#59524A] italic max-w-md mx-auto">
                  &ldquo;{MEDITATION_PROMPTS_MN[meditationPromptIndex]}&rdquo;
                </div>

                <button
                  onClick={handleStopMeditation}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#736B63] hover:bg-[#F0EAE1] cursor-pointer"
                >
                  Эрт дуусгах
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: COMFORT AFFIRMATIONS ================= */}
      {activeTab === 'affirmations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE9E1] shadow-sm text-left">
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C77D5E]">
              Зөөлөн харах өнцөг
            </span>

            {/* Big quote card */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EFE9E1] shadow-xs space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EFE9E1] text-[#82786F]">
                {COMFORT_AFFIRMATIONS[currentAffirmationIndex].category}
              </span>

              <p className="text-2xl sm:text-3xl font-display font-medium text-[#2C2825] leading-relaxed">
                &ldquo;{COMFORT_AFFIRMATIONS[currentAffirmationIndex].text}&rdquo;
              </p>

              <p className="text-xs text-[#82786F] italic">— Үйсэ</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() =>
                  setCurrentAffirmationIndex(
                    (prev) =>
                      (prev - 1 + COMFORT_AFFIRMATIONS.length) %
                      COMFORT_AFFIRMATIONS.length
                  )
                }
                className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE1] text-xs font-semibold text-[#736B63] cursor-pointer"
              >
                ← Өмнөх
              </button>

              <button
                onClick={() =>
                  setCurrentAffirmationIndex(
                    (prev) => (prev + 1) % COMFORT_AFFIRMATIONS.length
                  )
                }
                className="px-6 py-2.5 rounded-full bg-[#E07A5F] hover:bg-[#D46B4E] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Өөр үг сонгох ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: COZY MICRO-RITUALS ================= */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE9E1] shadow-sm text-left">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-[#2C2825]">
                Бие махбоддоо зориулах жижиг энхрийллүүд
              </h2>
              <p className="text-sm text-[#736B63] mt-1">
                Хорвоо ертөнц хэтэрхий чанга чимээтэй мэт санагдах үед эдгээр энгийн
                үйлдэл таныг аюулгүй орчинд байгааг сануулдаг.
              </p>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    item.done
                      ? 'bg-[#F2F7F4] border-[#C7DCD1] text-[#335243]'
                      : 'bg-[#FAF7F2] border-[#EFE9E1] text-[#2C2825] hover:bg-[#F4EFEA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                        item.done
                          ? 'bg-[#6B8E7D] border-[#6B8E7D] text-white'
                          : 'border-[#C5BCB2] bg-white'
                      }`}
                    >
                      {item.done && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-sm ${
                        item.done ? 'line-through text-[#6B8E7D]' : 'font-medium'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#82786F]">
                    {item.done ? 'Биелүүлсэн' : 'Дарж тэмдэглэх'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
