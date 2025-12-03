import React from 'react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import VerificationBox from '@/components/VerificationBox';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Verifica - Verifica la autenticidad del contenido digital en segundos</title>
        <meta name="description" content="Analiza enlaces, imágenes y videos para verificar la autenticidad del contenido digital. Detecta contenido generado por IA y posibles manipulaciones." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <Hero />
        <VerificationBox />
        <Toaster />
      </div>
    </>
  );
}

export default App;