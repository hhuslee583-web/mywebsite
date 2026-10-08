import React from 'react';
import { X, HeartHandshake, Phone, MessageSquare, Globe } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EFE9E1] shadow-2xl space-y-6 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2 text-[#E07A5F]">
            <HeartHandshake className="w-5 h-5" />
            <h2 className="text-lg font-bold font-display text-[#2C2825]">
              Та ганцаараа биш шүү. Шуурхай тусламж бэлэн байна.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#998E84] hover:text-[#2C2825] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#59524A] leading-relaxed">
          Hugme болон Үйсэ нь сэтгэл зүйн туслах, найрсаг хамтрагч боловч хэрэв танд гүн
          хямрал, хүчтэй түгшүүр, эсвэл өөрийгөө гэмтээх бодол төрж байвал дараах 24/7
          үнэ төлбөргүй, нууцыг чандлан хадгалах мэргэжлийн шуурхай тусламжийн утсанд
          хандаарай.
        </p>

        <div className="space-y-3">
          {/* СЭМҮТ 1800-2000 */}
          <div className="p-4 rounded-2xl bg-[#FDF3F0] border border-[#F8DFB4] flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#2C2825]">
                СЭМҮТ — 1800-2000 (24/7 Сэтгэл зүйн зөвлөгөө)
              </h3>
              <p className="text-xs text-[#736B63] mt-0.5">
                Сэтгэцийн Эрүүл Мэндийн Үндэсний Төвийн 24 цагийн үнэ төлбөргүй шуурхай
                утас. Сэтгэл зүйчтэй шууд холбогдоно.
              </p>
            </div>
          </div>

          {/* 108 Хүүхэд, гэр бүлийн тусламж */}
          <div className="p-4 rounded-2xl bg-[#F2F7F4] border border-[#C7DCD1] flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-[#6B8E7D] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#2C2825]">
                108 — Хүүхэд, өсвөр үе, гэр бүлийн тусламж
              </h3>
              <p className="text-xs text-[#736B63] mt-0.5">
                24/7 үнэ төлбөргүй сэтгэл зүйн дэмжлэг, зөвлөгөө үзүүлэх шуурхай утас.
              </p>
            </div>
          </div>

          {/* International */}
          <div className="p-4 rounded-2xl bg-[#F8F2F8] border border-[#E6CFE7] flex items-start gap-3">
            <Globe className="w-5 h-5 text-[#8E84A6] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#2C2825]">
                Олон улсын хямралын шугамууд (International Lifelines)
              </h3>
              <p className="text-xs text-[#736B63] mt-0.5">
                Дэлхийн аль ч улсаас{' '}
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#8E84A6] underline"
                >
                  findahelpline.com
                </a>{' '}
                эсвэл АНУ/Канадад 988 дугаарт хандах боломжтой.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE1] text-xs font-semibold text-[#59524A] cursor-pointer"
          >
            Хаах ба Hugme руу буцах
          </button>
        </div>
      </div>
    </div>
  );
};
