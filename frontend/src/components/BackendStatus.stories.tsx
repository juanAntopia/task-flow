import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BackendStatus } from './BackendStatus';

const meta = {
  title: 'Features/BackendStatus',
  component: BackendStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BackendStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
