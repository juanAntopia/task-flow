# Manual de Pruebas y Desarrollo de Componentes: Playwright & Storybook

Este documento sirve como manual y referencia para el equipo de desarrollo de **Task Flow (Frontend)**. Aquí se detalla la configuración, funcionalidad y flujo de trabajo para el desarrollo y prueba de componentes con **Storybook** y pruebas End-to-End con **Playwright**.

---

## 1. Arquitectura de Pruebas: ¿Cuándo usar cada herramienta?

| Herramienta | Tipo de Prueba | Enfoque y Alcance | Entorno |
| :--- | :--- | :--- | :--- |
| **Storybook** | Pruebas de Componentes, Aislamiento, Visual y Accesibilidad | Un componente o unidad visual aislada (Botón, Tarjeta, Modal, Formulario). Sin depender de Laravel ni de bases de datos. | Navegador interactivo (`localhost:6006`) o headless con Vitest. |
| **Playwright** | Pruebas End-to-End (E2E) y de Integración | Flujos completos de usuario (Login, Navegación de rutas, CRUD de tareas, Comunicación con la API de Laravel). | Navegadores reales (Chromium, Firefox, WebKit). |

---

## 2. Storybook: Desarrollo y Pruebas de Componentes

### 2.1 ¿Para qué sirve?
- **Desarrollo Aislado:** Permite construir y estilizar componentes en Tailwind CSS sin tener que levantar el backend, sin crear sesiones de prueba ni navegar por múltiples pantallas.
- **Catálogo y Living Documentation:** Documenta todas las variantes, tamaños y estados posibles (`disabled`, `loading`, `error`, dark mode).
- **Controles en Tiempo Real:** Panel inferior interactivo para modificar *props* directamente en el navegador.

### 2.2 Estructura de Carpetas
```
frontend/
├── .storybook/
│   ├── main.ts         # Configuración del bundler (Vite), rutas de historias y addons
│   └── preview.tsx     # Configuración visual global (importa globals.css de Tailwind)
└── src/
    └── components/
        ├── ui/
        │   ├── button/
        │   │   ├── Button.tsx           # Componente
        │   │   ├── Button.stories.tsx   # Historias y pruebas de interacción
        │   │   └── index.ts
        │   ├── card/
        │   │   ├── Card.tsx
        │   │   ├── Card.stories.tsx
        │   │   └── index.ts
        │   └── index.ts
        └── BackendStatus.stories.tsx
```

### 2.3 Comandos de Storybook
Desde la carpeta `frontend/`:

```bash
# Iniciar el servidor de desarrollo de Storybook
npm run storybook
# Disponible en: http://localhost:6006

# Compilar Storybook para producción o despliegue estático
npm run build-storybook
```

### 2.4 Los 4 Tipos de Pruebas en Storybook

#### A. Pruebas Visuales y de Controles (Manuales)
Al abrir `http://localhost:6006`, selecciona un componente:
1. **Pestaña Controls:** Cambia props (`variant`, `size`, `children`, `disabled`) y observa el comportamiento visual en vivo.
2. **Barra de herramientas superior:** Prueba diferentes tamaños de pantalla (Mobile, Tablet, Desktop) y cambia entre temas claro/oscuro.

#### B. Pruebas de Accesibilidad (A11y)
El addon `@storybook/addon-a11y` está activo por defecto:
- Abre la pestaña **Accessibility** en el panel inferior.
- Detecta automáticamente si hay contraste insuficiente de colores, etiquetas faltantes (`aria-label`) o problemas para lectores de pantalla.

#### C. Pruebas de Interacción Automatizadas (Interaction Tests con `play`)
Permite simular eventos del usuario (clics, teclado) y evaluar aserciones directamente en el canvas de la historia.

