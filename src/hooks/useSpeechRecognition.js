import { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  // Usamos useRef para mantener la instancia del reconocimiento sin recrearla
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Inicialización segura (Soporte para Chrome, Edge, Safari, Android)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Escuchar una orden y parar (es más robusto para comandos)
      recognition.lang = 'es-ES';
      recognition.interimResults = false; // Solo queremos el resultado final

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript); // Aquí guardamos lo que se escuchó
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Error de voz:", event.error);
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setText(''); // CRÍTICO: Limpiar el texto anterior para permitir comandos repetidos
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Si ya estaba iniciado, lo detenemos y reiniciamos (prevención de errores)
        recognitionRef.current.stop();
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { 
    text, 
    isListening, 
    startListening, 
    stopListening,
    hasSupport: !!recognitionRef.current,
    error 
  };
};

export default useSpeechRecognition;