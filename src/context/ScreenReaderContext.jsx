import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// 1. Crear el contexto
const ScreenReaderContext = createContext();

// 2. Exportar el Provider (Componente Padre)
export const ScreenReaderProvider = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;
  const voiceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      // Priorizar voz en español
      voiceRef.current = voices.find(v => v.lang.includes('es-419') || v.lang.includes('es-ES')) || voices[0];
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text, interrupt = true) => {
    if (!text) return;

    if (interrupt) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voiceRef.current) {
        utterance.voice = voiceRef.current;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const stop = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return (
    <ScreenReaderContext.Provider value={{ speak, stop, isSpeaking }}>
      {children}
    </ScreenReaderContext.Provider>
  );
};

// 3. EXPORTAR EL HOOK (ESTO ES LO QUE TE FALTABA)
export const useScreenReader = () => {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    throw new Error('useScreenReader debe usarse dentro de un ScreenReaderProvider');
  }
  return context;
};