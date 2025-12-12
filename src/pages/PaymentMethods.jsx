import React, { useState, useEffect } from 'react';
import { useScreenReader } from '../context/ScreenReaderContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { getStoredCards, addCardToStorage, removeCardFromStorage } from '../utils/paymentStorage';
import './PaymentMethods.css';

const PaymentMethods = ({ onOpenMenu }) => {
  const { speak } = useScreenReader();
  const { visionMode } = useAccessibility();
  
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Formulario
  const [formData, setFormData] = useState({ number: '', holder: '', exp: '', cvc: '' });

  useEffect(() => {
    setCards(getStoredCards());
    speak("Pantalla de métodos de pago. Aquí puedes administrar tus tarjetas.");
  }, []);

  // --- ACCIONES ---

  const handleDelete = (id) => {
    const updated = removeCardFromStorage(id);
    setCards(updated);
    speak("Tarjeta eliminada correctamente.");
  };

  const handleSimulatedScan = () => {
    if (navigator.vibrate) navigator.vibrate(100);
    speak("Escaneando tarjeta... Procesando imagen...");
    
    // Simulación de demora de OCR
    setTimeout(() => {
      setFormData({
        number: '4242 4242 4242 8888',
        holder: 'NOMBRE ESCANEADO',
        exp: '09/28',
        cvc: '123'
      });
      speak("Tarjeta escaneada. Formulario completado. Revisa los datos y confirma.");
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.number.length < 16 || !formData.cvc) {
      speak("Error. Revisa los datos de la tarjeta.");
      return;
    }
    
    addCardToStorage(formData);
    setCards(getStoredCards()); // Recargar
    setShowForm(false);
    setFormData({ number: '', holder: '', exp: '', cvc: '' }); // Reset
    speak("Nueva tarjeta agregada con éxito.");
  };

  // --- RENDER ---

  return (
    <div className={`payment-container ${visionMode}`}>
      {/* Header */}
      <header className="payment-header">
        <button onClick={onOpenMenu} className="icon-btn" aria-label="Menú">☰</button>
        <h1>Billetera</h1>
      </header>

      <main className="payment-content">
        
        {/* LISTA DE TARJETAS */}
        {!showForm && (
          <>
            <div className="cards-list" role="list">
              {cards.map(card => (
                <div 
                  key={card.id} 
                  className={`credit-card ${card.type}`}
                  tabIndex="0"
                  role="listitem"
                  aria-label={`Tarjeta ${card.type}, terminada en ${card.number.slice(-4)}, expira ${card.exp}`}
                >
                  <div className="card-chip"></div>
                  <div className="card-number">{card.number}</div>
                  <div className="card-meta">
                    <span>{card.holder}</span>
                    <span>{card.exp}</span>
                  </div>
                  <button 
                    className="delete-card-btn"
                    onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                    aria-label="Eliminar esta tarjeta"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <button 
              className="add-btn" 
              onClick={() => { setShowForm(true); speak("Abriendo formulario para agregar tarjeta."); }}
            >
              + Agregar Método de Pago
            </button>
          </>
        )}

        {/* FORMULARIO DE NUEVA TARJETA */}
        {showForm && (
          <div className="add-card-form" role="dialog" aria-label="Formulario de nueva tarjeta">
            <h2>Nueva Tarjeta</h2>
            
            {/* SIMULACIÓN DE ESCANEO (IHC: Eficiencia) */}
            <button type="button" className="scan-btn" onClick={handleSimulatedScan}>
              📷 Escanear Tarjeta (Cámara)
            </button>
            
            <p className="separator-text">o ingresa los datos manualmente</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="sr-only" htmlFor="cc-number">Número de tarjeta</label>
                <input 
                  id="cc-number"
                  type="tel" // Abre teclado numérico en móvil
                  placeholder="Número de Tarjeta"
                  value={formData.number}
                  onChange={e => setFormData({...formData, number: e.target.value})}
                  maxLength="19"
                  className="payment-input"
                />
              </div>

              <div className="form-row">
                <input 
                  type="text" 
                  placeholder="MM/AA" 
                  value={formData.exp}
                  onChange={e => setFormData({...formData, exp: e.target.value})}
                  className="payment-input half"
                  aria-label="Fecha de expiración"
                />
                <input 
                  type="password" // Password para que el lector no diga el CVC en voz alta (Privacidad)
                  placeholder="CVC" 
                  value={formData.cvc}
                  onChange={e => setFormData({...formData, cvc: e.target.value})}
                  maxLength="3"
                  className="payment-input half"
                  aria-label="Código de seguridad CVC"
                />
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Nombre del Titular" 
                  value={formData.holder}
                  onChange={e => setFormData({...formData, holder: e.target.value})}
                  className="payment-input"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentMethods;