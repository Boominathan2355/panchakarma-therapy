import type { Preview } from '@storybook/react-vite'
import '../src/index.css'
import '../src/App.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'light',
          value: '#f8fafc',
        },
      ],
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;