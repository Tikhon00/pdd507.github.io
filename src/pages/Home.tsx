import AnimatedBackground from "@/components/AnimatedBackground";
import { Car, Sparkles } from "lucide-react";

const Home = () => {
  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] space-y-8 animate-fade-in">
        {/* Hero Section - Simplified */}
        <div className="text-center space-y-8">
          {/* Animated Logo/Icon */}
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2rem] glass-strong neon-glow-green animate-scale-in">
            <Car className="text-primary animate-pulse" size={64} />
          </div>
          
          {/* Brand Name */}
          <div className="space-y-3">
            <h1 className="font-bold animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Drive Smart
              </span>
            </h1>
            
            {/* Slogan */}
            <p className="text-2xl font-semibold text-foreground px-4 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Играй. Учись.<br />Водить безопасно!
            </p>
          </div>
        </div>

        {/* Animated Traffic Light Illustration */}
        <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center animate-pulse bg-red-500/20">
            <div className="w-10 h-10 rounded-full bg-red-500/40" />
          </div>
          <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center animate-pulse bg-yellow-500/20" style={{ animationDelay: '0.5s' }}>
            <div className="w-10 h-10 rounded-full bg-yellow-500/40" />
          </div>
          <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center animate-pulse bg-primary/30" style={{ animationDelay: '1s' }}>
            <div className="w-10 h-10 rounded-full bg-primary/50 neon-glow-green" />
          </div>
        </div>

        {/* Decorative Element */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Sparkles size={16} className="text-accent" />
          <span>Современный формат обучения ПДД от школы №507</span>
          <Sparkles size={16} className="text-accent" />
        </div>
      </div>
    </>
  );
};

export default Home;
