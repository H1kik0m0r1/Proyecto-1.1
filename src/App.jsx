import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. CONTEXTOS (Jerarquía de Datos)
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './utils/authContext';
import { ScreenReaderProvider } from './context/ScreenReaderContext';

// 2. PÁGINAS
import Login from './pages/Login';
import Home from './pages/Home';
import SearchDestination from './pages/SearchDestination';
import RideSelection from './pages/RideSelection';
import TripStatus from './pages/TripStatus';
import VisionSelector from './pages/Onboarding/VisionSelector';
import History from './pages/History';
import PaymentMethods from './pages/PaymentMethods';

// 3. COMPONENTES DE UI
import Sidebar from './components/Layout/Sidebar';
import VoiceCommandButton from './components/Interaction/VoiceCommandButton';
import ReaderControls from './components/Interaction/ReaderControls';
import TextSizeControl from './components/Interaction/TextSizeControl'; 

// --- COMPONENTES AUXILIARES ---

// MEJORA IHC #1: "Skip Link" (Enlace de salto)
// Permite a usuarios de teclado saltar el menú y controles globales para ir directo al contenido.
const SkipToContent = () => (
  <a 
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[9999] focus:w-full focus:p-4 focus:bg-yellow-400 focus:text-black focus:font-bold focus:text-center focus:outline-none focus:border-b-4 focus:border-black transition-all"
  >
    Saltar al contenido principal (Presiona Enter)
  </a>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Usamos role="status" para que el lector sepa que algo está pasando
    return (
        <div role="status" className="p-10 text-center text-xl font-bold flex flex-col items-center justify-center h-screen">
            <span className="sr-only">Cargando aplicación...</span>
            <div aria-hidden="true">Cargando Lookism...</div>
        </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* MEJORA IHC #2: Wrapper Semántico <main> 
          El id="main-content" es el destino del Skip Link.
          tabIndex="-1" permite que el foco programático aterrice aquí sin ser tabulable después.
      */}
      <main id="main-content" tabIndex="-1" className="flex-grow focus:outline-none min-h-screen relative">
        {React.cloneElement(children, { onOpenMenu: () => setIsSidebarOpen(true) })}
      </main>

      {/* El botón de voz queda flotante fuera del flujo principal */}
      <VoiceCommandButton />
    </>
  );
};

// --- APP PRINCIPAL ---

function App() {
  return (
    <AccessibilityProvider>
      <ScreenReaderProvider>
        <AuthProvider>
          <Router>
            
            {/* 1. ACCESIBILIDAD CRÍTICA (Teclado) */}
            <SkipToContent />

            {/* 2. HERRAMIENTA FLOTANTE (Visual) */}
            <TextSizeControl /> 

            {/* 3. RUTAS */}
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Login />} />

              {/* Rutas Protegidas */}
              <Route path="/vision-setup" element={
                 <ProtectedRoute>
                    {/* VisionSelector no usa AppLayout porque es un wizard de configuración */}
                    <main id="main-content" tabIndex="-1" className="h-screen">
                        <VisionSelector />
                    </main>
                 </ProtectedRoute>
              } />

              <Route path="/home" element={
                <ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>
              } />
              
              <Route path="/search" element={
                <ProtectedRoute><AppLayout><SearchDestination /></AppLayout></ProtectedRoute>
              } />

              <Route path="/ride-select" element={
                <ProtectedRoute><AppLayout><RideSelection /></AppLayout></ProtectedRoute>
              } />

              <Route path="/trip-status" element={
                <ProtectedRoute><AppLayout><TripStatus /></AppLayout></ProtectedRoute>
              } />

              <Route path="/history" element={
                 <ProtectedRoute><AppLayout><History /></AppLayout></ProtectedRoute>
              } />

              <Route path="/payment" element={
                 <ProtectedRoute><AppLayout><PaymentMethods /></AppLayout></ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
            {/* 4. CONTROL DE EMERGENCIA (Audio) */}
            {/* Está al final del DOM para asegurar que se renderice siempre encima de todo (Z-Index) */}
            <ReaderControls />
            
          </Router>
        </AuthProvider>
      </ScreenReaderProvider>
    </AccessibilityProvider>
  );
}

export default App;