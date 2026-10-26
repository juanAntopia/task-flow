# Task Flow - Next.js + Laravel + PostgreSQL Stack

Estructura completa desacoplada con **Next.js** en el frontend, **Laravel (v13)** en el backend y base de datos **PostgreSQL 17**, orquestada con **Docker Compose**.

---

## 📁 Estructura del Proyecto

```text
├── frontend/                 # Next.js (App Router + TypeScript + Tailwind)
│   ├── src/
│   │   ├── app/              # Rutas y páginas de la aplicación
│   │   ├── components/       # Componentes de interfaz de usuario
│   │   ├── services/         # Cliente HTTP tipado para Laravel
│   │   └── types/            # Definiciones de TypeScript
│   ├── public/               # Recursos estáticos
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # Laravel (API RESTful + Sanctum + PostgreSQL)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Policies/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   └── api.php
│   ├── config/
│   │   └── cors.php
│   ├── Dockerfile
│   └── composer.json
│
└── docker-compose.yml
```

---

## 🚀 Inicio Rápido con Docker Compose

Para levantar todo el entorno (Base de datos, Backend y Frontend):

```bash
docker compose up -d
```

### URLs de los servicios:
- **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
- **Backend API (Laravel):** [http://localhost:8000/api](http://localhost:8000/api)
- **API Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Panel Web de Base de Datos (Adminer):** [http://localhost:8080](http://localhost:8080)
- **Base de Datos (PostgreSQL):** `localhost:5432`
  - Sistema: `PostgreSQL`
  - Servidor (desde Adminer): `postgres`
  - Servidor (desde tu PC / DBeaver): `localhost`
  - Usuario: `app_user`
  - Contraseña: `change_me_local`
  - Base de datos: `app_db`

---

## ⚙️ Configuraciones Recomendadas Incluidas

### 1. Backend (Laravel):
- **Laravel 13** con PHP 8.4 y extensiones `pdo_pgsql`, `pgsql`, `zip`, `bcmath`, `pcntl`.
- **Laravel Sanctum** preinstalado para autenticación de API tokens y SPA cookie sessions.
- **CORS configurado** (`config/cors.php`) admitiendo peticiones desde `http://localhost:3000` con `supports_credentials => true`.
- **Ruta de salud:** `/api/health` para monitorizar estado y conectividad.
- **Modelos:** `User` configurado con el trait `HasApiTokens`.

### 2. Frontend (Next.js):
- **Cliente HTTP tipado:** (`src/services/api.ts`) preparado para peticiones REST (`get`, `post`, `put`, `patch`, `delete`), manejo de errores de validación de Laravel, Bearer token y cookies CSRF con Sanctum.
- **Variables de entorno:** `NEXT_PUBLIC_API_URL=http://localhost:8000/api` en `.env.local`.
- **Alias de importación:** `@/*` configurado hacia `./src/*`.
- **Componente de estado:** `src/components/BackendStatus.tsx` para verificar en tiempo real la conexión con Laravel.

---

## 🛠️ Comandos de Desarrollo Útiles

### Ejecutar migraciones en Laravel vía Docker:
```bash
docker compose exec backend php artisan migrate
```

### Ejecutar comandos de Artisan:
```bash
docker compose exec backend php artisan <comando>
```

### Detener los contenedores:
```bash
docker compose down
```
