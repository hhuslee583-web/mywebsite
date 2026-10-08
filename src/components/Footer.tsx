import React from 'react';
import { NavTab } from '../types';
import { HeartHandshake, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenCrisis: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenCrisis }) => {
  return (
    <footer className="bg-[#F4EFEA] border-t border-[#EAE3DA] pt-12 pb-10 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#EAE3DA]">
          {/* Brand & mission */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#F28D77]/20 flex items-center justify-center text-[#E07A5F]">
                <HeartHandshake className="w-4 h-4" />
              </span>
              <span className="font-display text-xl font-bold text-[#2C2825]">
                Hugme
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed max-w-sm">
              Сэтгэл санааны аюулгүй, дулаан орон зай ба цахим сэтгэл зүйн хамтрагч. Хэн
              нэгэн таныг шүүмжлэлгүйгээр сонсох хэрэгтэй үед Үйсэ үргэлж энд байна.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#6B8E7D] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Таны төхөөрөмж дээр 100% нууцлалтай хадгалагдана</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#59524A]">
              Булангууд
            </h4>
            <ul className="space-y-1.5 text-xs text-[#736B63]">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-[#2C2825] transition-colors cursor-pointer"
                >
                  Нүүр хуудас
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('chat')}
                  className="hover:text-[#2C2825] transition-colors cursor-pointer"
                >
                  Үйсэтэй ярилцах
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mood')}
                  className="hover:text-[#2C2825] transition-colors cursor-pointer"
                >
                  Сэтгэл санааны хэмжүүр
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('journal')}
                  className="hover:text-[#2C2825] transition-colors cursor-pointer"
                >
                  Хувийн тэмдэглэл
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('selfcare')}
                  className="hover:text-[#2C2825] transition-colors cursor-pointer"
                >
                  Өөртөө анхаарах дасгалууд
                </button>
              </li>
            </ul>
          </div>

          {/* Safe Space & Crisis Helpline */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#59524A]">
              Халамж ба тусламж
            </h4>
            <p className="text-xs text-[#736B63] leading-relaxed">
              Hugme нь сэтгэл зүйн туслах булан бөгөөд эмнэлгийн эмчилгээ биш юм. Хэрэв
              танд яаралтай тусламж хэрэгтэй бол шуурхай тусламжийн шугамууд бэлэн
              байна.
            </p>

            <button
              onClick={onOpenCrisis}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C77D5E] hover:underline cursor-pointer pt-1"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>24/7 Шуурхай тусламжийн утаснууд (1800-2000, 108)</span>
            </button>
          </div>
        </div>

        {/* Quiet bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#998E84] gap-3">
          <p>Hugme · Халуун дулаан сэтгэлээр бүтээв. Таны мэдрэмж бүхэн үнэ цэнтэй.</p>
          <p className="flex items-center gap-1">
            <span>Өнөөдөр зөөлөн амьсгал авахаа бүү мартаарай</span>
            <Sparkles className="w-3 h-3 text-[#E07A5F]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
