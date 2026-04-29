import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: number | string;
  title: string;
  href?: string;
  icon?: React.ElementType;
};

type Props = {
  items: TabItem[];
};

export function AnimatedNavigationTabs({ items }: Props) {
  const [active, setActive] = useState<TabItem>(items[0]);
  const [isHover, setIsHover] = useState<TabItem | null>(null);

  const handleClick = (item: TabItem) => {
    setActive(item);
    if (item.href) {
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="relative">
        <ul className="flex items-center justify-center gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              className={cn("py-2 relative duration-300 transition-colors hover:!text-white",
              active.id === item.id ? "text-white" : "text-slate-300"
              )}
              onClick={() => handleClick(item)}
              onMouseEnter={() => setIsHover(item)}
              onMouseLeave={() => setIsHover(null)}
            >
              <div className="px-4 py-2 relative flex items-center gap-2">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{item.title}</span>
                {isHover?.id === item.id && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute bottom-0 left-0 right-0 w-full h-full bg-white/10"
                    style={{
                      borderRadius: 6,
                    }}
                  />
                )}
              </div>
              {active.id === item.id && (
                <motion.div
                  layoutId="active"
                  className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-blue-500"
                />
              )}
              {isHover?.id === item.id && (
                <motion.div
                  layoutId="hover"
                  className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-blue-500/50"
                />
              )}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}
