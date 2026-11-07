import { test, expect } from '@playwright/test';

test.describe('Página Principal (Home)', () => {
  test('debe cargar la página de inicio y mostrar el título principal', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Task Flow Architecture');
    await expect(page.getByText('Full Stack Ready')).toBeVisible();
  });

  test('debe mostrar el componente de estado del backend', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Estado de Conexión con Laravel')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  });

  test('debe mostrar la información de arquitectura frontend y backend', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Frontend (Next.js)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Backend (Laravel)' })).toBeVisible();
  });
});
