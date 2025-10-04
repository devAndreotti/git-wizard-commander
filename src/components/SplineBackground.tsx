import { Suspense, lazy, useEffect, useState } from 'react';

// Lazy load Spline para melhor performance
const Spline = lazy(() => import('@splinetool/react-spline'));

// Fallback leve com gradiente animado
const SplineFallback = () => (
  <div className="fixed inset-0 w-full h-full z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/10 via-cyber-blue/5 to-cyber-green/10 animate-pulse" />
  </div>
);

// Background leve para mobile (apenas gradiente, sem Spline)
const LightweightBackground = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/20 via-cyber-blue/10 to-cyber-green/15" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
  </div>
);

export function SplineBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);

  useEffect(() => {
    // Detecta se é mobile ou tela pequena
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // Só carrega Spline em desktop após um delay para melhorar performance inicial
      if (!mobile) {
        setTimeout(() => setShouldLoadSpline(true), 1000);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: retorna background leve sem Spline
  if (isMobile) {
    return <LightweightBackground />;
  }

  // Desktop: retorna Spline (com delay no carregamento)
  if (!shouldLoadSpline) {
    return <SplineFallback />;
  }

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Suspense fallback={<SplineFallback />}>
        <Spline
          scene="https://prod.spline.design/a5xDaxCOqoFJXisD/scene.splinecode"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'auto',
          }}
          onLoad={() => console.log('Spline loaded successfully')}
          onError={(error) => {
            console.warn('Spline failed to load:', error);
          }}
        />
      </Suspense>
      {/* Overlay leve para melhorar legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/5 via-background/10 to-background/15 pointer-events-none" />
    </div>
  );
}