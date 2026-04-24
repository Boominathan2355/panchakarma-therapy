import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta: Meta<typeof Card> = {
    title: 'Atoms/Card',
    component: Card,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: 'This is a standard card component.',
        title: 'Card Title',
    },
};

export const Glass: Story = {
    args: {
        children: 'This card uses the premium glassmorphism effect.',
        title: 'Glass Card',
        glass: true,
    },
};

export const WithAction: Story = {
    args: {
        children: 'Card with a header action button.',
        title: 'Settings',
        action: <button style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer' }}>Edit</button>,
    },
};
