import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import CalculatorErrorBoundary from './components/CalculatorErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CalculatorErrorBoundary message="Não foi possível carregar a página. Tente novamente."><App /></CalculatorErrorBoundary>
  </StrictMode>,
);
