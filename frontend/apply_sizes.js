
const fs = require("fs");
const file = "c:/Users/Honor/Desktop/Новая папка (4)/Ai-Ielts-26-october/frontend/pages/ReadingPractice.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /const \[textSize, setTextSize\] = useState<TextSizeOption>[\s\S]*?const textSizeRef = useRef<HTMLDivElement>\(null\);/g,
  `const [textSize, setTextSize] = useState<TextSizeOption>(() => {
    const saved = localStorage.getItem("reading-text-size");
    return (saved === "large" || saved === "extra-large") ? saved : "regular";
  });
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const textSizeRef = useRef<HTMLDivElement>(null);

  const getQuestionTextSize = () => {
    if (textSize === "large") return "text-lg prose-lg leading-relaxed";
    if (textSize === "extra-large") return "text-xl prose-xl leading-relaxed";
    return "text-base prose-base leading-relaxed";
  };
  const getRadioSizeClass = () => {
    if (textSize === "large") return "h-6 w-6";
    if (textSize === "extra-large") return "h-7 w-7";
    return "h-5 w-5";
  };
  const getLabelSizeClass = () => {
    if (textSize === "large") return "text-lg font-medium leading-relaxed";
    if (textSize === "extra-large") return "text-xl font-medium leading-relaxed";
    return "text-base font-medium leading-relaxed";
  };`
);

code = code.replace(/className="h-5 w-5"/g, "className={getRadioSizeClass()}");
code = code.replace(/className="text-base font-medium cursor-pointer leading-relaxed"/g, "className={`${getLabelSizeClass()} cursor-pointer`}");
code = code.replace(/className="text-base font-medium leading-relaxed cursor-pointer"/g, "className={`${getLabelSizeClass()} cursor-pointer`}");
code = code.replace(/className={\`text-base font-medium leading-relaxed cursor-pointer \${isUsedElsewhere \? 'text-red-500 line-through opacity-50' : '}\`}/g, "className={`${getLabelSizeClass()} cursor-pointer ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : '}`}");

fs.writeFileSync(file, code, "utf8");
console.log("Done");

