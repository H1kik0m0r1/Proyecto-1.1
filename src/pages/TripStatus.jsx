import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- 1. LIBRERÍA DE TRADUCCIÓN
import FocusTrap from 'focus-trap-react';       // <--- 2. SEGURIDAD (Cierra al usuario en el modal)
import { useAccessibility } from '../context/AccessibilityContext';
import { useScreenReader } from '../context/ScreenReaderContext'; // <--- 3. Contexto de Voz Global
import './TripStatus.css';

const TripStatus = () => {
  const { t } = useTranslation(); 
  const { speak } = useScreenReader();
  const { visionMode } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ESTADOS DEL VIAJE
  const [status, setStatus] = useState('driver_approaching'); 
  const [eta, setEta] = useState(5); 
  const [panicModalOpen, setPanicModalOpen] = useState(false);

  // Verificamos si venimos de un comando de voz de emergencia
  useEffect(() => {
    if (location.state?.panicMode) {
        handlePanic();
    }
  }, [location.state]);

  // DATOS DEL CONDUCTOR (Mock)
  const driver = {
    name: "Carlos",
    rating: "4.9",
    car: "Toyota Prius",
    color: "Blanco",
    plate: "LKS-999"
  };

  // SIMULACIÓN DEL VIAJE
  useEffect(() => {
    // 1. El conductor llega en 5 segundos
    const approachTimer = setTimeout(() => {
        setStatus('driver_arrived');
        
        // Mensaje construido con i18n y datos dinámicos
        // Nota: Asegúrate de tener estas claves en tu i18n.js (te las dejo abajo)
        const arrivalMsg = t('trip.driver_arrived_voice', { 
            name: driver.name, 
            car: driver.car, 
            color: driver.color,
            plate: driver.plate.split('').join(' ') // L-K-S... para que se entienda mejor
        });
        
        speak(arrivalMsg);
        
        // Patrón de vibración distintivo (largo-corto-largo)
        if(navigator.vibrate) navigator.vibrate([400, 200, 400]); 
    }, 5000);

    // 2. El viaje inicia
    const startTimer = setTimeout(() => {
        setStatus('in_trip');
        setEta(15);
        speak(t('trip.ride_started', { eta: 15 }));
    }, 10000);

    return () => { clearTimeout(approachTimer); clearTimeout(startTimer); };
  }, [t, speak]); // Dependencias seguras

  // MANEJADORES
  const handlePanic = () => {
    setPanicModalOpen(true);
    if(navigator.vibrate) navigator.vibrate([500, 100, 500, 100, 500]); // Vibración SOS muy fuerte
    speak(t('trip.panic_activated')); 
  };

  const confirmPanic = (action) => {
    // Aquí iría la integración con API de Twilio o similar
    console.log(`ACCIÓN CRÍTICA: ${action}`);
    speak(t('trip.panic_confirmed', { action }));
    setPanicModalOpen(false);
  };

  return (
    <div className={`trip-container ${visionMode}`}>
      
      {/* 1. HEADER INFORMATIVO (Live Region) */}
      <header className="trip-header" tabIndex="0" role="region" aria-label={t('trip.status_label')}>
        <div className="status-badge" role="status" aria-live="assertive">
            {status === 'driver_approaching' && t('trip.status_approaching', { min: 5 })}
            {status === 'driver_arrived' && t('trip.status_arrived')}
            {status === 'in_trip' && t('trip.status_in_trip', { min: eta })}
        </div>

        <div className="driver-card">
            <div className="driver-photo" aria-hidden="true">👤</div>
            <div className="driver-info">
                <h2 className="driver-name">{driver.name} ★ {driver.rating}</h2>
                <p className="car-details">
                    <span className="car-model">{driver.car} ({driver.color})</span>
                    {/* Placa accesible: leemos letra por letra */}
                    <span className="car-plate" aria-label={`Placas ${driver.plate.split('').join(' ')}`}>
                        {driver.plate}
                    </span>
                </p>
            </div>
            <button 
                className="call-btn" 
                aria-label={t('trip.call_driver', { name: driver.name })}
                onClick={() => speak("Llamando al conductor...")}
            >
                📞
            </button>
        </div>
      </header>

      {/* 2. MAPA VISUAL (Oculto para Screen Readers) */}
      <main className="trip-map" aria-hidden="true">
        <div className="map-placeholder-trip"></div>
      </main>

      {/* 3. CONTROLES DE SEGURIDAD */}
      <footer className="trip-controls">
        <div className="safety-grid">
            <button 
                className="safety-btn share" 
                onClick={() => speak(t('trip.share_link_sent'))}
            >
                Compartir
            </button>
            <button className="safety-btn panic" onClick={handlePanic}>
                🆘 SOS
            </button>
        </div>
        
        <button className="cancel-trip-btn" onClick={() => navigate('/home')}>
            {t('trip.cancel_trip')}
        </button>
      </footer>

      {/* 4. MODAL DE PÁNICO (HCI: Focus Trap implementado) */}
      {panicModalOpen && (
        <FocusTrap focusTrapOptions={{ initialFocus: false }}>
            <div className="modal-overlay" role="alertdialog" aria-labelledby="panic-title" aria-modal="true">
                <div className="modal-content panic-mode">
                    <h2 id="panic-title">EMERGENCIA</h2>
                    <p>{t('trip.panic_instruction')}</p>
                    
                    <button 
                        className="panic-action call-911" 
                        onClick={() => confirmPanic('911')}
                        autoFocus // Foco inicial aquí por seguridad (Ley de Hick)
                    >
                        📞 911
                    </button>
                    
                    <button 
                        className="panic-action share-loc" 
                        onClick={() => confirmPanic('Location')}
                    >
                        📍 {t('trip.send_location')}
                    </button>
                    
                    <button 
                        className="panic-action cancel" 
                        onClick={() => setPanicModalOpen(false)}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </FocusTrap>
      )}
    </div>
  );
};

export default TripStatus;