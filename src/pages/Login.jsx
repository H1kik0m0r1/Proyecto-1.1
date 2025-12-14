import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/authContext'
import { verifyUser, saveUser } from '../utils/userStorage'
import { useScreenReader } from '../context/ScreenReaderContext'; 
import './Login.css'

// 1. IMPORTAR EL HOOK DE ACCESIBILIDAD
import { useAccessibility } from '../context/AccessibilityContext';

// 2. IMPORTAR LAS IMÁGENES
import logoStandard from '../assets/images/logo-standard.png';
import logoHighContrast from '../assets/images/logo-high-contrast.png';

// Iconos optimizados
const GoogleIcon = () => <span style={{marginRight: '0.6em', fontWeight: 'bold', color: '#DB4437'}}>G</span>
const AppleIcon = () => <span style={{marginRight: '0.6em', fontWeight: 'bold', color: '#000'}}></span>

function Login() {
  // 1. HOOKS
  const { speak } = useScreenReader();
  const navigate = useNavigate()
  const { login } = useAuth()
  
  // --- NUEVO: Lógica de UI Adaptativa ---
  const { visionMode } = useAccessibility();

  // Si el modo es 'standard', mostramos el logo blanco (o normal).
  // Si es 'low-vision' o 'blind', mostramos el de alto contraste (negro/amarillo).
  const currentLogo = visionMode === 'standard' ? logoStandard : logoHighContrast;
  // --------------------------------------

  // 2. ESTADOS
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 3. HANDLERS
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  // Simulación de Biometría
  const handleBiometricLogin = () => {
    if (window.confirm("Simulación: ¿Usar FaceID/TouchID?")) {
        speak("Rostro reconocido. Iniciando sesión.");
        login({ name: "Usuario Biométrico", email: "demo@lookism.app", preferences: { visionMode: 'standard'} });
        navigate('/home');
    } else {
        speak("No se reconoció el rostro.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    speak("Procesando, por favor espera.");

    if (isLogin) {
        if (!formData.email || !formData.password) { 
            const msg = 'Campos requeridos';
            setError(msg); 
            speak(msg); 
            return; 
        }

        const result = await verifyUser(formData.email, formData.password) 
        
        if (result.success) {
            speak("Inicio de sesión exitoso.");
            login(result.user)
            navigate('/home') 
        } else {
            const errorMsg = result.message || result.error?.message;
            setError(errorMsg)
            speak("Error: " + errorMsg);
        }
    } else {
        try {
             if (formData.password !== formData.confirmPassword) {
                 throw new Error("Las contraseñas no coinciden");
             }

             const userData = {
                id: Date.now(),
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password,
                fechaRegistro: new Date().toISOString(),
                preferences: { visionMode: 'standard' } 
            }
            
            await saveUser(userData)
            const successMsg = 'Cuenta creada con éxito. Ahora inicia sesión.';
            setSuccess(successMsg)
            speak(successMsg);
            
            setTimeout(() => {
                setIsLogin(true)
                setFormData({ nombre: '', email: '', password: '', confirmPassword: '' })
            }, 1500)
        } catch (err) { 
            const msg = err.message || "Error al registrar";
            setError(msg);
            speak(msg);
        }
    }
  }

  // 4. RENDER (JSX)
  return (
    <div className="login-container">
      <div className="login-content">
        
        {/* Identidad Visual ADAPTATIVA */}
        <div className="brand-header">
          {/* IMPLEMENTACIÓN: Imagen dinámica */}
          <img 
            src={currentLogo} 
            alt="Logotipo de Lookism" 
            className="app-logo-image" 
            // aria-hidden="true" si el texto "LOOKISM" de abajo ya lo lee el lector
            // Si quitas el H1 de abajo, quita el aria-hidden
          />
          
          <h1 className="app-title">LOOKISM</h1>
          <h2 className="page-title">{isLogin ? 'Ingresar' : 'Crear una cuenta'}</h2>
        </div>

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
             <div className="input-group">
               <label htmlFor="nombre" className="sr-only">Nombre completo</label>
               <input
                 type="text"
                 id="nombre"
                 name="nombre"
                 value={formData.nombre}
                 onChange={handleChange}
                 placeholder="Nombre completo"
                 className="custom-input"
                 autoComplete="name" 
                 onFocus={() => speak("Campo Nombre Completo")}
               />
             </div>
          )}
          
          <div className="input-group">
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico" 
              className="custom-input"
              autoComplete="username"
              onFocus={() => speak("Campo de correo electrónico. Toca dos veces para editar.")}
              aria-invalid={!!error}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="custom-input"
              autoComplete={isLogin ? "current-password" : "new-password"}
              onFocus={() => speak("Campo de contraseña.")}
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirmPassword" class="sr-only">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                className="custom-input"
                autoComplete="new-password"
                onFocus={() => speak("Confirma tu contraseña.")}
              />
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <button 
                type="button" 
                className="text-btn"
                onClick={() => speak("Función no disponible en el prototipo")}
              >
                Contraseña olvidada?
              </button>
            </div>
          )}

          {/* Mensajes de Estado */}
          {error && <div role="alert" className="error-msg">{error}</div>}
          {success && <div role="status" className="success-msg">{success}</div>}

          {/* Botón Principal */}
          <button type="submit" className="btn-primary">
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>
        
        {/* Navegación Alternativa */}
        <div className="toggle-section">
            {isLogin ? (
                <p>
                  No tienes una cuenta?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(false)} 
                    className="link-action"
                    aria-label="Ir a registrarse"
                  >
                    Registrarse
                  </button>
                </p>
            ) : (
                <p>
                  Ya tienes una cuenta?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(true)} 
                    className="link-action"
                    aria-label="Ir a ingresar"
                  >
                    Ingresa
                  </button>
                </p>
            )}
        </div>

        <div className="divider">
            <span>o</span>
        </div>

        {/* Social Login */}
        <div className="social-buttons">
            <button type="button" className="btn-social biometric" onClick={handleBiometricLogin}>
                <span role="img" aria-label="Huella Digital">☝️</span> Ingresar con Biometría
            </button>

            <button type="button" className="btn-social" onClick={() => speak("Iniciar con Google")}>
                <GoogleIcon /> Continuar con Google
            </button>
            <button type="button" className="btn-social" onClick={() => speak("Iniciar con Apple")}>
                <AppleIcon /> Continuar con Apple
            </button>
        </div>
      </div>
    </div>
  )
}

export default Login