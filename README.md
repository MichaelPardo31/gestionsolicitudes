# 📚 Gestión Académica Universitaria - Simplex

## 🌟 Descripción
Plataforma integral de gestión académica para instituciones educativas con módulos para estudiantes, profesores y administradores.

### Responsables:  
- Michael Pardo.  
- Alejandro Garzon.  
- Diego Alberto Sanabria.
- Ana Sofia Londoño O.
- David Santiago Rodriguez R.  

## ✨ Características Principales
### 🚀 Módulos
- **Autenticación Segura**
- **Panel de Administración**
- **Foro Académico**
- **Asistente Virtual**
- **Gestión de Solicitudes**

## 🛠️ Tecnologías
### Frontend
- React v18 + Hooks
- React Router v6
- Context API
- CSS Modules

### Backend (Mock)
- API simulada
- CRUD operations
- Data validation

## 🚀 Instalación
git clone https://github.com/tu-usuario/simplex.git
```bash
cd simplex
npm install
npm start

src/
├── api/                   # Servicios y llamadas a APIs externas
│   ├── apiService.js
│   └── callGemini.js
├── components/            # Componentes reutilizables de la interfaz
│   ├── AuthLogin/         # Autenticación
│   │   ├── AuthLogin.js
│   │   └── AuthLogin.module.css
│   ├── AdminPanel.js
│   ├── AdminPanel.module.css
│   ├── AdminSidebar.js
│   ├── AdminSolicitudesManager.js
│   ├── AdminSolicitudesManager.module.css
│   ├── ChatbotAssistant.js
│   ├── ChatbotAssistant.module.css
│   ├── Dashboard.js
│   ├── DashboardHome.js
│   ├── Foro.js
│   ├── Foro.module.css
│   ├── ForoEstudiantil.js
│   ├── HomePortal.js
│   ├── HomePortal.module.css
│   ├── LayoutHeader.js
│   ├── Login.js
│   ├── Login.module.css
│   ├── MainLayout.js
│   ├── NotFound.js
│   ├── NotificacionesManager.js
│   ├── PerfilUsuario.js
│   ├── Router.js
│   ├── SolicitudesContainer.js
│   ├── SolicitudesList.jsx
│   ├── SolicitudesManager.js
│   ├── SolicitudesManager.module.css
│   ├── StudentSidebar.js
│   └── UserProfile.js
├── context/               # Contextos globales de React
│   ├── AuthContext.js
│   └── NavigationContext.js
├── data/                  # Datos estáticos (JSON, etc.)
│   └── noticiasEventos.json
├── mock/                  # Datos y lógica simulada para pruebas
│   ├── api.js
│   ├── chatbot.js
│   ├── foro.js
│   ├── notificaciones.js
│   ├── solicitudes.js
│   ├── solicitudesAdmin.js
│   ├── udemData.js
│   └── users.js
├── routes/                # Rutas personalizadas o internas
│   └── api.js
├── server/                # Backend simulado o APIs locales
│   ├── index.js
│   ├── noticiasEventos.json
│   ├── package-lock.json
│   └── package.json
├── services/              # Servicios externos como OpenAI
│   └── openaiService.js
├── utils/                 # Funciones utilitarias
│   └── handleLocalQuery.js
├── styles.css             # Estilos globales
├── App.js
├── index.js
├── NoticiasEventos.module.css
├── public/                # Archivos estáticos
│   └── index.html
└── package.json           # Configuración principal del proyecto

root/
├── .gitignore
├── README.md
├── postcss.config.js
├── tailwind.config.js
├── replacements.txt
└── package-lock.json
