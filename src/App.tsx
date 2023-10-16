import './App.css';
import { Button } from '@/components/ui/button.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import Home from '@/pages/home/home.tsx';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Button>This is a button</Button>
        <ModeToggle />
        <Home />
      </ThemeProvider>
    </>
  );
}

export default App;
