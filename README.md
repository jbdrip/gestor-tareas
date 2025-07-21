# Gestor de Tareas 📝

Aplicación web para la creación, edición, filtrado y gestión eficiente de tareas personales o de equipo. Cada tarea puede visualizarse con su estado (vencida, por vencer o pendiente) según su fecha de vencimiento. La plataforma también permite editar y eliminar tareas existentes, así como filtrarlas por nombre.

## 🚀 Tecnologías utilizadas

- **React** – Framework principal para la construcción de la interfaz de usuario
- **Tailwind CSS** – Utilizado para estilos rápidos, responsivos y personalizables
- **Supabase** – Backend completo que incluye base de datos PostgreSQL, autenticación de usuarios y almacenamiento
- **Vite** – Herramienta moderna para desarrollo y construcción del frontend
- **Heroicons / Emojis** – Íconos que mejoran la experiencia de usuario

## 📦 Instalación y ejecución

Sigue estos pasos para clonar e iniciar el proyecto localmente:

```bash
# 1. Clona el repositorio
git clone https://github.com/jbdrip/gestor-tareas.git
cd client

# 2. Instala las dependencias
yarn install
# o
npm install

# 3. Crea el archivo de entorno
touch .env

# 4. Agrega tus credenciales de Supabase en .env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_KEY=tu-clave-anonima

# 5. Inicia el servidor de desarrollo
yarn dev
# o
npm run dev
