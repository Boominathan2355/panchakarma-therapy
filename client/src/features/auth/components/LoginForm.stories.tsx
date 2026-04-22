import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { AuthProvider } from '../context/AuthContext';

const meta: Meta<typeof LoginForm> = {
  title: 'Features/Auth/LoginForm',
  component: LoginForm,
  decorators: [
    (Story) => {
      return (
        <AuthProvider>
          <BrowserRouter>
            <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
              <Story />
            </div>
          </BrowserRouter>
        </AuthProvider>
      );
    },
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};
