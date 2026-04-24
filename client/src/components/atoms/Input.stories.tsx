import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta: Meta<typeof Input> = {
    title: 'Atoms/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        error: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithValue: Story = {
    args: {
        value: 'Hello World',
    },
};

export const Error: Story = {
    args: {
        placeholder: 'Enter text...',
        error: true,
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter password...',
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'Disabled input',
        disabled: true,
    },
};
