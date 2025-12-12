import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/authContext'
import { verifyUser, saveUser } from '../utils/userStorage'
import { useScreenReader } from '../context/ScreenReaderContext'; // Importar hook
import './Login.css'

// Definición de Iconos (Fuera del componente para mejor rendimiento)
const GoogleIcon = () => <span style={{marginRight: '10px', fontWeight: 'bold', color: '#DB4437'}}>G</span>
const AppleIcon = () => <span style={{marginRight: '10px', fontWeight: 'bold', color: '#000'}}></span>

function Login() {
  // 1. HOOKS (Todos juntos al inicio)
  const { speak } = useScreenReader(); // Hook de accesibilidad
  const navigate = useNavigate()
  const { login } = useAuth()
  
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Feedback auditivo inmediato al procesar
    speak("Procesando, por favor espera.");

    if (isLogin) {
        if (!formData.email || !formData.password) { 
            const msg = 'Campos requeridos';
            setError(msg); 
            speak(msg); // Leemos el error
            return; 
        }

        // Asumiendo que userStorage.js ya es async como lo corregimos antes
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
        // Registro
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
                preferences: { visionMode: 'standard' } // Default
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
        
        {/* Identidad Visual */}
        <div className="brand-header">
          <div className="logo-pin">
            <div className="pin-icon" aria-hidden="true">👁️</div> 
          </div>
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
                 onFocus={() => speak("Campo Nombre Completo")}
               />
             </div>
          )}

          <div className="input-group">
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="número de teléfono o correo electrónico" 
              className="custom-input"
              // Lógica de Lector de Pantalla
              onFocus={() => speak("Campo de correo electrónico o teléfono. Toca dos veces para editar.")}
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
              placeholder="contraseña"
              className="custom-input"
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
                placeholder="confirmar contraseña"
                className="custom-input"
                onFocus={() => speak("Confirma tu contraseña.")}
              />
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#" onClick={(e) => { e.preventDefault(); speak("Función no disponible en el prototipo"); }}>
                Contraseña olvidada?
              </a>
            </div>
          )}

          {/* Mensajes de Estado (Live Regions) */}
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
                <p>No tienes una cuenta? <span onClick={() => setIsLogin(false)} className="link-action">Registrarse</span></p>
            ) : (
                <p>Ya tienes una cuenta? <span onClick={() => setIsLogin(true)} className="link-action">Ingresa</span></p>
            )}
        </div>

        {/* Social Login */}
        <div className="divider">
            <span>o</span>
        </div>

        <div className="social-buttons">
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