import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. IMPORTACIÓN DE CONTEXTOS
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './utils/authContext';
import { ScreenReaderProvider } from './context/ScreenReaderContext';

// 2. IMPORTACIÓN DE PÁGINAS
import Login from './pages/Login';
import Home from './pages/Home';
import SearchDestination from './pages/SearchDestination';
import RideSelection from './pages/RideSelection';
import TripStatus from './pages/TripStatus';
import VisionSelector from './pages/Onboarding/VisionSelector';
import History from './pages/History';
import PaymentMethods from './pages/PaymentMethods'; // Asegúrate de importar esto

// 3. IMPORTACIÓN DE COMPONENTES DE UI
import Sidebar from './components/Layout/Sidebar';
import VoiceCommandButton from './components/Interaction/VoiceCommandButton';
import ReaderControls from './components/Interaction/ReaderControls';

// --- COMPONENTES AUXILIARES ---

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-10 text-center">Cargando sistema...</div>;
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
      {/* Inyectamos la función de abrir menú al hijo */}
      {React.cloneElement(children, { onOpenMenu: () => setIsSidebarOpen(true) })}
      
      {/* Elementos Flotantes Globales */}
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
            {/* OJO AQUÍ: <Routes> envuelve TODAS las definiciones de <Route> */}
            <Routes>
              
              {/* Rutas Públicas */}
              <Route path="/" element={<Login />} />

              {/* Rutas Protegidas */}
              <Route path="/vision-setup" element={
                 <ProtectedRoute><VisionSelector /></ProtectedRoute>
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
            {/* FIN DE ROUTES - Aquí termina la lista de páginas */}
            
            {/* Componentes que NO son páginas (flotantes), van fuera de Routes pero dentro de Router */}
            <ReaderControls />
            
          </Router>
        </AuthProvider>
      </ScreenReaderProvider>
    </AccessibilityProvider>
  );
}

export default App;