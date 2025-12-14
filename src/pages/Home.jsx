import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- 1. IMPORTAR HOOK DE TRADUCCIÓN
import { useAuth } from '../utils/authContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useScreenReader } from '../context/ScreenReaderContext';
import './Home.css';

// Iconos (SVG inline para mejor rendimiento)
const MenuIcon = () => <span className="icon" aria-hidden="true">☰</span>;
const UserIcon = () => <span className="icon" aria-hidden="true">👤</span>;
const SearchIcon = () => <span className="icon" aria-hidden="true">🔍</span>;
const HomeIcon = () => <span className="icon" aria-hidden="true">🏠</span>;
const WorkIcon = () => <span className="icon" aria-hidden="true">💼</span>;

const Home = ({ onOpenMenu }) => {
  // HOOKS
  const { t } = useTranslation(); // <--- 2. INICIALIZAR
  const { speak } = useScreenReader();
  const { user } = useAuth();
  const { visionMode } = useAccessibility();
  const navigate = useNavigate();
  
  // ESTADOS
  const [currentLocation, setCurrentLocation] = useState(t('home.gps_searching')); // Texto inicial traducido

  // EFECTO: Simulación de GPS + Anuncio de Voz
  useEffect(() => {
    // 1. Orientación inicial (Usando la clave de traducción)
    speak(t('home.gps_searching'));

    // 2. Simulación de hallazgo de ubicación
    const timer = setTimeout(() => {
      const mockAddress = "Av. Principal 123, Ciudad Central";
      setCurrentLocation(mockAddress);
      
      // Feedback auditivo con interpolación de variables
      // El JSON debe tener: "location_found": "Ubicación encontrada: {{address}}"
      speak(t('home.location_found', { address: mockAddress }));
      
    }, 2000);

    return () => clearTimeout(timer);
  }, [t, speak]); // Agregamos dependencias para evitar warnings

  // HANDLERS
  const handleDestinationClick = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    navigate('/search');
  };

  const handleQuickAction = (placeName) => {
    const msg = `Configurando destino a ${placeName}`;
    speak(msg);
    console.log(msg);
    // Aquí iría la navegación real: navigate('/ride-select', { state: { destination: placeName } })
  };

  return (
    <div className={`home-container ${visionMode}`}>
      {/* HEADER */}
      <header className="home-header">
        <button 
            aria-label={t('aria.open_menu')} // "Abrir menú de navegación"
            className="icon-btn"
            onClick={onOpenMenu}
        >
          <MenuIcon />
        </button>
        
        <h1 className="header-title">LOOKISM</h1> {/* Semántica H1 para el título de la app */}
        
        <div 
            className="profile-indicator" 
            role="img" 
            aria-label={`Perfil de ${user?.nombre || 'Usuario'}`}
        >
            <div className="avatar-circle">
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : <UserIcon />}
            </div>
        </div>
      </header>

      {/* ÁREA CENTRAL (Mapa Decorativo) */}
      <main className="map-area" aria-hidden="true"> 
        {/* aria-hidden="true" porque el mapa es decorativo para ciegos, 
            la info real está en la tarjeta flotante de abajo */}
        <div className="visual-map-placeholder"></div>

        {/* Tarjeta Flotante (Info crítica) */}
        <div className="location-card" role="status" aria-live="polite">
            <span className="location-label">{t('home.location_found', { address: '' }).split(':')[0]}:</span>
            <h2 className="location-text">{currentLocation}</h2>
        </div>
      </main>

      {/* PANEL INFERIOR (Action Sheet) */}
      <section className="action-sheet">
        <div className="greeting">
            {/* Traducción con nombre de usuario */}
            <h3>{t('home.welcome')}, {user?.nombre || 'Viajero'}</h3>
            <span className="subtitle">¿A dónde quieres ir hoy?</span>
        </div>

        {/* Input Falso (Botón de Búsqueda) */}
        <div 
            className="destination-box" 
            onClick={handleDestinationClick}
            tabIndex="0"
            role="button"
            aria-label="Buscar destino. Toca dos veces para activar."
            onKeyDown={(e) => e.key === 'Enter' && handleDestinationClick()}
        >
            <SearchIcon />
            <span className="placeholder-text">Buscar destino...</span>
        </div>

        {/* Atajos (Shortcuts) */}
        <div className="shortcuts-grid">
            <h4 className="sr-only">{t('home.shortcuts')}</h4> {/* Título oculto para estructura */}
            
            <button 
                className="shortcut-card" 
                onClick={() => handleQuickAction('Casa')}
                aria-label="Ir a Casa"
            >
                <div className="shortcut-icon bg-blue-100"><HomeIcon /></div>
                <span className="shortcut-label">Casa</span>
            </button>
            
            <button 
                className="shortcut-card" 
                onClick={() => handleQuickAction('Trabajo')}
                aria-label="Ir al Trabajo"
            >
                <div className="shortcut-icon bg-orange-100"><WorkIcon /></div>
                <span className="shortcut-label">Trabajo</span>
            </button>
        </div>

        {/* Recientes */}
        <div className="recent-activity">
            <h4 className="section-title">Recientes</h4>
            <button 
                className="recent-item" 
                onClick={() => handleQuickAction('Hospital Central')}
                aria-label="Viaje reciente: Hospital Central, Avenida Salud 500"
            >
                <span className="time-icon" aria-hidden="true">🕒</span>
                <div className="route-info text-left"> {/* text-left asegura alineación */}
                    <span className="destination block font-bold">Hospital Central</span>
                    <span className="address block text-sm text-gray-600">Av. Salud 500</span>
                </div>
            </button>
        </div>
      </section>
    </div>
  );
};

export default Home;