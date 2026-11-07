import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Botón Principal',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Botón Secundario',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Botón Contorno',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Eliminar Tarea',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Pequeño',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Grande',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Deshabilitado',
  },
};

/**
 * Ejemplo de prueba de interacción automatizada (Interaction Test).
 * Storybook ejecutará la función `play` simulando al usuario y comprobando las aserciones.
 */
export const ClickInteractionTest: Story = {
  args: {
    variant: 'primary',
    children: 'Haz Click Aquí',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Haz Click Aquí/i });

    // 1. Verifica que el botón esté presente y habilitado
    await expect(button).toBeInTheDocument();
    await expect(button).toBeEnabled();

    // 2. Simula el click del usuario
    await userEvent.click(button);

    // 3. Valida que el mock onClick fue ejecutado
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
