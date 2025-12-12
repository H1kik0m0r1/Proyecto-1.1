import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useScreenReader } from '../context/ScreenReaderContext';
import './Home.css';

// Iconos
const MenuIcon = () => <span className="icon">☰</span>;
const UserIcon = () => <span className="icon">👤</span>;
const SearchIcon = () => <span className="icon">🔍</span>;
const HomeIcon = () => <span className="icon">🏠</span>;
const WorkIcon = () => <span className="icon">💼</span>;

const Home = ({ onOpenMenu }) => {
  const { speak } = useScreenReader();
  const { user } = useAuth();
  const { visionMode } = useAccessibility();
  const navigate = useNavigate();
  
  // Estado para ubicación
  const [currentLocation, setCurrentLocation] = useState("Localizando...");

  // EFECTO: Simulación de GPS + Anuncio de Voz
  useEffect(() => {
    // 1. Orientación inicial
    speak("Pantalla de inicio. Buscando señal GPS.");

    // 2. Simulación de hallazgo de ubicación
    const timer = setTimeout(() => {
      const mockAddress = "Av. Principal 123, Ciudad Central";
      setCurrentLocation(mockAddress);
      
      // Feedback auditivo crucial (Heurística 1: Visibilidad del estado)
      speak(`Ubicación actual: ${mockAddress}`);
      
    }, 2000);

    return () => clearTimeout(timer);
  }, []); 

  const handleDestinationClick = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    navigate('/search');
  };

  const handleQuickAction = (place) => {
    speak(`Configurando destino a ${place}`);
    // Lógica futura: navegar directo
    console.log(`Ir a ${place}`);
  };

  return (
    <div className={`home-container ${visionMode}`}>
      {/* HEADER */}
      <header className="home-header">
        <button 
            aria-label="Abrir menú lateral" 
            className="icon-btn"
            onClick={onOpenMenu}
        >
          <MenuIcon />
        </button>
        <div className="header-title" role="heading" aria-level="1">
           LOOKISM
        </div>
        <div className="profile-indicator" aria-label={`Perfil de ${user?.nombre || 'Usuario'}`}>
            <div className="avatar-circle">
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : <UserIcon />}
            </div>
        </div>
      </header>

      {/* ÁREA CENTRAL (Sin Mapa Real, solo Decorativo) */}
      <main className="map-area">
        {/* Fondo decorativo estático */}
        <div className="visual-map-placeholder" aria-hidden="true">
            {/* Opcional: Una imagen estática de un mapa si quieres estética */}
        </div>

        {/* Tarjeta Flotante (Esto es lo que importa al usuario) */}
        <div className="location-card" role="status" aria-live="polite">
            <span className="location-label">Tu ubicación actual:</span>
            <h2 className="location-text">{currentLocation}</h2>
        </div>
      </main>

      {/* PANEL INFERIOR (Action Sheet) */}
      <section className="action-sheet">
        <h3 className="greeting">
            Hola, {user?.nombre || 'Viajero'}. 
            <span className="subtitle"> ¿A dónde vamos hoy?</span>
        </h3>

        {/* Input Falso (Botón de Búsqueda) */}
        <div 
            className="destination-box" 
            onClick={handleDestinationClick}
            tabIndex="0"
            role="button"
            aria-label="Buscar destino. Toca dos veces para escribir."
            onKeyDown={(e) => e.key === 'Enter' && handleDestinationClick()}
        >
            <SearchIcon />
            <span className="placeholder-text">Buscar destino...</span>
        </div>

        {/* Atajos */}
        <div className="shortcuts-grid">
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
            <div 
                className="recent-item" 
                tabIndex="0" 
                onClick={() => handleQuickAction('Hospital Central')}
                aria-label="Viaje reciente: Hospital Central, Avenida Salud 500"
            >
                <span className="time-icon" aria-hidden="true">🕒</span>
                <div className="route-info">
                    <span className="destination">Hospital Central</span>
                    <span className="address">Av. Salud 500</span>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;