import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SkeuomorphicToggle = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
        relative w-12 h-12 rounded-full cursor-pointer
        flex items-center justify-center transition-all duration-500
        ${isDark
                    ? 'bg-[#1a1a1a] border-[#2a2a2a]'
                    : 'bg-[#e0e0e0] border-[#d0d0d0]'
                }
        border-2
      `}
            style={{
                boxShadow: isDark
                    ? 'inset 0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(255,255,255,0.05), 0 -1px 1px rgba(0,0,0,0.5)'
                    : 'inset 0 4px 8px rgba(255,255,255,0.7), 0 4px 10px rgba(0,0,0,0.15), 0 -1px 1px rgba(255,255,255,0.8)',
            }}
        >
            {/* Material Sheen */}
            <div className="absolute inset-0 pointer-events-none opacity-30 rounded-full overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${isDark ? 'bg-white/20' : 'bg-white/60'}`} />
                <div className={`absolute bottom-0 left-0 right-0 h-[1px] ${isDark ? 'bg-black/40' : 'bg-black/20'}`} />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
            </div>

            {/* Internal Glow / Bezel */}
            <div className="absolute inset-[2px] rounded-full border border-black/10 dark:border-white/5 pointer-events-none" />

            {/* Icon */}
            <motion.div
                animate={{
                    scale: 1,
                    filter: isDark
                        ? 'drop-shadow(0 0 8px #a5f3fc) drop-shadow(0 0 12px #22d3ee)'
                        : 'drop-shadow(0 0 0px transparent)',
                }}
                className="relative z-10"
            >
                {isDark ? (
                    <Sun className="h-6 w-6 text-[#a5f3fc]" fill="#a5f3fc" />
                ) : (
                    <Moon className="h-6 w-6 text-[#1a1a1a]" />
                )}
            </motion.div>

            {/* Reflection */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                <div
                    className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] rotate-[45deg] bg-gradient-to-r from-transparent via-white/5 to-transparent`}
                    style={{ opacity: isDark ? 0.1 : 0.4 }}
                />
            </div>
        </motion.button>
    );
};

export default SkeuomorphicToggle;
