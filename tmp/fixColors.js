const fs = require('fs');
let f = 'frontend/pages/VideoLesson.tsx';
let d = fs.readFileSync(f, 'utf8');

// Replace all instances of #020617 (slate-950) with #0F172A (slate-900)
d = d.replaceAll('#020617', '#0F172A');

// Except on the main <body> container which should be slate-950
d = d.replace('<div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] pb-32">',
    '<div className="min-h-screen bg-gray-50 dark:bg-[#020617] pb-32">');

fs.writeFileSync(f, d, 'utf8');
console.log('Fixed themes!');
