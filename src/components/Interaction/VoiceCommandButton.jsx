import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 9.351v2.4a.75.75 0 01-1.5 0v-2.4A6.751 6.751 0 015.25 12.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

const VoiceCommandButton = () => {
  const { voiceEnabled, visionMode } = useAccessibility();
  // Extraemos las funciones del Hook mejorado
  const { text, isListening, startListening, hasSupport } = useSpeechRecognition();
  const navigate = useNavigate();

  // EFECTO: Reacciona cuando el 'text' cambia (cuando el usuario terminó de hablar)
  useEffect(() => {
    if (text) {
      handleCommand(text.toLowerCase());
    }
  }, [text]);

  // Función auxiliar para HABLAR (Feedback Auditivo)
  const speak = (msg) => {
    // 1. Cancelar cualquier audio previo para evitar caos
    window.speechSynthesis.cancel();
    
    // 2. Configurar la nueva voz
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = 'es-ES'; // Forzar español
    utterance.rate = 1.0; // Velocidad normal
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (rawCommand) => {
    const command = rawCommand.toLowerCase().trim();
    console.log("Comando procesado:", command);

    // LÓGICA DE COMANDOS
    
    // 1. SEGURIDAD
    if (command.includes('ayuda') || command.includes('socorro') || command.includes('emergencia')) {
        speak("Emergencia activada. Abriendo pantalla de seguridad.");
        navigate('/trip-status'); 
        return;
    }

    // 2. NAVEGACIÓN
    if (command.includes('inicio') || command.includes('casa') || command.includes('home')) {
        speak("Volviendo al inicio.");
        navigate('/home');
        return;
    }
    
    if (command.includes('historial') || command.includes('viajes')) {
        speak("Abriendo historial.");
        navigate('/history');
        return;
    }

    if (command.includes('perfil') || command.includes('configuración')) {
        speak("El perfil está en el menú lateral.");
        // Aquí podrías disparar la apertura del sidebar si tuvieras la función
        return;
    }

    // 3. ACCIÓN (Buscar)
    // Detectamos frases como "Pedir viaje", "Quiero ir a...", "Necesito un taxi"
    if (command.includes('pedir') || command.includes('necesito') || command.includes('quiero ir')) {
        speak("¿A dónde quieres ir? Abriendo búsqueda.");
        navigate('/search');
        return;
    }

    if (command.includes('cancelar')) {
        speak("Operación cancelada.");
        // No navegamos, solo feedback
        return;
    }

    // 4. CONTEXTO (Ubicación y Hora)
    if (command.includes('dónde estoy') || command.includes('ubicación')) {
        speak("Estás en la pantalla principal. Ubicación simulada: Avenida Central 123.");
        return;
    }

    if (command.includes('hora')) {
        const now = new Date();
        const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        speak(`Son las ${time}`);
        return;
    }

    // 5. ATAJOS INTELIGENTES (Deep Linking)
    if (command.includes('hospital')) {
        speak("Destino fijado: Hospital. Selecciona tu vehículo.");
        navigate('/ride-select', { state: { destination: { name: 'Hospital Central' } } });
        return;
    }

    // FALLBACK
    speak("No entendí. Intenta decir: Inicio, Historial, o Ayuda.");
  };

  const handleClick = () => {
    if (!hasSupport) {
      alert("Navegador no compatible. Usa Chrome.");
      return;
    }

    // Feedback táctil (Vibración)
    if (navigator.vibrate) navigator.vibrate(50);

    if (!isListening) {
      // Prompt auditivo corto
      speak("Te escucho");
      
      // Pequeño delay para que "Te escucho" no se grabe a sí mismo si usas altavoces
      setTimeout(() => {
        startListening();
      }, 500);
    }
  };

  if (!voiceEnabled) return null;

  // Clases CSS adaptativas (Accessibility Design)
  const containerClasses = visionMode === 'blind'
    ? "fixed bottom-0 left-0 w-full h-1/3 bg-gray-900 border-t-4 border-yellow-400 flex items-center justify-center z-50 touch-manipulation"
    : "fixed bottom-8 right-8 z-50";

  const buttonClasses = visionMode === 'blind'
    ? "w-full h-full flex flex-col items-center justify-center text-yellow-400 active:bg-gray-800"
    : `p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95
       ${isListening ? 'bg-red-600 animate-pulse ring-4 ring-red-300' : 'bg-blue-700'} text-white`;

  return (
    <div className={containerClasses}>
      <button
        onClick={handleClick}
        // aria-pressed informa al lector de pantalla el estado del botón
        aria-pressed={isListening}
        aria-label={isListening ? "Escuchando, habla ahora" : "Activar comandos por voz"}
        className={buttonClasses}
      >
        <MicIcon />
        {visionMode === 'blind' && (
          <span className="text-2xl font-bold mt-4 uppercase tracking-widest">
            {isListening ? "Escuchando..." : "Tocar para Hablar"}
          </span>
        )}
      </button>
    </div>
  );
};

export default VoiceCommandButton;