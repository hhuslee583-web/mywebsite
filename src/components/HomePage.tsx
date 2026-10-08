import React from 'react';
import { NavTab, MoodType } from '../types';
import { MOODS, COMFORT_AFFIRMATIONS } from '../utils/constants';
import {
  MessageCircleHeart,
  Smile,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Wind,
  Coffee,
  Quote,
} from 'lucide-react';

interface HomePageProps {
  onSelectTab: (tab: NavTab) => void;
  onQuickChatWithMood?: (mood: MoodType) => void;
  onStartBreathing: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  onQuickChatWithMood,
  onStartBreathing,
}) => {
  const [randomQuoteIndex, setRandomQuoteIndex] = React.useState(0);

  const currentAffirmation = COMFORT_AFFIRMATIONS[randomQuoteIndex];

  const handleNextAffirmation = () => {
    setRandomQuoteIndex((prev) => (prev + 1) % COMFORT_AFFIRMATIONS.length);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20">
        {/* Soft atmospheric background glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-gradient-to-tr from-[#FCEBE6]/60 via-[#F7EFE5]/40 to-[#EBF3EF]/50 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Introduction & Welcoming Message from Cat Uise */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF3F0] border border-[#F8DFB4]/80 text-[#C77D5E] text-xs font-medium">
                <Heart className="w-3.5 h-3.5 fill-[#C77D5E]" />
                <span>Сэтгэл бодлоо хуваалцах аюулгүй, дулаан муурын булан 🐾</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-[#2C2825] leading-[1.15]">
                Хэн нэгэнтэй ярилцмаар санагдсан үед тань очих аюулгүй бяцхан орон зай.
              </h1>

              {/* Welcoming message from Cat Uise */}
              <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#EFE9E1] shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FAF7F2] shadow-sm flex-shrink-0 bg-[#FFF5EE]">
                    <img
                      src="/src/assets/images/uise_cat_avatar_1791454387844.jpg"
                      alt="Үйсэ муужгай"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-bold text-[#2C2825]">
                        Үйсэ муурнаас илгээх зурвас 🐱
                      </h2>
                    </div>
                    <p className="text-xs text-[#82786F]">
                      Таны хөөрхөн цахим сэтгэл зүйн туслах муужгай найз
                    </p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-[#59524A] leading-relaxed italic pt-1">
                  &ldquo;hiii найз минь! Намайг бяцхан муужгай Үйсэ гэдэг 🐾 Сэтгэл тань ямар нэгэн
                  зүйлд шаналж, &apos;ааш chincha&apos; гэж бухимдсан үед ч, эсвэл зүгээр л дулаахан
                  буланд савар дээр минь тухлан суумаар байвал би яг энд байна. Та заавал
                  үргэлж хүчтэй байх албагүй шүү дээ, okeyyy. Яасан бэ, юу болсон бэ? Сэтгэлд тань юу болоод
                  байгааг надад чөлөөтэй хуваалцаарай 🐾&rdquo;
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectTab('chat')}
                  className="px-6 py-3.5 rounded-full text-base font-semibold text-white bg-[#E07A5F] hover:bg-[#D46B4E] transition-all shadow-md shadow-[#E07A5F]/25 flex items-center gap-2 cursor-pointer group"
                >
                  <MessageCircleHeart className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Үйсэтэй ярилцах 🐾</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onStartBreathing}
                  className="px-5 py-3.5 rounded-full text-sm font-medium text-[#4D7060] bg-[#F2F7F4] hover:bg-[#E5EFE9] border border-[#C7DCD1] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Wind className="w-4 h-4 text-[#6B8E7D]" />
                  <span>1 минутын амьсгал</span>
                </button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#82786F] pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#6B8E7D]" />
                  Таны төхөөрөмж дээр 100% нууцлалтай
                </span>
                <span>·</span>
                <span>Шүүмжлэлгүй</span>
                <span>·</span>
                <span>Хэрэгтэй үед тань үргэлж бэлэн</span>
              </div>
            </div>

            {/* Right: Character Illustration & Cozy Scene */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-lg shadow-stone-200/60 border border-[#EFE9E1]">
                  <div className="relative aspect-[4/4.2] rounded-2xl overflow-hidden bg-[#FAF7F2]">
                    <img
                      src="/src/assets/images/uise_cat_cozy_1791454401654.jpg"
                      alt="Үйсэ муужгай дулаахан тав тухтай өрөөнд"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                    />

                    {/* Subtle status tag badge */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src="/src/assets/images/uise_cat_avatar_1791454387844.jpg"
                            alt="Үйсэ муур"
                            className="w-8 h-8 rounded-full object-cover border border-[#EAE2D7]"
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#2C2825]">
                            Үйсэ муур сонсоход бэлэн 🐾
                          </p>
                          <p className="text-[11px] text-[#82786F]">
                            Эгдүүтэй, халамжтай, дулаахан
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectTab('chat')}
                        className="text-xs font-semibold text-[#E07A5F] hover:underline cursor-pointer"
                      >
                        Яриа эхлүүлэх →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Mood Check-in Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE9E1] shadow-sm">
          <div className="max-w-2xl mb-5 text-left">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#2C2825]">
              Таны сэтгэл яг одоо ямар байна вэ?
            </h2>
            <p className="text-sm text-[#736B63] mt-1">
              Мэдрэмжээ дарж сонгоорой. Үйсэ муужгай таныг сонсож, сэтгэлийг тань тайвшруулахад бэлэн байна.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {(Object.keys(MOODS) as MoodType[]).map((moodKey) => {
              const meta = MOODS[moodKey];
              return (
                <button
                  key={moodKey}
                  onClick={() => {
                    if (onQuickChatWithMood) onQuickChatWithMood(moodKey);
                    else onSelectTab('chat');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-sm"
                  style={{
                    backgroundColor: meta.bgLight,
                    borderColor: meta.borderColor,
                  }}
                >
                  <span className="text-2xl mb-1 group-hover:scale-115 transition-transform">
                    {meta.emoji}
                  </span>
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
      </section>

      {/* What Hugme Does — Core Sanctuary Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#C77D5E] uppercase tracking-wider">
            Таны тайван амгалан булан
          </span>
          <h2 className="text-3xl font-display font-bold text-[#2C2825] mt-1">
            Сэтгэлээ халамжлах зөөлөн хэрэгслүүд
          </h2>
          <p className="text-sm text-[#736B63] mt-2">
            Hugme нь хүйтэн эмнэлгийн өрөө шиг биш, харин бяцхан Үйсэ мууртайгаа хамт
            сэтгэл доторх зангилаагаа өөрийн хэмнэлээр тайлах дулаахан орон зай юм.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Emotional Support Chat */}
          <div
            onClick={() => onSelectTab('chat')}
            className="group p-6 rounded-3xl bg-white border border-[#EFE9E1] hover:border-[#F28D77]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FDF3F0] text-[#E07A5F] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageCircleHeart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2825] mb-2">
                Үйсэ мууртай ярилцах
              </h3>
              <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
                Сэтгэлээ чөлөөтэй уудлах, юу болсныг ойлгох, эсвэл хайр татам мууртай өдрийн мэдрэмжээ хуваалцах.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#E07A5F] group-hover:translate-x-1 transition-transform">
              <span>Чат нээх 🐾</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Mood Tracking */}
          <div
            onClick={() => onSelectTab('mood')}
            className="group p-6 rounded-3xl bg-white border border-[#EFE9E1] hover:border-[#6B8E7D]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F2F7F4] text-[#6B8E7D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2825] mb-2">
                Сэтгэл санааны хэмжүүр
              </h3>
              <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
                Сэтгэл хөдлөлийнхөө цаг агаарыг ажиглах. Өөрийгөө буруутгалгүйгээр зөөлөн өөрчлөлтийг анзаарах.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#6B8E7D] group-hover:translate-x-1 transition-transform">
              <span>Түүх харах</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Private Journal */}
          <div
            onClick={() => onSelectTab('journal')}
            className="group p-6 rounded-3xl bg-white border border-[#EFE9E1] hover:border-[#C77D5E]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FDF5F1] text-[#C77D5E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2825] mb-2">
                Хувийн тэмдэглэл
              </h3>
              <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
                Шүүлтүүргүй бодол, хуримтлагдсан түгшүүр, жижигхэн талархлуудаа бичих хувийн нам гүм дэвтэр.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#C77D5E] group-hover:translate-x-1 transition-transform">
              <span>Тэмдэглэл бичих</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: Calming Sanctuary */}
          <div
            onClick={() => onSelectTab('selfcare')}
            className="group p-6 rounded-3xl bg-white border border-[#EFE9E1] hover:border-[#8E84A6]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F8F2F8] text-[#8E84A6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2825] mb-2">
                Өөртөө анхаарал тавих
              </h3>
              <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
                Амьсгалын дасгал, 5-4-3-2-1 мэдрэхүйн техник, байгалийн анир, сэтгэл дэмжих дулаан үгс.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#8E84A6] group-hover:translate-x-1 transition-transform">
              <span>Дасгалуудыг үзэх</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Daily Comfort Card & Scenic Illustration */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F4EFEA] rounded-3xl p-6 sm:p-10 border border-[#EAE3DA]">
          {/* Scenic peaceful picture */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-sm aspect-[4/3] bg-white">
              <img
                src="/src/assets/images/selfcare_peaceful_scenery_1791452753305.jpg"
                alt="Амар амгалан байгалийн үзэмж"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Comfort reminder interactive card */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-[#736B63]">
                <Quote className="w-4 h-4 text-[#C77D5E]" />
                <span>Үйсэ муурнаас илгээх зөвлөмж 🐾</span>
              </div>
              <button
                onClick={handleNextAffirmation}
                className="text-xs font-semibold text-[#E07A5F] hover:underline cursor-pointer"
              >
                Өөр үг сонгох ✨
              </button>
            </div>

            <blockquote className="text-xl sm:text-2xl font-display font-medium text-[#2C2825] leading-relaxed">
              &ldquo;{currentAffirmation.text}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between pt-2 border-t border-[#EAE3DA]">
              <span className="text-xs text-[#82786F]">
                Ангилал: <strong className="text-[#59524A]">{currentAffirmation.category}</strong>
              </span>
              <button
                onClick={() => onSelectTab('chat')}
                className="text-xs font-medium text-[#59524A] hover:text-[#2C2825] flex items-center gap-1 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5 text-[#C77D5E]" />
                <span>Үйсэтэй хамт тухлах 🐾</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
