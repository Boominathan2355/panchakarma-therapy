import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Atoms/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'success', 'warning', 'error', 'info'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {
        variant: 'default',
        children: 'Default',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
        children: 'Success',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        children: 'Warning',
    },
};

export const Error: Story = {
    args: {
        variant: 'error',
        children: 'Error',
    },
};

export const Info: Story = {
    args: {
        variant: 'info',
        children: 'Info',
    },
};
