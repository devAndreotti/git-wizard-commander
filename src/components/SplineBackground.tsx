import { Suspense, lazy } from 'react';

// Lazy load Spline para melhor performance
const Spline = lazy(() => import('@splinetool/react-spline'));

// Fallback component caso o Spline não carregue
const SplineFallback = () => (
  <div className="fixed inset-0 w-full h-full z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/10 via-cyber-blue/5 to-cyber-green/10" />
  </div>
);

export function SplineBackground() {
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
      {/* Overlay para melhorar legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-background/20 to-background/30 backdrop-blur-[0.3px] pointer-events-none" />
    </div>
  );
}