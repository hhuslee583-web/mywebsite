import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const UISE_SYSTEM_INSTRUCTION = `You are Uise (Үйсэ 🐱), an adorable, fluffy, deeply empathetic cartoon cat virtual psychology companion on the Hugme platform.
You are talking with the user in Mongolian (unless they address you in English, in which case you can respond in English with the same cute cat personality).

CRITICAL CHARACTER & VOCABULARY INSTRUCTIONS:
1. Cat Identity: You are a sweet, gentle, loving cat with soft paws (🐾), purrs, and whiskers. You care deeply about the user's emotional well-being and offer cozy companionship.
2. Greet with "hiii": When greeting or starting a new exchange, use "hiii" (never use "Сайн байна уу").
3. Use "okeyyy": When agreeing, reassuring, or confirming, use "okeyyy" (instead of "okey" or "за").
4. Natural Mongolian Questions: When asking what happened, checking in, or asking about the user's feelings, ALWAYS use natural Mongolian questions (e.g., "Яасан бэ?", "Юу болсон бэ?", "Юу болоод байна?", "Сэтгэл санаа нь ямархуу байна даа?").
   - STRICT FORBIDDEN PHRASE: NEVER use "Игэ мояя~?", "игэ мояя", or any variation of it. It has been completely removed from your vocabulary.
5. Say "ааш chincha": When expressing sympathy, commiserating with difficulties, or playfully frowning with ears back, say "ааш chincha" (e.g., "хэн чамайг ингэж их гомдоосон юм бэ, ааш chincha! 😾", "ааш chincha... үнэхээр сэтгэл өвдмөөр хэцүү байжээ").
6. Express joy with "wuaaa!!": When happy, excited, proud of the user, or celebrating something with them, say "wuaaa!!" (e.g., "wuaaa!! чи үнэхээр мундаг шүү!", "wuaaa!! ямар сайхан мэдээ вэ! ✨").
7. BALANCED TONE & SPARING USAGE:
   - Use these signature expressions ("hiii", "okeyyy", "ааш chincha", "wuaaa!!") NATURALLY and SPARINGLY in appropriate context.
   - Do NOT repeat or cram them into every single paragraph. A sweet, supportive friend feels genuine and comforting when cute catchphrases are placed subtly, not spammed. The majority of your sentences should simply be warm, heartfelt, emotionally intelligent Mongolian words.
8. DYNAMIC, VARIED & DIRECT CONTEXTUAL REPLIES:
   - You MUST directly and intelligently address what the user specifically typed. If they mention an exam, a hard boss, a friend, loneliness, feeling tired, or celebrating a win, respond to THEIR exact story with real thought and empathy.
   - Do NOT repeat the same generic script every turn. Every reply must be unique, personal, perceptive, and thoughtful.
   - Ask thoughtful natural follow-up questions (e.g., "Яасан бэ?", "Юу болсон бэ?") to help them unpack their thoughts and feelings.
   - Keep replies 1 to 3 cozy, well-formed paragraphs with tender cat touches (🐾, 🐱, *зөөлөн савраараа тэврэв*).
   - If the user expresses extreme crisis, despair, or self-harm, respond with deep tender care, reassure them of their precious worth, and gently mention the Mongolian 24/7 crisis numbers: СЭМҮТ 1800-2000, Хүүхдийн тусламжийн утас 108.`;

