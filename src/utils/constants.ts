import { MoodMeta, MoodType, MoodEntry, JournalEntry } from '../types';

export const MOODS: Record<MoodType, MoodMeta> = {
  Happy: {
    type: 'Happy',
    emoji: '☀️',
    label: 'Жаргалтай',
    description: 'Баяртай, талархалтай, хөнгөн сэтгэлтэй',
    color: '#E5A93C',
    bgLight: '#FEF8EB',
    textColor: '#8D6114',
    borderColor: '#F8DFB4',
  },
  Calm: {
    type: 'Calm',
    emoji: '🌿',
    label: 'Тайван',
    description: 'Амар амгалан, төвлөрсөн, тайвширсан',
    color: '#6B8E7D',
    bgLight: '#F2F7F4',
    textColor: '#335243',
    borderColor: '#C7DCD1',
  },
  Okay: {
    type: 'Okay',
    emoji: '☁️',
    label: 'Зүгээр л',
    description: 'Хэвийн, дундыг барьсан, аядуу',
    color: '#7D8C99',
    bgLight: '#F4F6F8',
    textColor: '#404D59',
    borderColor: '#D4DBE0',
  },
  Sad: {
    type: 'Sad',
    emoji: '🌧️',
    label: 'Гунигтай',
    description: 'Сэтгэл хүнд, гундуу, цөхөрсөн',
    color: '#5C7E9C',
    bgLight: '#EFF5F9',
    textColor: '#294862',
    borderColor: '#C2D6E6',
  },
  Anxious: {
    type: 'Anxious',
    emoji: '⚡',
    label: 'Түгшүүртэй',
    description: 'Тайван бус, санаа зовсон, бодолд автсан',
    color: '#9C6F9D',
    bgLight: '#F8F2F8',
    textColor: '#5E3860',
    borderColor: '#E6CFE7',
  },
  Angry: {
    type: 'Angry',
    emoji: '🔥',
    label: 'Ууртай',
    description: 'Бухимдсан, эгдүүцсэн, цухалдсан',
    color: '#D46358',
    bgLight: '#FDF1EF',
    textColor: '#7D2921',
    borderColor: '#F6C8C3',
  },
  Lonely: {
    type: 'Lonely',
    emoji: '🍂',
    label: 'Ганцаардсан',
    description: 'Хол хөндий, дотно дулаан харилцааг хүссэн',
    color: '#B57E65',
    bgLight: '#FBF5F1',
    textColor: '#6B402E',
    borderColor: '#E9D3C7',
  },
  Stressed: {
    type: 'Stressed',
    emoji: '🌪️',
    label: 'Стресстэй',
    description: 'Ачаалал ихтэй, сэтгэл дүүрсэн, ядралттай',
    color: '#C77D5E',
    bgLight: '#FDF5F1',
    textColor: '#753920',
    borderColor: '#F3D2C4',
  },
};

export const CONVERSATION_STARTERS = [
  "hiii Үйсэ, өнөөдөр сэтгэл санаа нэг л биш байна...",
  "Надад ярилцах хүн хэрэгтэй байна, ааш chincha!",
  "Үйсэ, би маш их стресстэй байна.",
  "Би зүгээр л сэтгэлээ уудалж чамтай суумаар байна.",
  "Юу болоод байгааг, өөрийн мэдрэмжээ ойлгоход минь туслаач.",
  "Бүх зүйл нэг л хүнд санагдаад байна.",
  "Ганцаардаад байна, савраа атгуулаач 🐾",
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'welcome-entry',
    title: 'hiii! Манай аюулгүй муурын буланд тавтай морил 🐾',
    content:
      'hiii найз минь!\n\nЭнэхүү дэвтрийг өөрийнхөө хамгийн аюулгүй, тухтай зөөлөн булан гэж бодоорой. Би энд савраа тавиад чамайг хамгаалж суух болно, okeyyy? Энд бичсэн юу ч шүүгдэхгүй, хэнд ч задрахгүй.\n\nЗаримдаа бүх зүйл хэцүү болоод "ааш chincha" гэмээр санагдвал энд уудлаарай. Харин сайхан зүйл тохиолдвол "wuaaa!!" гээд хамтдаа баярлая!\n\nХайр татам савраараа тэвэрсэн,\nҮйсэ (Uise 🐱)',
    mood: 'Calm',
    gratitude: 'Үйсэ муужгайтайгаа аюулгүй тайван булантай болсон минь.',
    isPinned: true,
    tags: ['АюулгүйОрчин', 'ҮйсэМуур', 'СэтгэлЗүй'],
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'sample-entry-1',
    title: 'Бүхнийг ганцаараа үүрэх гэж зүтгэхээ болих нь',
    content:
      'Өнөөдөр ажил дээр бага зэрэг хүнд өдөр өнгөрлөө. Ааш chincha, бүх зүйлийг би л ганцаараа төгс хийх ёстой юм шиг санагдаж явсаар орой гэхэд хүзүү хөшсөн байв.\n\nҮйсэ муур шиг зөөлөн суугаад 5 удаа гүнзгий амьсгаа авлаа. Маргаашийн асуудалд маргааш л санаа тавьж болно шүү дээ, okeyyy.',
    mood: 'Stressed',
    gratitude: 'Халуун аяга цай, өрөөний дулаахан гэрэл.',
    isPinned: false,
    tags: ['Ажил', 'ХилХязгаар', 'Амралт'],
    timestamp: Date.now() - 86400000,
  },
];

