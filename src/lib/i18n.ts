// Multilingual Translation System for Swadeshi AI Heritage Corridor

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
];

// Pre-translated high-quality static dictionary for core UI terms to ensure instant, zero-latency rendering.
// Handles Hindi, Spanish, French, and Japanese as explicit reference implementations. Others can fall back to dynamic Gemini translation.
export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    "Explore": "अन्वेषण",
    "Stakeholder": "हितधारक",
    "Storyteller": "कथावाचक",
    "Simulator": "सिम्युलेटर",
    "Compare": "तुलना करें",
    "Artisan Hub": "कारीगर हब",
    "Navigator": "मार्गदर्शक",
    "Feeds": "लाइव फीड",
    "Alerts": "सुरक्षा अलर्ट",
    "Select Corridor": "कॉरिडोर चुनें",
    "Heritage Digital Twin Console": "धरोहर डिजिटल ट्विन कंसोल",
    "Search Corridor...": "कॉरिडोर खोजें...",
    "How it works": "यह कैसे काम करता है",
    "Speak or Dictate Shop Story": "अपनी दुकान की कहानी बोलें या निर्देशित करें",
    "Or Select a Multilingual Sample Speech": "या एक बहुभाषी नमूना भाषण चुनें",
    "Onboard Shop (AI)": "दुकान ऑनबोर्ड करें (AI)",
    "Cancel": "रद्द करें",
    "Simulate Mic Dictation": "माइक डिक्टेशन का अनुकरण करें",
    "Register a heritage micro-shop in seconds via multilingual speech": "बहुभाषी भाषण के माध्यम से सेकंडों में विरासत सूक्ष्म-दुकान पंजीकृत करें",
    "Join Hub (Voice)": "हब से जुड़ें (आवाज)",
    "Swadeshi AI Voice Onboarding": "स्वदेशी एआई वॉयस ऑनबोर्डिंग",
    "Verified Swadeshi Ledger": "सत्यापित स्वदेशी बहीखाता",
    "Shop Successfully Registered!": "दुकान सफलतापूर्वक पंजीकृत!",
    "Your voice description was parsed and standard ledger records have been generated.": "आपकी आवाज के विवरण का विश्लेषण किया गया और मानक बहीखाता रिकॉर्ड उत्पन्न किए गए हैं।",
    "Cultural Storyteller Audio RAG": "सांस्कृतिक कथावाचक ऑडियो आरएजी",
    "Reset View": "व्यू रीसेट करें",
    "Back to Landing": "लैंडिंग पर वापस",
    "Varanasi": "वाराणसी",
    "Jaipur": "जयपुर",
    "Kochi": "कोच्चि",
    "Hampi": "हम्पी",
    "Search heritage cities & landmarks...": "धरोहर शहरों और स्थलों की खोज करें...",
    "Search cities & landmarks...": "शहरों और स्थलों की खोज करें...",
    "Language / भाषा / 🌐": "भाषा / Language / 🌐",
    "Active Destination": "सक्रिय गंतव्य",
  },
  es: {
    "Explore": "Explorar",
    "Stakeholder": "Panel",
    "Storyteller": "Narrador",
    "Simulator": "Simulador",
    "Compare": "Comparar",
    "Artisan Hub": "Gremio",
    "Navigator": "Navegación",
    "Feeds": "Transmisión",
    "Alerts": "Alertas",
    "Select Corridor": "Seleccionar Corredor",
    "Heritage Digital Twin Console": "Consola de Gemelo Digital",
    "Search Corridor...": "Buscar corredor...",
    "How it works": "Cómo funciona",
    "Speak or Dictate Shop Story": "Habla o dicta la historia de la tienda",
    "Or Select a Multilingual Sample Speech": "O seleccione un discurso de muestra",
    "Onboard Shop (AI)": "Registrar tienda (AI)",
    "Cancel": "Cancelar",
    "Simulate Mic Dictation": "Simular dictado de voz",
    "Register a heritage micro-shop in seconds via multilingual speech": "Registre un comercio tradicional en segundos por voz",
    "Join Hub (Voice)": "Unirse al gremio (Voz)",
    "Swadeshi AI Voice Onboarding": "Registro por voz Swadeshi AI",
    "Verified Swadeshi Ledger": "Libro de contabilidad Swadeshi verificado",
    "Shop Successfully Registered!": "¡Comercio registrado con éxito!",
    "Your voice description was parsed and standard ledger records have been generated.": "Su descripción de voz fue procesada y se generó el registro contable oficial.",
    "Open Swadeshi Corridor Dashboard": "Abrir panel de Swadeshi Corridor",
    "Assigned Union": "Gremio asignado",
    "Base Income": "Ingreso base",
    "Dictating...": "Dictando...",
    "Active Alerts": "Alertas activas",
    "File Incident": "Reportar incidente",
    "Report Civic Incident": "Reportar incidente cívico",
    "Multilingual Dialect Parser": "Analizador de dialectos",
    "Search & Filters": "Búsqueda y filtros",
    "Varanasi": "Varanasi",
    "Jaipur": "Jaipur",
    "Kochi": "Kochi",
    "Hampi": "Hampi",
    "Search heritage cities & landmarks...": "Buscar ciudades y lugares de interés...",
    "Search cities & landmarks...": "Buscar ciudades...",
    "Language / भाषा / 🌐": "Idioma / 🌐",
    "Active Destination": "Destino Activo",
  },
  fr: {
    "Explore": "Explorer",
    "Stakeholder": "Partenaires",
    "Storyteller": "Conteur",
    "Simulator": "Simulateur",
    "Compare": "Comparer",
    "Artisan Hub": "Artisans",
    "Navigator": "Navigateur",
    "Feeds": "Flux Direct",
    "Alerts": "Alertes",
    "Select Corridor": "Choisir le Couloir",
    "Heritage Digital Twin Console": "Console Jumeau Numérique",
    "Search Corridor...": "Rechercher un couloir...",
    "How it works": "Comment ça marche",
    "Speak or Dictate Shop Story": "Racontez l'histoire de votre boutique",
    "Or Select a Multilingual Sample Speech": "Ou sélectionnez un exemple de texte",
    "Onboard Shop (AI)": "Enregistrer la boutique (IA)",
    "Cancel": "Annuler",
    "Simulate Mic Dictation": "Simuler l'enregistrement",
    "Register a heritage micro-shop in seconds via multilingual speech": "Enregistrez un commerce patrimonial en quelques secondes par la voix",
    "Join Hub (Voice)": "Rejoindre le hub (Voix)",
    "Swadeshi AI Voice Onboarding": "Enregistrement vocal Swadeshi IA",
    "Verified Swadeshi Ledger": "Registre Swadeshi vérifié",
    "Shop Successfully Registered!": "Boutique enregistrée avec succès !",
    "Your voice description was parsed and standard ledger records have been generated.": "Votre description vocale a été analysée et les fiches ont été créées.",
    "Open Swadeshi Corridor Dashboard": "Ouvrir le tableau de bord",
    "Assigned Union": "Syndicat assigné",
    "Base Income": "Revenu de base",
    "Dictating...": "Enregistrement...",
    "Active Alerts": "Alertes actives",
    "Varanasi": "Varanasi",
    "Jaipur": "Jaipur",
    "Kochi": "Kochi",
    "Hampi": "Hampi",
    "Search heritage cities & landmarks...": "Rechercher des villes patrimoniales...",
    "Search cities & landmarks...": "Rechercher...",
    "Language / भाषा / 🌐": "Langue / 🌐",
    "Active Destination": "Destination Active",
  },
  ja: {
    "Explore": "探検する",
    "Stakeholder": "関係者",
    "Storyteller": "ストーリー",
    "Simulator": "シミュレータ",
    "Compare": "比較する",
    "Artisan Hub": "職人ハブ",
    "Navigator": "ナビゲーター",
    "Feeds": "ライブ配信",
    "Alerts": "警報",
    "Select Corridor": "回廊を選択",
    "Heritage Digital Twin Console": "デジタルツインコンソール",
    "Search Corridor...": "回廊を検索...",
    "How it works": "仕組み",
    "Speak or Dictate Shop Story": "店舗のストーリーを話す・吹き込む",
    "Or Select a Multilingual Sample Speech": "またはサンプル音声を選択",
    "Onboard Shop (AI)": "店舗を登録する (AI)",
    "Cancel": "キャンセル",
    "Simulate Mic Dictation": "マイク入力をシミュレートする",
    "Register a heritage micro-shop in seconds via multilingual speech": "多言語音声で伝統ある小規模店舗を数秒で登録",
    "Join Hub (Voice)": "ハブに参加する (音声)",
    "Swadeshi AI Voice Onboarding": "スワデシAI音声オンボーディング",
    "Verified Swadeshi Ledger": "検証済みスワデシ台帳",
    "Shop Successfully Registered!": "店舗登録が完了しました！",
    "Your voice description was parsed and standard ledger records have been generated.": "音声による説明が分析され、標準の台帳レコードが生成されました。",
    "Open Swadeshi Corridor Dashboard": "スワデシ回廊ダッシュボードを開く",
    "Assigned Union": "配属組合",
    "Base Income": "基準収入",
    "Dictating...": "音声入力中...",
    "Varanasi": "バラナシ",
    "Jaipur": "ジャイプール",
    "Kochi": "コチ",
    "Hampi": "ハンピ",
    "Search heritage cities & landmarks...": "歴史都市やランドマークを検索...",
    "Search cities & landmarks...": "検索...",
    "Language / भाषा / 🌐": "言語 / 🌐",
    "Active Destination": "有効な目的地",
  },
};

