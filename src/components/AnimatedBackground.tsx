const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient - light theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f9fa] via-[#ffffff] to-[#f0f5f3]" />
      
      {/* Animated orbs - soft green tones */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/8 rounded-full blur-[120px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[140px] animate-pulse delay-2000" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating particles - green theme */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${10 + (i % 4)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
