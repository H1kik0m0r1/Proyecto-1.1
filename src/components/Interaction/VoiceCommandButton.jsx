import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useScreenReader } from '../../context/ScreenReaderContext'; // INTEGRACIÓN CORRECTA
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

// Icono optimizado para SVG accesible
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 9.351v2.4a.75.75 0 01-1.5 0v-2.4A6.751 6.751 0 015.25 12.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

const VoiceCommandButton = () => {
  // 1. Contextos Globales
  const { voiceEnabled, visionMode } = useAccessibility();
  const { speak, stop } = useScreenReader(); // Usamos el motor centralizado
  const navigate = useNavigate();

  // 2. Hook de Reconocimiento de Voz
  const { text, isListening, startListening, hasSupport } = useSpeechRecognition();

  // 3. EFECTO: Procesador de Comandos (NLP Básico)
  useEffect(() => {
    if (text && !isListening) {
      handleCommand(text.toLowerCase());
    }
  }, [text, isListening]);

  const handleCommand = (command) => {
    console.log("Comando voz recibido:", command);

    // --- LÓGICA DE INTENCIÓN (INTENT MATCHING) ---

    // A. SEGURIDAD (Prioridad Máxima)
    if (match(command, ['ayuda', 'socorro', 'emergencia', 'policía', '911'])) {
        speak("¡Emergencia detectada! Activando protocolo de seguridad.");
        navigate('/trip-status', { state: { panicMode: true } }); 
        return;
    }

    // B. NAVEGACIÓN GLOBAL
    if (match(command, ['inicio', 'casa', 'home', 'principal'])) {
        speak("Yendo a la pantalla de inicio.");
        navigate('/home');
        return;
    }
    
    if (match(command, ['historial', 'viajes', 'mis viajes', 'anteriores'])) {
        speak("Abriendo tu historial de viajes.");
        navigate('/history');
        return;
    }

    if (match(command, ['cerrar sesión', 'salir'])) {
        speak("Para cerrar sesión, usa el menú lateral por seguridad.");
        // No cerramos sesión automáticamente por voz para evitar accidentes
        return;
    }

    // C. ACCIÓN: SOLICITAR VIAJE
    if (match(command, ['pedir', 'taxi', 'coche', 'auto', 'uber', 'quiero ir'])) {
        speak("Entendido. Abriendo búsqueda de destino.");
        navigate('/search');
        return;
    }

    // D. ACCIÓN: CANCELAR
    if (match(command, ['cancelar', 'parar', 'detener'])) {
        stop(); // Detiene el lector de pantalla
        speak("Acción cancelada.");
        return;
    }

    // E. ATAJOS INTELIGENTES (Deep Linking)
    // Ejemplo: "Llévame al hospital" salta la búsqueda y va directo a seleccionar auto
    if (command.includes('hospital')) {
        speak("Destino de emergencia fijado: Hospital Central. Selecciona tu vehículo.");
        navigate('/ride-select', { state: { destination: { name: 'Hospital Central', address: 'Urgencias' } } });
        return;
    }

    // F. CONTEXTO
    if (match(command, ['hora', 'qué hora es'])) {
        const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        speak(`Son las ${time}`);
        return;
    }

    if (match(command, ['dónde estoy', 'ubicación'])) {
        speak("Estás navegando en la aplicación Lookism. Di 'Ayuda' para más opciones.");
        return;
    }

    // FALLBACK (No entendió)
    speak("No entendí el comando. Intenta decir: Inicio, Historial, o Pedir Viaje.");
  };

  // Función auxiliar para coincidencia flexible
  const match = (text, keywords) => keywords.some(keyword => text.includes(keyword));

  // 4. HANDLER DEL BOTÓN
  const handleClick = () => {
    if (!hasSupport) {
      speak("Tu navegador no soporta comandos de voz.");
      return;
    }

    // Feedback Táctil
    if (navigator.vibrate) navigator.vibrate(50);

    if (!isListening) {
      // Detenemos cualquier audio anterior para que el usuario pueda hablar
      stop(); 
      speak("Te escucho...", false); // false = no interrumpir si ya estaba hablando (aunque aquí forzamos stop antes)
      
      // Pequeño delay técnico para evitar que el micrófono capte al sintetizador diciendo "Te escucho"
      setTimeout(() => {
        startListening();
      }, 600);
    }
  };

  // 5. RENDERIZADO CONDICIONAL
  if (!voiceEnabled) return null;

  // --- ESTILOS ADAPTATIVOS (HCI ERGONOMICS) ---
  
  // MODO CIEGO: El botón ocupa el tercio inferior de la pantalla (Ley de Fitts: Blanco infinito)
  if (visionMode === 'blind') {
    return (
        <div className="fixed bottom-0 left-0 w-full h-1/3 z-50">
            <button
                onClick={handleClick}
                aria-pressed={isListening}
                aria-label={isListening ? "Escuchando. Habla ahora." : "Botón de voz. Toca dos veces para dictar comandos."}
                className={`w-full h-full flex flex-col items-center justify-center border-t-4 border-yellow-400 touch-manipulation transition-colors duration-200
                    ${isListening ? 'bg-red-900 text-white' : 'bg-gray-900 text-yellow-400'}
                `}
            >
                <div className={`p-6 rounded-full ${isListening ? 'animate-pulse bg-red-600' : 'bg-gray-800'}`}>
                    <MicIcon />
                </div>
                <span className="text-2xl font-bold mt-4 uppercase tracking-widest">
                    {isListening ? "ESCUCHANDO..." : "TOCAR PARA HABLAR"}
                </span>
            </button>
        </div>
    );
  }

  // MODO ESTÁNDAR / BAJA VISIÓN: Botón flotante (FAB)
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={handleClick}
        aria-pressed={isListening}
        aria-label={isListening ? "Escuchando..." : "Comandos por voz"}
        className={`p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 border-2 border-white
           ${isListening 
             ? 'bg-red-600 animate-pulse ring-4 ring-red-300' 
             : 'bg-blue-700 hover:bg-blue-800'} 
           text-white`}
      >
        <MicIcon />
      </button>
    </div>
  );
};

export default VoiceCommandButton;