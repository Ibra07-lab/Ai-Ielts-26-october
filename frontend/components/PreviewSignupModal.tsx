import { useNavigate } from "react-router-dom";
import { X, Lock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function PreviewSignupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="relative w-[90%] max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create your free account</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Start practicing, save your progress, and unlock NewBand's IELTS preparation system.</p>
          <div className="space-y-3 pt-2">
            <Button onClick={() => nav("/register")} className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/20 border-none">
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={onClose} variant="ghost" className="w-full h-11 text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium">
              Continue Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
