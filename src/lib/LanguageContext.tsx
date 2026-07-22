import React, { createContext, useContext, useState, useEffect } from "react";
import { SUPPORTED_LANGUAGES, Language, t as translateStatic, translateText } from "./i18n";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  languages: Language[];
  t: (key: string) => string;
  translateDynamic: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to check if an element is excluded from translation (e.g. headers, inputs, script tags, or notranslate classes)
const isExcluded = (element: Element): boolean => {
  if (!element) return false;
  
  // Always exclude header and any elements inside a header
  if (element.tagName === "HEADER" || element.closest("header")) {
    return true;
  }
  
  // Exclude any elements explicitly marked as notranslate or translate="no"
  if (element.classList?.contains("notranslate") || element.closest(".notranslate")) {
    return true;
  }
  if (element.getAttribute?.("translate") === "no" || element.closest('[translate="no"]')) {
    return true;
  }

  // Exclude structural/interactive elements where translation could break behavior or syntax
  const excludedTags = ["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "NOSCRIPT", "CODE", "PRE", "SVG", "PATH", "IFRAME", "BUTTON-GROUP"];
  if (excludedTags.includes(element.tagName)) {
    return true;
  }
  
  return false;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      return localStorage.getItem("swadeshi_language") || "en";
    } catch {
      return "en";
    }
  });

  // Inject Google Translate script and create hidden element
  useEffect(() => {
    // 1. Create a hidden google translate element in body
    if (!document.getElementById("google_translate_element")) {
      const div = document.createElement("div");
      div.id = "google_translate_element";
      div.style.display = "none";
      div.style.position = "absolute";
      div.style.top = "-9999px";
      div.style.left = "-9999px";
      document.body.appendChild(div);
    }

    // 2. Define global initialization callback
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,bn,ta,te,mr,gu,kn,ml,pa,es,fr,de,ja,ar",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        "google_translate_element"
      );
    };

    // 3. Inject Google Translate script if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Update document direction (LTR/RTL) and language code attributes on HTML root
  useEffect(() => {
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    const isRtl = rtlLanguages.includes(language);
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Update Google Translate state when language changes
  useEffect(() => {
    const applyTranslation = () => {
      try {
        const lang = language;
        
        // A. Set googtrans cookie
        const cookieValue = lang === "en" ? "" : `/en/${lang}`;
        const expires = lang === "en" 
          ? "expires=Thu, 01 Jan 1970 00:00:00 GMT" 
          : "expires=Fri, 31 Dec 2049 23:59:59 GMT";
        const domain = window.location.hostname;
        
        document.cookie = `googtrans=${cookieValue};path=/;${expires};SameSite=None;Secure`;
        document.cookie = `googtrans=${cookieValue};path=/;domain=${domain};${expires};SameSite=None;Secure`;
        document.cookie = `googtrans=${cookieValue};path=/;domain=.${domain};${expires};SameSite=None;Secure`;

        // B. Update URL hash
        if (lang === "en") {
          if (window.location.hash.includes("googtrans")) {
            window.location.hash = "";
          }
        } else {
          window.location.hash = `#googtrans(en|${lang})`;
        }

        // C. Programmatically select option and trigger change in Translate combo
        const triggerCombo = () => {
          const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
          if (combo) {
            combo.value = lang;
            combo.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
            return true;
          }
          return false;
        };

        if (!triggerCombo()) {
          // If combo is not loaded yet, retry a few times
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (triggerCombo() || attempts > 15) {
              clearInterval(interval);
            }
          }, 300);
        }
      } catch (err) {
        console.warn("Failed to apply Google Translate:", err);
      }
    };

    // Delay slightly to let the widget initialize
    const timer = setTimeout(applyTranslation, 250);
    return () => clearTimeout(timer);
  }, [language]);

  const setLanguage = (lang: string) => {
    try {
      localStorage.setItem("swadeshi_language", lang);
    } catch {
      // Ignore
    }

    // Set the cookie before reloading
    const cookieValue = lang === "en" ? "" : `/en/${lang}`;
    const expires = lang === "en" 
      ? "expires=Thu, 01 Jan 1970 00:00:00 GMT" 
      : "expires=Fri, 31 Dec 2049 23:59:59 GMT";
    const domain = window.location.hostname;
    
    document.cookie = `googtrans=${cookieValue};path=/;${expires};SameSite=None;Secure`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=${domain};${expires};SameSite=None;Secure`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=.${domain};${expires};SameSite=None;Secure`;

    setLanguageState(lang);
    
    // Smooth reload to apply translation cleanly and avoid React Virtual DOM reconciliation crashes
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  // High-fidelity fallback translation using local static dictionary
  const t = (key: string) => {
    return translateStatic(key, language);
  };

  // High-fidelity dynamic fallback translation using backend Gemini Translator API
  const translateDynamic = async (text: string) => {
    return translateText(text, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: SUPPORTED_LANGUAGES, t, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
