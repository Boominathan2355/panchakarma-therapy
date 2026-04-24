import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning'],
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large', 'icon'],
        },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline Button',
    },
};

export const Danger: Story = {
    args: {
        variant: 'danger',
        children: 'Danger Button',
    },
};

export const Loading: Story = {
    args: {
        variant: 'primary',
        children: 'Loading...',
        isLoading: true,
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        children: 'Large Button',
    },
};

export const Small: Story = {
    args: {
        size: 'small',
        children: 'Small Button',
    },
};