// Memory cache in-session
const translationCache: Record<string, string> = {};

// In-flight request deduplication map
const pendingRequests = new Map<string, Promise<string>>();

// Concurrency limited queue to prevent browser connection starvation/exhaustion
class ConcurrencyQueue {
  private activeCount = 0;
  private maxConcurrency = 3; // Limit to 3 concurrent fetch requests
  private queue: (() => Promise<void>)[] = [];

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task = async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          this.activeCount--;
          this.next();
        }
      };

      this.queue.push(task);
      this.next();
    });
  }

  private next() {
    if (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.activeCount++;
        task();
      }
    }
  }
}

const translationQueue = new ConcurrencyQueue();

// Helper to translate arbitrary text using our backend translator
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text || !targetLanguage || targetLanguage === "en") {
    return text;
  }

  const cacheKey = `${targetLanguage}:${text}`;
  
  // 1. Check local memory cache
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // 2. Check localStorage cache to persist across reloads
  try {
    const localSaved = localStorage.getItem(`swadeshi_i18n:${cacheKey}`);
    if (localSaved) {
      translationCache[cacheKey] = localSaved;
      return localSaved;
    }
  } catch (e) {
    // Ignore localStorage block
  }

  // 3. Fallback to dictionary for exact matches
  if (UI_TRANSLATIONS[targetLanguage] && UI_TRANSLATIONS[targetLanguage][text]) {
    const dictTranslation = UI_TRANSLATIONS[targetLanguage][text];
    translationCache[cacheKey] = dictTranslation;
    return dictTranslation;
  }

  // 4. Check if there's already a request in progress for this exact text and language
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  // 5. Enqueue the network request with concurrency control
  const fetchPromise = translationQueue.add(async () => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) {
          const result = data.translatedText;
          translationCache[cacheKey] = result;
          try {
            localStorage.setItem(`swadeshi_i18n:${cacheKey}`, result);
          } catch (e) {
            // Ignore write block
          }
          return result;
        }
      }
    } catch (err) {
      console.error("Failed to translate via API, using original:", err);
    } finally {
      pendingRequests.delete(cacheKey);
    }
    return text;
  });

  pendingRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

// Synchonous UI text getter with dictionary fallback
export function t(key: string, currentLang: string): string {
  if (!currentLang || currentLang === "en") return key;
  if (UI_TRANSLATIONS[currentLang] && UI_TRANSLATIONS[currentLang][key]) {
    return UI_TRANSLATIONS[currentLang][key];
  }
  return key;
}
