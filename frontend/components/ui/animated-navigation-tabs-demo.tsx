import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";
import { Home, Activity, Globe, Bot, Settings } from "lucide-react";

const ITEMS = [
  { id: 1, title: "Overview", icon: Home },
  { id: 2, title: "Activity", icon: Activity },
  { id: 3, title: "Domains", icon: Globe },
  { id: 4, title: "AI", icon: Bot },
  { id: 5, title: "Settings", icon: Settings },
];

export const AnimatedNavigationTabsDemo = () => (
    <div className="relative w-full h-96 flex flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-900 border border-white/10">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="High tech background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>
      <div className="z-10 relative bg-slate-950/50 backdrop-blur-md p-4 rounded-full border border-white/5">
        <AnimatedNavigationTabs items={ITEMS} />
      </div>
    </div>
);

export default AnimatedNavigationTabsDemo;