export const INITIAL_MOOD_ENTRIES: MoodEntry[] = [
  {
    id: 'mood-1',
    mood: 'Stressed',
    intensity: 4,
    note: 'Хэт олон ажил давхцаж, мэдэгдлүүд тасралтгүй ирсэн',
    tags: ['Ажил', 'Дэлгэц'],
    timestamp: Date.now() - 86400000 * 4,
  },
  {
    id: 'mood-2',
    mood: 'Anxious',
    intensity: 3,
    note: 'Удахгүй болох чухал уулзалтад санаа зовсон',
    tags: ['Харилцаа'],
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 'mood-3',
    mood: 'Okay',
    intensity: 3,
    note: 'Үйсэтэйгээ ярилцаад салхилсны дараа сэтгэл тайвширлаа',
    tags: ['Салхилах', 'Цэвэр агаар'],
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'mood-4',
    mood: 'Calm',
    intensity: 4,
    note: 'Утсаа хол тавиад балжингарам цай уун ном уншлаа',
    tags: ['Ном', 'Цай', 'Амралт'],
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'mood-5',
    mood: 'Calm',
    intensity: 4,
    note: 'wuaaa!! Өглөөний наран цонхоор дулаахан тусаж, өдөр тайван эхэллээ',
    tags: ['Өглөө', 'Амар амгалан'],
    timestamp: Date.now() - 3600000 * 4,
  },
];

export const COMFORT_AFFIRMATIONS = [
  {
    text: "hiii! Та өнөөдөр бүх ертөнцийн ачааг ганцаараа үүрэх албагүй шүү. Зөөлөн амьсгал аваарай, okeyyy? 🐾",
    author: "Үйсэ (Uise 🐱)",
    category: "Тайвшрал",
  },
  {
    text: "wuaaa!! Өнөөдөр таны хийж чадсан ганц зүйл нь зүгээр л энэ өдрийг даван туулсан явдал байсан ч энэ бол үнэхээр мундаг амжилт шүү!",
    author: "Үйсэ (Uise 🐱)",
    category: "Өөрийгөө хайрлах",
  },
  {
    text: "Хэн чамайг бүтээмжгүй байлаа гэж гонсойлгов? Таны үнэ цэн хичнээн ажил амжуулснаар хэмжигдэхгүй шүү дээ, okeyyy! 🐾",
    author: "Үйсэ (Uise 🐱)",
    category: "Үнэ цэн",
  },
  {
    text: "ааш chincha! Хэт их ачааллаасаа болоод эрүүгээ зууж байна уу? Эрүүгээ сулла, мөрөө буулгаад зөөлөн хэвтээрэй 🐾",
    author: "Үйсэ (Uise 🐱)",
    category: "Газардах",
  },
  {
    text: "Мэдрэмж гэдэг нүүдэллэх үүлс шиг. Хүнд үүлс ирж болох ч түүний цаана цэлмэг тэнгэр хэзээд байдаг, okeyyy?",
    author: "Үйсэ (Uise 🐱)",
    category: "Ухамсар",
  },
  {
    text: "hiii! 'Надад одоогоор нам гүм байдал хэрэгтэй байна' гэж хэлэхэд уучлалт гуйх огт шаардлагагүй шүү.",
    author: "Үйсэ (Uise 🐱)",
    category: "Хил хязгаар",
  },
  {
    text: "wuaaa!! Өөрийн эмзэг өдрүүдэд энхрий хандаарай. Муужгай ч бас хүйтэн өдөр бүтэн унтдаг шүү дээ 🐾",
    author: "Үйсэ (Uise 🐱)",
    category: "Тэвчээр",
  },
  {
    text: "Юу ч тохиолдсон бай чиний мэдрэмж бүхэн үнэ цэнтэй бөгөөд би үргэлж дэргэд чинь байна, okeyyy! 🐾",
    author: "Үйсэ (Uise 🐱)",
    category: "Ойлгон дэмжих",
  },
];