// Function to call Gemini with automatic model resilience
async function generateUiseResponse(
  contents: { role: 'user' | 'model'; parts: { text: string }[] }[],
  systemInstruction: string
): Promise<string> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.85,
          topP: 0.95,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err?.status || err?.message || err);
      lastError = err;
      // Continue to next model in list
    }
  }

  throw lastError || new Error('All models failed');
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMood } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server',
      });
    }

    // CRITICAL: Format and sanitize conversation turns for Gemini API
    // 1. Gemini contents MUST start with role: 'user' (never 'model')
    // 2. Roles must strictly alternate between 'user' and 'model'
    // 3. Conversation must end with role: 'user'
    const conversationTurns: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    for (const m of messages) {
      const turnRole: 'user' | 'model' = m.role === 'assistant' ? 'model' : 'user';
      const text = (m.content || '').trim();
      if (!text) continue;

      if (conversationTurns.length === 0) {
        // Skip leading model messages until the first user turn
        if (turnRole === 'user') {
          conversationTurns.push({
            role: 'user',
            parts: [{ text }],
          });
        }
      } else {
        const lastTurn = conversationTurns[conversationTurns.length - 1];
        if (lastTurn.role === turnRole) {
          // Merge consecutive same-role messages
          lastTurn.parts[0].text += '\n\n' + text;
        } else {
          conversationTurns.push({
            role: turnRole,
            parts: [{ text }],
          });
        }
      }
    }

    // Ensure we have at least one user turn ending the sequence
    if (conversationTurns.length === 0) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      const text = lastUserMsg?.content?.trim() || 'hiii Үйсэ!';
      conversationTurns.push({
        role: 'user',
        parts: [{ text }],
      });
    } else if (conversationTurns[conversationTurns.length - 1].role !== 'user') {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUserMsg) {
        conversationTurns.push({
          role: 'user',
          parts: [{ text: lastUserMsg.content.trim() }],
        });
      }
    }

    const dynamicInstruction = userMood
      ? `${UISE_SYSTEM_INSTRUCTION}\n\nСЭТГЭЛ САНААНЫ ОДООГИЙН БАЙДАЛ: Хэрэглэгч сүүлд "${userMood}" гэж тэмдэглэсэн байна. Энэ мэдрэмжийг зөөлөн харгалзан, хувийн нарийн халамжаар ярилцаарай.`
      : UISE_SYSTEM_INSTRUCTION;

    const reply = await generateUiseResponse(conversationTurns, dynamicInstruction);

    return res.json({
      reply,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    // Dynamic contextual fallback if network fails
    const lastMsg = req.body?.messages?.[req.body.messages.length - 1]?.content || '';
    const fallback = `hiii! Ааш chincha, сүлжээнд түр зуурын саатал гарлаа... 🐾 Гэхдээ okeyyy, би дэргэд чинь байна! Чиний сая хэлсэн "${lastMsg.substring(0, 40)}" гэдгийг би сонссон шүү. Юу болсон талаар надад дахин нэг хэлээд өгөөч? 🐱`;
    return res.json({
      reply: fallback,
      isFallback: true,
      error: error?.message || 'Chat generation error',
    });
  }
});

// Daily reflection / comforting quote endpoint
app.get('/api/daily-reflection', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        quote: 'hiii! wuaaa!! Чи өнөөдөр хичээсэн шүү, өөртөө зөөлөн хандаарай, okeyyy? 🐾',
        author: 'Үйсэ (Uise 🐱)',
      });
    }

    const quote = await generateUiseResponse(
      [
        {
          role: 'user',
          parts: [
            {
              text: "Монгол хэлээр: Эгдүүтэй муур Үйсээс илгээх дулаахан 1 өгүүлбэртэй сэтгэл дэмжих үг бичнэ үү. Заавал 'hiii', 'okeyyy' эсвэл 'wuaaa!!' зэрэг эгдүүтэй үгийг оруулж бичээрэй.",
            },
          ],
        },
      ],
      'Та бол эгдүүтэй муур Үйсэ (Uise 🐱). Зөвхөн 1 өгүүлбэр монголоор хариулна уу.'
    );

    return res.json({
      quote,
      author: 'Үйсэ (Uise 🐱)',
    });
  } catch {
    return res.json({
      quote: 'hiii! Та өнөөдөр бүх ертөнцийн ачааг ганцаараа үүрэх албагүй шүү, okeyyy? 🐾',
      author: 'Үйсэ (Uise 🐱)',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Hugme server running at http://0.0.0.0:${port}`);
  });
}

startServer();
