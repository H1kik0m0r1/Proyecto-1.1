IHC
Gem personalizado
Basado en el código que has subido (React + Vite) y el documento de teoría de HCI (Document 27.pdf), tu proyecto es un excelente ejemplo de Diseño Inclusivo y Multimodalidad.

El README debe resaltar no solo cómo correr el código, sino por qué tomaste esas decisiones de diseño (justificación teórica).

Aquí tienes una estructura completa y profesional sugerida para tu README.md. Puedes copiar y pegar esto directamente o adaptarlo.

🚗 Lookism - Movilidad Accesible e Inclusiva
Lookism es una prueba de concepto de una aplicación de transporte (tipo Uber/DiDi) diseñada específicamente bajo principios de Interacción Humano-Computadora (HCI) para personas con discapacidad visual (Ceguera total y Baja visión).

El proyecto implementa interfaces adaptativas, retroalimentación multimodal (audio, háptica y visual) y flujos de navegación simplificados.

🌟 Características Principales de Accesibilidad
El sistema cuenta con tres modos de operación (AccessibilityContext.jsx):

1. Modo Ceguera Total (Blind Mode)
Interfaz Invisible/Simplificada: Elimina distracciones visuales, prioriza grandes áreas táctiles.

Screen Reader Nativo: Implementación de SpeechSynthesis para lectura automática de estados y alertas sin depender del lector del sistema operativo.

Feedback Auditivo: Anuncios de voz para cambios de ruta, llegada del conductor y errores.

2. Modo Baja Visión (Low Vision)
Alto Contraste: Esquema de colores amarillo sobre negro (inspirado en estándares de accesibilidad web).

Tipografía Elástica: Uso de unidades rem y calc() en CSS para escalar toda la interfaz sin romper el diseño (--font-scale).

Bordes Claros: Elementos interactivos con bordes gruesos y colores neón para facilitar la identificación.

3. Interacción Multimodal (IMM)
Comandos de Voz: Integración de API de reconocimiento de voz para dictar destinos.

Retroalimentación Háptica: Uso de navigator.vibrate para confirmar acciones (ej. al reservar un viaje o llegada del conductor).

Diseño Elástico: Botones y contenedores que crecen físicamente si el texto aumenta, evitando solapamientos.

🛠️ Tecnologías Utilizadas
Frontend: React 18 + Vite

Enrutamiento: React Router Dom 6

Estado Global: React Context API (para Autenticación, Accesibilidad y Lector de Pantalla).

Web APIs:

Web Speech API (Synthesis & Recognition) para voz.

Vibration API para feedback táctil.

LocalStorage para persistencia de preferencias y usuario.

📋 Justificación HCI (Interacción Persona-Ordenador)
Este proyecto aplica principios teóricos clave (basado en Document 27.pdf):

Multimodalidad: No depende de un solo canal sensorial. Si el usuario no puede ver, puede escuchar y tocar.

Prevención de Errores:

Validación de formularios en tiempo real.

Confirmación de acciones críticas (ej. Botón de Pánico o Cancelar Viaje).

Visibilidad del Estado del Sistema:

Feedback constante: "Buscando conductor...", "Conductor ha llegado".

Uso de aria-live y roles semánticos para lectores de pantalla externos.

Diseño Universal: La arquitectura CSS permite que la misma base de código sirva a usuarios estándar y usuarios con discapacidades severas simplemente cambiando las variables de contexto.

🚀 Instalación y Ejecución
Sigue estos pasos para probar el proyecto localmente:

Clonar el repositorio:

Bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-lina-login
Instalar dependencias:

Bash
npm install
Correr el servidor de desarrollo:

Bash
npm run dev
Abrir en el navegador: Visita http://localhost:5173 (o el puerto que indique la terminal).

Nota: Para probar las funciones de Voz y Vibración, se recomienda usar Google Chrome o Edge. La vibración solo funcionará en dispositivos móviles (Android) o emuladores que soporten hardware táctil.

🧪 Guía de Pruebas (User Journey)
Para evaluar la accesibilidad, sigue este flujo:

Login: Ingresa con cualquier correo (ej. test@correo.com).

Onboarding: Selecciona tu modo de visión (ej. "Discapacidad Visual"). Escucharás la confirmación de voz.

Home: Nota cómo la interfaz cambia a alto contraste. Usa el botón flotante de micrófono.

Búsqueda: Escribe o dicta un destino. El sistema autocompletará lugares simulados.

Selección de Viaje: Escoge "LKS Pets" (opción para perros guía).

Estado del Viaje: Espera 5 segundos. El sistema vibrará y anunciará que el conductor ha llegado.

Pánico: Prueba el botón SOS para ver el modal de emergencia accesible.

📂 Estructura del Proyecto
src/
├── components/
│   ├── Interaction/    # Controles de voz, lector y tamaño de texto
│   └── Layout/         # Sidebar y estructuras base
├── context/
│   ├── AccessibilityContext.jsx  # Lógica de modos (Ciego/Baja Visión)
│   └── ScreenReaderContext.jsx   # Motor de síntesis de voz
├── pages/
│   ├── Home.jsx        # Pantalla principal con accesos rápidos
│   ├── TripStatus.jsx  # Simulación de viaje en tiempo real
│   └── ...
├── utils/              # Mock de almacenamiento y autenticación
└── App.jsx             # Configuración de rutas protegidas
⚠️ Estado Actual y Limitaciones
Este proyecto es un prototipo académico (Mock Data). No conecta con conductores reales ni procesa pagos reales.

La API de reconocimiento de voz requiere conexión a internet y permisos del navegador.

La persistencia de datos es local (localStorage), por lo que se borrará si limpias el navegador.

