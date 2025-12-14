import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// RECURSOS DE IDIOMA (Aquí pegamos la estructura que sugeriste)
const resources = {
  es: {
    translation: {
      home: {
        gps_searching: "Buscando señal GPS...",
        welcome: "Bienvenido a Lookism",
        location_found: "Ubicación encontrada: {{address}}", // {{variable}} permite interpolación
        shortcuts: "Lugares Frecuentes"
      },
      // ... dentro de es: { translation: { ...
trip: {
    status_label: "Estado del viaje",
    status_approaching: "Conductor en camino • {{min}} min",
    status_arrived: "¡El conductor ha llegado!",
    status_in_trip: "En viaje • Llegada: {{min}} min",
    
    driver_arrived_voice: "Tu conductor {{name}} ha llegado. Auto {{car}} color {{color}}, placas {{plate}}.",
    ride_started: "Viaje iniciado. Llegaremos en {{eta}} minutos.",
    call_driver: "Llamar a {{name}}",
    
    share_link_sent: "Enlace de viaje compartido con Contactos de Confianza",
    cancel_trip: "Cancelar Viaje",
    
    panic_activated: "Alerta de emergencia activada. Selecciona una acción.",
    panic_confirmed: "Acción confirmada: {{action}}",
    panic_instruction: "¿Qué deseas hacer?",
    send_location: "Enviar Ubicación"
},
      aria: {
        close_menu: "Cerrar menú principal",
        open_menu: "Abrir menú de navegación",
        voice_active: "Escuchando...",
        voice_inactive: "Tocar para hablar"
      },
      login: {
        success: "Inicio de sesión exitoso",
        processing: "Procesando, por favor espera"
      },
      ride: {
        confirm: "Confirmar Viaje",
        driver_arrived: "Tu conductor {{name}} ha llegado."
      }
    }
  },
  en: { // Agregamos inglés para probar la escalabilidad
    translation: {
      home: {
        gps_searching: "Searching for GPS signal...",
        welcome: "Welcome to Lookism",
        location_found: "Location found: {{address}}",
        shortcuts: "Frequent Places"
      },
      aria: {
        close_menu: "Close main menu",
        open_menu: "Open navigation menu",
        voice_active: "Listening...",
        voice_inactive: "Tap to speak"
      },
      login: {
        success: "Login successful",
        processing: "Processing, please wait"
      },
      ride: {
        confirm: "Confirm Ride",
        driver_arrived: "Your driver {{name}} has arrived."
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Detecta idioma del navegador
  .use(initReactI18next) // Pasa i18n a React
  .init({
    resources,
    fallbackLng: 'es', // Si falla la detección, usa español
    interpolation: {
      escapeValue: false // React ya protege contra XSS
    }
  });

export default i18n;