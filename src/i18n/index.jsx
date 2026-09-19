import React, { createContext, useState, useContext, useEffect } from 'react';
import en from './en.json';
import te from './te.json';
import hi from './hi.json';
import ta from './ta.json';
import kn from './kn.json';
import ml from './ml.json';

const translations = { en, te, hi, ta, kn, ml };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'en');

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