**Ejemplo en `Button.stories.tsx`:**
```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    onClick: fn(), // Crea una función espía (mock)
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClickInteractionTest: Story = {
  args: {
    variant: 'primary',
    children: 'Haz Click Aquí',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Haz Click Aquí/i });

    // 1. Aserción: el botón existe y está habilitado
    await expect(button).toBeInTheDocument();
    await expect(button).toBeEnabled();

    // 2. Acción: el usuario hace clic
    await userEvent.click(button);

    // 3. Aserción: la función onClick fue ejecutada 1 vez
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
```
En la interfaz de Storybook, la pestaña **Interactions** mostrará la reproducción paso a paso con indicadores de éxito.

#### D. Pruebas en Línea de Comandos / CI (con Vitest)
Gracias a `@storybook/addon-vitest`, todas las historias con función `play` se pueden correr automáticamente en consola:
```bash
npx vitest run
```

---

## 3. Playwright: Pruebas End-to-End (E2E)

### 3.1 ¿Para qué sirve?
Playwright automatiza navegadores reales para validar que la aplicación funcione como un todo:
- Carga de rutas en Next.js App Router.
- Renderizado de componentes en el cliente y en el servidor.
- Interacción con la API de Laravel y respuestas HTTP.
- Detección de errores de consola y regresiones en flujos de usuario.

### 3.2 Configuración (`playwright.config.ts`)
- **Directorio de pruebas:** `frontend/e2e/`
- **Servidor integrado:** Playwright inicia automáticamente `npm run dev` en `http://localhost:3000` si no está corriendo.
- **Reportes:** Genera reportes HTML interactivos en caso de fallo, con capturas de pantalla y trazas del navegador.

### 3.3 Comandos de Playwright
Desde la carpeta `frontend/`:

```bash
# Ejecutar todas las pruebas E2E en modo headless
npm run test:e2e

# Abrir el modo interactivo con interfaz gráfica (UI Mode)
npm run test:e2e:ui

# Ejecutar las pruebas viendo el navegador abrirse (modo visual)
npm run test:e2e:headed

# Ver el último reporte HTML generado
npm run test:e2e:report
```

### 3.4 Cómo escribir una prueba E2E
Crea un archivo dentro de `frontend/e2e/`, por ejemplo `frontend/e2e/home.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('Página de Inicio', () => {
  test('debe cargar correctamente y verificar elementos clave', async ({ page }) => {
    // 1. Navegar a la ruta raíz
    await page.goto('/');

    // 2. Verificar títulos y contenido
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Task Flow Architecture');
    await expect(page.getByText('Full Stack Ready')).toBeVisible();

    // 3. Verificar estado de componentes
    await expect(page.getByText('Estado de Conexión con Laravel')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  });
});
```

---

## 4. Guía Rápida: Cómo crear un nuevo componente con pruebas

1. **Crear el componente:**
   * Crea una carpeta en `src/components/ui/input/Input.tsx`.
   * Exporta la interfaz de Props y el componente funcional.
2. **Crear la historia de Storybook:**
   * Crea `src/components/ui/input/Input.stories.tsx`.
   * Define historias para cada variante (`Default`, `WithLabel`, `WithError`, `Disabled`).
   * Agrega una historia con función `play` para probar escribir texto (`userEvent.type`).
3. **Re-exportar:**
   * Agrega el componente en `src/components/ui/index.ts` y `src/components/index.ts`.
4. **Verificar:**
   ```bash
   npm run storybook      # Verificar visualmente y probar en localhost:6006
   npm run lint           # Confirmar que no hay errores de linter
   npm run test:e2e       # Validar que los tests E2E sigan pasando
   ```

---

## 5. Resumen de Scripts en `package.json`

| Script | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia Next.js en modo desarrollo (`http://localhost:3000`) |
| `npm run build` | Compila la aplicación Next.js para producción |
| `npm run lint` | Ejecuta ESLint (incluyendo reglas de Next.js y Storybook) |
| `npm run storybook` | Inicia el taller interactivo de componentes (`http://localhost:6006`) |
| `npm run build-storybook` | Compila la documentación estática de Storybook |
| `npm run test:e2e` | Ejecuta los tests de Playwright en modo headless |
| `npm run test:e2e:ui` | Abre el panel visual de Playwright con time-travel y depuración |
| `npm run test:e2e:report` | Abre el reporte detallado HTML de Playwright |
