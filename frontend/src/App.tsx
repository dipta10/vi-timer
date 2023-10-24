import './App.css';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import Home from '@/pages/home/home.tsx';

function App() {
  return (
    <>
      <ModeToggle />
      <Home />
    </>
  );
}

export default App;
