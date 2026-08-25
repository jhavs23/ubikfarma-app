import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import './index.css';

// ✅ 1. Configurar Amplify ANTES de importar cualquier componente que lo use
Amplify.configure(awsExports);

// ✅ 2. Importar App dinámicamente DESPUÉS de la configuración
import('./App.jsx').then(({ default: App }) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});