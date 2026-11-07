import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './Card';
import { Button } from '../button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Tarjeta de Tarea',
    subtitle: 'Detalles de la asignación y progreso',
    children: (
      <div className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Esta es una tarjeta de ejemplo creada con Tailwind CSS y documentada en Storybook.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">Cancelar</Button>
          <Button variant="primary" size="sm">Guardar</Button>
        </div>
      </div>
    ),
  },
};

export const WithoutHeader: Story = {
  args: {
    children: (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Tarjeta simple de contenido sin encabezado ni subtítulo.
      </p>
    ),
  },
};
