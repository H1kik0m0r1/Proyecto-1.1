// src/utils/paymentStorage.js

const CARDS_KEY = 'lookism_cards';

// Datos Mock iniciales para que la pantalla no esté vacía
const INITIAL_CARDS = [
  { id: '1', type: 'visa', number: '**** **** **** 4242', holder: 'Usuario Demo', exp: '12/25' },
  { id: '2', type: 'mastercard', number: '**** **** **** 5555', holder: 'Usuario Demo', exp: '10/24' }
];

export const getStoredCards = () => {
  const stored = localStorage.getItem(CARDS_KEY);
  if (!stored) {
    // Si es la primera vez, guardamos los iniciales
    localStorage.setItem(CARDS_KEY, JSON.stringify(INITIAL_CARDS));
    return INITIAL_CARDS;
  }
  return JSON.parse(stored);
};

export const addCardToStorage = (cardData) => {
  const cards = getStoredCards();
  
  // Simulamos enmascaramiento de seguridad (PCI DSS Compliance simulado)
  const last4 = cardData.number.slice(-4);
  const type = detectCardType(cardData.number);
  
  const newCard = {
    id: Date.now().toString(),
    type: type, // 'visa' o 'mastercard'
    number: `**** **** **** ${last4}`,
    holder: cardData.holder.toUpperCase(),
    exp: cardData.exp
  };

  const updatedCards = [...cards, newCard];
  localStorage.setItem(CARDS_KEY, JSON.stringify(updatedCards));
  return newCard;
};

export const removeCardFromStorage = (cardId) => {
  const cards = getStoredCards();
  const updatedCards = cards.filter(c => c.id !== cardId);
  localStorage.setItem(CARDS_KEY, JSON.stringify(updatedCards));
  return updatedCards;
};

// Helper simple para detectar tipo
const detectCardType = (number) => {
  if (number.startsWith('4')) return 'visa';
  if (number.startsWith('5')) return 'mastercard';
  return 'generic';
};