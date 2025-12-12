import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import './TripStatus.css';

const TripStatus = () => {
  const { visionMode } = useAccessibility();
  const navigate = useNavigate();
  
  // ESTADOS DEL VIAJE
  const [status, setStatus] = useState('driver_approaching'); // driver_approaching, in_trip, arrived
  const [eta, setEta] = useState(5); // Minutos
  const [panicModalOpen, setPanicModalOpen] = useState(false);

  // DATOS DEL CONDUCTOR (Mock)
  const driver = {
    name: "Carlos",
    rating: "4.9",
    car: "Toyota Prius",
    color: "Blanco",
    plate: "LKS-999" // Dato crítico para verificar
  };

  // SIMULACIÓN DEL VIAJE (Feedback del Sistema)
  useEffect(() => {
    // 1. El conductor llega en 5 segundos (demo)
    const approachTimer = setTimeout(() => {
        setStatus('driver_arrived');
        announce("Tu conductor Carlos ha llegado. Auto Toyota Blanco, placas L-K-S nueve nueve nueve.");
        if(navigator.vibrate) navigator.vibrate([200, 100, 200]); // Patrón distintivo
    }, 5000);

    // 2. El viaje inicia 5 segundos después
    const startTimer = setTimeout(() => {
        setStatus('in_trip');
        setEta(15); // 15 min al destino
        announce("Viaje iniciado. Llegaremos en 15 minutos.");
    }, 10000);

    return () => { clearTimeout(approachTimer); clearTimeout(startTimer); };
  }, []);

  // Función auxiliar para síntesis de voz
  const announce = (text) => {
    if (visionMode !== 'standard') {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }
  };

  const handlePanic = () => {
    setPanicModalOpen(true);
    // Vibración de alerta fuerte
    if(navigator.vibrate) navigator.vibrate([500, 100, 500]);
    announce("Alerta de emergencia activada. ¿Deseas llamar al 911 o compartir ubicación?");
  };

  const confirmPanic = (action) => {
    // Aquí se integraría con la API de llamadas o SMS
    alert(`Acción ejecutada: ${action}`);
    setPanicModalOpen(false);
  };

  return (
    <div className={`trip-container ${visionMode}`}>
      
      {/* 1. HEADER INFORMATIVO (Visible y Semántico) */}
      <header className="trip-header" tabIndex="0">
        <div className="status-badge">
            {status === 'driver_approaching' && 'Conductor en camino • 5 min'}
            {status === 'driver_arrived' && '¡El conductor ha llegado!'}
            {status === 'in_trip' && `En viaje • Llegada: ${eta} min`}
        </div>
        <div className="driver-card">
            <div className="driver-photo">👤</div>
            <div className="driver-info">
                <h2 className="driver-name">{driver.name} ★ {driver.rating}</h2>
                <p className="car-details">
                    <span className="car-model">{driver.car} ({driver.color})</span>
                    <span className="car-plate" aria-label={`Placas ${driver.plate.split('').join(' ')}`}>
                        {driver.plate}
                    </span>
                </p>
            </div>
            {/* Botón de llamada al conductor */}
            <button className="call-btn" aria-label={`Llamar a ${driver.name}`}>📞</button>
        </div>
      </header>

      {/* 2. MAPA VISUAL (Decorativo para ciegos) */}
      <main className="trip-map" aria-hidden="true">
        <div className="map-placeholder-trip"></div>
      </main>

      {/* 3. CONTROLES DE SEGURIDAD (Zona del Pulgar) */}
      <footer className="trip-controls">
        <div className="safety-grid">
            <button className="safety-btn share" onClick={() => announce("Enlace de viaje compartido con Contactos de Confianza")}>
                Compartir Viaje
            </button>
            <button className="safety-btn panic" onClick={handlePanic}>
                🆘 SOS
            </button>
        </div>
        
        <button className="cancel-trip-btn" onClick={() => navigate('/home')}>
            Cancelar Viaje
        </button>
      </footer>

      {/* 4. MODAL DE PÁNICO (Accesible y Prioritario) */}
      {panicModalOpen && (
        <div className="modal-overlay" role="alertdialog" aria-labelledby="panic-title">
            <div className="modal-content panic-mode">
                <h2 id="panic-title">EMERGENCIA</h2>
                <p>Selecciona una acción inmediata:</p>
                <button 
                    className="panic-action call-911" 
                    onClick={() => confirmPanic('Llamar 911')}
                    autoFocus
                >
                    📞 LLAMAR 911
                </button>
                <button 
                    className="panic-action share-loc" 
                    onClick={() => confirmPanic('Enviar Ubicación')}
                >
                    📍 ENVIAR UBICACIÓN
                </button>
                <button 
                    className="panic-action cancel" 
                    onClick={() => setPanicModalOpen(false)}
                >
                    Falsa alarma (Cancelar)
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TripStatus;