import GlassCard from "@/components/GlassCard";
import { Lightbulb, Users, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-bold bg-gradient-to-r from-neon-cyan via-neon-green to-neon-yellow bg-clip-text text-transparent">
          О проекте
        </h1>
        <p className="text-sm text-muted-foreground">
          Современная платформа для изучения ПДД
        </p>
      </div>

      <GlassCard glowColor="cyan" className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="text-neon-cyan" size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-2">Наша миссия</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Drive Smart — интерактивный образовательный проект для школьников 14–17 лет. 
              Изучение ПДД должно быть увлекательным, а не скучным.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard glowColor="green" className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center flex-shrink-0">
            <Users className="text-neon-green" size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-2">Для кого</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Для подростков, готовящихся стать участниками дорожного движения. 
              Учим безопасности через игры и практику.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard glowColor="yellow" className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-neon-yellow/20 flex items-center justify-center flex-shrink-0">
            <Rocket className="text-neon-yellow" size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-2">Преимущества</h2>
            <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <li>• Интерактивные игры</li>
              <li>• Актуальные ПДД</li>
              <li>• Система достижений</li>
              <li>• Доступ с любого устройства</li>
              <li>• Реальные сценарии</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Проект развивается. Мы открыты к предложениям!
        </p>
      </GlassCard>
    </div>
  );
};

export default About;
