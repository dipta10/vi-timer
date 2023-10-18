import './App.css';
import { Button } from '@/components/ui/button.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import Home from '@/pages/home/home.tsx';
import { HotkeysProvider } from 'react-hotkeys-hook';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <HotkeysProvider initiallyActiveScopes={['todo-list']}>
          <Button>This is a button</Button>
          <ModeToggle />
          <Home />
        </HotkeysProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
