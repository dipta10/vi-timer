import './App.css';
import { Button } from '@/components/ui/button.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { ModeToggle } from '@/components/mode-toggle.tsx';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Button>This is a button</Button>
        <ModeToggle />
      </ThemeProvider>
    </>
  );
}

export default App;
