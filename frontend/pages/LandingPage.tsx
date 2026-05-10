import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  FileText,
  BrainCircuit,
  BarChart3,
  MessageSquareQuote,
  Zap,
  ChevronDown,
  Users,
  Star,
  Award,
  PenTool,
  BookOpen,
  Headphones,
  X,
  Calendar,
  RefreshCw,
  Calculator,
  Eye
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { useUser } from "../contexts/UserContext";
import { motion, Variants } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { GridBackground } from "@/components/ui/the-infinite-grid";
import { DashboardMockup } from "@/components/ui/DashboardMockup";
import { VocabularyShowcase } from "@/components/ui/VocabularyShowcase";
import { LandingCalculator } from "@/components/ui/LandingCalculator";
import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const faqs = [
  {
    question: "Can this replace an IELTS teacher?",
    answer: "NewBand acts as a 24/7 AI tutor. While a human teacher is great for specialized oral feedback or psychological support, NewBand's system handles the heavy lifting of evaluating essays against band descriptors, mapping out your daily study plan, and providing precise, instant feedback on every reading/listening mistake you make."
  },
  {
    question: "How accurate is the writing feedback?",
    answer: "Our AI is strictly trained on the official IELTS Public Band Descriptors. It evaluates your essays across all four criteria (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range) and gives you the exact reasons why you scored a specific band, along with line-by-line corrections."
  },
  {
    question: "How long does improvement take?",
    answer: "Students who follow their personalized roadmap consistently typically see a 0.5 to 1.0 band score improvement within 4 to 6 weeks, depending on their starting level and daily study hours."
  },
  {
    question: "Do I need to study every day?",
    answer: "Consistency is key. The roadmap is designed to adjust to your pace, but we recommend at least 30-45 minutes of daily practice to build the muscle memory needed for the IELTS exam formats."
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [isAfterVisible, setIsAfterVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950 overflow-clip font-sans selection:bg-blue-100">

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#06080e]/90 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <Logo className="w-10 h-10 text-blue-500 shadow-blue-500/20 group-hover:scale-105 transition-transform drop-shadow-md" />
              <span className="text-2xl font-black tracking-tight text-white">
                NewBand
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
              <AnimatedNavigationTabs
                items={[
                  { id: 'strategy', title: 'How it Works', href: '#strategy' },
                  { id: 'features', title: 'Features', href: '#features' },
                  { id: 'testimonials', title: 'Testimonials', href: '#testimonials' },
                  { id: 'pricing', title: 'Pricing', href: '#pricing' }
                ]}
              />
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden md:block text-sm font-semibold text-white/70 hover:text-white transition-colors">
                {user ? "Go to App" : "Sign In"}
              </Link>
              <Button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 font-semibold shadow-md transition-all hover:scale-105 border-none"
              >
                {user ? "Dashboard" : "Start Free"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <GridBackground>
          {/* --- 1. RESULT PROMISE (HERO) --- */}
          <section className="pt-10 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">

            <ContainerScroll
              titleComponent={
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="flex flex-col items-center mb-6"
                >
                  <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Your personal IELTS examiner — available 24/7</span>
                  </motion.div>

                  <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-2 leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400 animate-gradient-text">
                    Everything you need for IELTS.<br className="hidden md:block" />
                    One place.
                  </motion.h1>





                  <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mb-8">
                    <Button
                      size="lg"
                      onClick={() => navigate('/register')}
                      className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 rounded-lg px-8 h-14 text-lg font-black shadow-xl shadow-white/10 transition-all hover:scale-[1.03] group border-none"
                    >
                      Start Free — No Card Needed
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/preview')}
                      className="w-full sm:w-auto rounded-lg px-8 h-14 text-lg font-semibold border-white/20 bg-white/10 hover:bg-white hover:text-slate-900 transition-all text-white backdrop-blur-sm"
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      Explore Preview
                    </Button>
                  </motion.div>

                  {/* Social Proof Ticker */}
                  <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-400"><span className="font-bold text-white">500+</span> active students</span>
                    </div>
                    <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-slate-400"><span className="font-bold text-white">4.9/5</span> satisfaction</span>
                    </div>
                    <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-400">Avg. <span className="font-bold text-white">+1.0 band</span> in 6 weeks</span>
                    </div>
                  </motion.div>
                </motion.div>
              }
            >
              <div className="relative mx-auto max-w-5xl rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] bg-[#0c0e14] h-full">
                <DashboardMockup />
              </div>
            </ContainerScroll>
          </section>



          {/* --- 3. TRANSFORMATION SECTION --- */}
          <section className="py-20 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-stretch w-full relative">
                <motion.div
                  onViewportEnter={() => setIsAfterVisible(true)}
                  onViewportLeave={() => setIsAfterVisible(false)}
                  viewport={{ margin: "-250px 0px" }}
                  className="absolute top-1/2 left-0 w-full h-10 pointer-events-none z-0"
                />

                <motion.div
                  layout
                  animate={{ opacity: isAfterVisible ? 0.6 : 1, scale: isAfterVisible ? 0.98 : 1 }}
                  transition={{ layout: { type: "spring", stiffness: 45, damping: 14 }, duration: 0.6 }}
                  className={`p-8 rounded-lg bg-[#0f1118] border-[3px] border-rose-500/30 relative flex-shrink-0 origin-top md:origin-left z-10 overflow-hidden ${isAfterVisible ? 'md:w-[35%]' : 'md:w-full'}`}
                >
                  <div className="min-w-[280px]">
                    <div className="absolute top-3 right-3 w-8 h-8 rounded bg-rose-500/10 flex items-center justify-center">
                      <X className="w-5 h-5 text-rose-400" strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-black mb-6 text-slate-500">
                      Before
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-slate-500 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        Random practice testing
                      </li>
                      <li className="flex items-center gap-3 text-slate-500 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        No clear progression roadmap
                      </li>
                      <li className="flex items-center gap-3 text-slate-500 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        Generic answer keys
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  layout
                  animate={{ opacity: isAfterVisible ? 1 : 0, scale: isAfterVisible ? 1 : 0.95 }}
                  transition={{ layout: { type: "spring", stiffness: 45, damping: 14 }, duration: 0.6 }}
                  className={`rounded-lg bg-[#0f1118] border-emerald-500/80 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] flex-shrink-0 origin-bottom md:origin-right z-10 ${isAfterVisible ? 'w-full md:w-[65%] max-h-[1000px] p-8 border-[3px] mt-6 md:mt-0 md:ml-6' : 'w-full md:w-[0%] max-h-[0px] md:max-h-[1000px] p-0 border-[0px] mt-0 md:ml-0 md:p-0'}`}
                >
                  <div className="min-w-[280px] md:min-w-[500px] h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
                    <div className="absolute top-3 right-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider">
                        With NewBand
                      </div>
                    </div>
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-white relative z-10">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-500 text-white text-sm">✓</span>
                      After
                    </h3>
                    <ul className="space-y-4 relative z-10">
                      <li className="flex items-center gap-3 text-white font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" strokeWidth={3} />
                        Personalized daily study plan
                      </li>
                      <li className="flex items-center gap-3 text-white font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" strokeWidth={3} />
                        Detailed skill gap analysis
                      </li>
                      <li className="flex items-center gap-3 text-white font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" strokeWidth={3} />
                        Clear, predictable path to target band
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* --- 4. THE STRATEGY ENGINE --- */}
          <section id="strategy" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-clip scroll-mt-24">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2 hidden md:block z-0"></div>



            {/* Desktop Node Layout */}
            <div className="hidden lg:block relative w-full max-w-5xl mx-auto h-[600px] mt-16 z-10 font-sans">

              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* SVG Paths for Curved Connections */}
                <path d="M 220 200 C 400 200, 350 300, 500 300" fill="none" stroke="url(#lineGrad)" strokeWidth="3" />
                <path d="M 220 400 C 400 400, 350 300, 500 300" fill="none" stroke="url(#lineGrad)" strokeWidth="3" />
                <path d="M 500 300 C 650 300, 600 200, 780 200" fill="none" stroke="url(#lineGrad)" strokeWidth="3" />
                <path d="M 500 300 C 650 300, 600 400, 780 400" fill="none" stroke="url(#lineGrad)" strokeWidth="3" />

                {/* Animated Flow Dots */}
                <circle r="4" fill="#60a5fa" className="animate-[dash_3s_linear_infinite]">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 220 200 C 400 200, 350 300, 500 300" />
                </circle>
                <circle r="4" fill="#a78bfa" className="animate-[dash_3s_linear_infinite]">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 220 400 C 400 400, 350 300, 500 300" begin="1.5s" />
                </circle>
                <circle r="4" fill="#34d399" className="animate-[dash_3s_linear_infinite]">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 500 300 C 650 300, 600 200, 780 200" begin="0.5s" />
                </circle>
                <circle r="4" fill="#34d399" className="animate-[dash_3s_linear_infinite]">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 500 300 C 650 300, 600 400, 780 400" begin="2s" />
                </circle>
              </svg>

              {/* Center Node (The Strategy Engine) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="absolute top-[300px] left-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div className="w-48 h-48 rounded-full bg-slate-900 border-[8px] border-[#06080e] shadow-[0_0_80px_rgba(59,130,246,0.3)] flex items-center justify-center relative z-20 group cursor-default">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 rounded-full group-hover:scale-110 transition-transform duration-500 blur-md"></div>
                  <BrainCircuit className="w-20 h-20 text-white z-10 drop-shadow-lg transition-transform duration-300" />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-black text-white leading-tight tracking-tight">The Strategy<br />Engine</h3>
                </div>
              </motion.div>

              {/* Left Top Node (Diagnostic) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', bounce: 0.2, delay: 0.2 }}
                className="absolute top-[200px] left-[220px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#0a0c10] border-2 border-slate-700 flex items-center justify-center shadow-lg relative z-20 hover:border-orange-500 transition-all cursor-default group">
                  <Target className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="mt-4 text-center max-w-[180px]">
                  <h4 className="text-slate-300 font-bold mb-1 text-sm">Granular Diagnostic</h4>
                  <p className="text-xs text-slate-500">Extracts your true baseline</p>
                </div>
              </motion.div>

              {/* Left Bottom Node (Asymmetric Scoring) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', bounce: 0.2, delay: 0.3 }}
                className="absolute top-[400px] left-[220px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#0a0c10] border-2 border-slate-700 flex items-center justify-center shadow-lg relative z-20 hover:border-violet-500 transition-all cursor-default group">
                  <BarChart3 className="w-8 h-8 text-violet-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="mt-4 text-center max-w-[180px]">
                  <h4 className="text-slate-300 font-bold mb-1 text-sm">Asymmetric Scoring</h4>
                  <p className="text-xs text-slate-500">Mathematical path to target</p>
                </div>
              </motion.div>

              {/* Right Top Node (Living Roadmap) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', bounce: 0.2, delay: 0.4 }}
                className="absolute top-[200px] left-[780px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#0a0c10] border-2 border-slate-700 flex items-center justify-center shadow-lg relative z-20 hover:border-emerald-500 transition-all cursor-default group">
                  <Calendar className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="mt-4 text-center max-w-[180px]">
                  <h4 className="text-slate-300 font-bold mb-1 text-sm">Living Roadmap</h4>
                  <p className="text-xs text-slate-500">Dynamic weekly plan</p>
                </div>
              </motion.div>

              {/* Right Bottom Node (Instant Feedback) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', bounce: 0.2, delay: 0.5 }}
                className="absolute top-[400px] left-[780px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#0a0c10] border-2 border-slate-700 flex items-center justify-center shadow-lg relative z-20 hover:border-blue-500 transition-all cursor-default group">
                  <RefreshCw className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="mt-4 text-center max-w-[180px]">
                  <h4 className="text-slate-300 font-bold mb-1 text-sm">Instant Feedback</h4>
                  <p className="text-xs text-slate-500">Re-evaluates every action</p>
                </div>
              </motion.div>
            </div>

            {/* Mobile Fallback Layout */}
            <div className="flex flex-col lg:hidden gap-6 relative z-10 mt-12 pb-12">
              <div className="p-6 border-2 border-slate-700 bg-[#0a0c10] rounded-xl flex items-center gap-4 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Granular Diagnostic</h4>
                  <p className="text-xs text-slate-400">Extracts your true baseline</p>
                </div>
              </div>
              <div className="p-6 border-2 border-slate-700 bg-[#0a0c10] rounded-xl flex items-center gap-4 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-violet-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Asymmetric Scoring</h4>
                  <p className="text-xs text-slate-400">Mathematical path to hit your target band</p>
                </div>
              </div>
              <div className="p-6 border-2 border-blue-600 bg-blue-600/10 rounded-xl flex items-center gap-4 shadow-[0_0_20px_rgba(37,99,235,0.15)] my-2">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <BrainCircuit className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-black text-xl mb-1">Strategy Engine</h4>
                  <p className="text-xs text-blue-200">The core AI routing algorithm</p>
                </div>
              </div>
              <div className="p-6 border-2 border-slate-700 bg-[#0a0c10] rounded-xl flex items-center gap-4 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Living Roadmap</h4>
                  <p className="text-xs text-slate-400">Dynamic weekly plan that reprioritizes</p>
                </div>
              </div>
              <div className="p-6 border-2 border-slate-700 bg-[#0a0c10] rounded-xl flex items-center gap-4 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Instant Feedback</h4>
                  <p className="text-xs text-slate-400">Re-evaluates every action you take</p>
                </div>
              </div>
            </div>
          </section>

          {/* --- 4.5. INTERACTIVE CALCULATOR --- */}
          <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col items-center gap-12 text-center"
            >
              <div className="space-y-6 max-w-3xl">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Asymmetric Scoring</span>
                </motion.div>
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                  Build the ideal strategy for your target score.
                </motion.h2>
              </div>
              <motion.div variants={fadeInUp} className="w-full">
                <LandingCalculator />
              </motion.div>
            </motion.div>
          </section>

          {/* --- 5. PRODUCT DEMO SECTION --- */}
          <section className="py-24 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>



            <div className="max-w-6xl mx-auto">
              {/* Vocabulary Showcase UI */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <VocabularyShowcase />
              </motion.div>


            </div>
          </section>

          {/* --- 6. FEATURE SHOWCASE (Bento Grid) --- */}
          <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-clip scroll-mt-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-14">
                <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">See What's Inside</h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Real tools. Real feedback. Built to move your band score.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* CARD 1: Writing Evaluation — HERO (spans 2 cols) */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="md:col-span-2 p-8 rounded-xl bg-[#0f1118] border border-white/5 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-colors group relative overflow-hidden cursor-default">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <PenTool className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Writing Evaluation</span>
                      </div>
                      <h3 className="text-2xl font-black mb-3 text-white">Band-accurate grading in seconds</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        Submit any Task 1 or Task 2 essay and get instant, criterion-by-criterion feedback aligned with official IELTS Band Descriptors. See exactly where you lose marks and how to fix it.
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">Task 1 & Task 2</div>
                        <div className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">Band Descriptors</div>
                      </div>
                    </div>
                    {/* Mockup: Essay Score Card */}
                    <div className="w-full md:w-72 flex-shrink-0 rounded-lg bg-[#0a0c12] border border-white/5 p-5 relative">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500">Essay Score</span>
                        <span className="text-2xl font-black text-white">6.5</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "Task Response", score: 7.0, color: "bg-emerald-400", width: "87%" },
                          { label: "Coherence", score: 7.0, color: "bg-blue-400", width: "87%" },
                          { label: "Lexical Resource", score: 6.0, color: "bg-amber-400", width: "75%" },
                          { label: "Grammar", score: 6.0, color: "bg-rose-400", width: "75%" },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-slate-500 font-medium">{item.label}</span>
                              <span className="text-xs font-black text-white">{item.score}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5">
                              <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 rounded-md bg-blue-500/5 border border-blue-500/10">
                        <p className="text-[10px] text-blue-300 leading-relaxed">
                          <span className="font-bold text-blue-400">AI Feedback:</span> "Good use of cohesive devices. Consider varying sentence structures more to reach Band 7."
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CARD 2: AI Reading Tutor */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.03, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-colors group cursor-default">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Reading Tutor</span>
                  </div>
                  <h3 className="text-lg font-black mb-2 text-white">Alex explains every answer</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5">
                    Ask why an answer is wrong and get a detailed, passage-cited explanation.
                  </p>
                  {/* Mockup: Chat bubbles */}
                  <div className="space-y-2.5">
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-[9px] font-black text-slate-400">U</div>
                      <div className="px-3 py-2 rounded-lg rounded-tl-none bg-white/5 border border-white/5 text-xs text-slate-300 max-w-[85%]">
                        Why is Q3 "Not Given"?
                      </div>
                    </div>
                    <div className="flex gap-2 items-start justify-end">
                      <div className="px-3 py-2 rounded-lg rounded-tr-none bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 max-w-[85%]">
                        The passage mentions "increased productivity" but never states whether this led to higher salaries. Since there's no evidence for or against, it's <span className="font-bold text-emerald-400">Not Given</span>.
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-[9px] font-black text-emerald-400">AI</div>
                    </div>
                  </div>
                </motion.div>

                {/* CARD 3: Podcast Practice */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.03, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 transition-colors group cursor-default">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Headphones className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Podcast Practice</span>
                  </div>
                  <h3 className="text-lg font-black mb-2 text-white">Learn from real conversations</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5">
                    Watch curated BBC & English podcasts, then practice with comprehension exercises.
                  </p>
                  {/* Mockup: Mini player */}
                  <div className="rounded-lg bg-[#0a0c12] border border-white/5 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">6 Minute English: Inflation</p>
                        <p className="text-[10px] text-slate-500">BBC Learning English • 14 min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">2:34</span>
                      <div className="flex-1 h-1 rounded-full bg-white/5">
                        <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"></div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">14:00</span>
                    </div>
                  </div>
                </motion.div>

                {/* CARD 4: Reading Accuracy (spans 2 cols) */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="md:col-span-2 p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/5 transition-colors group cursor-default">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Reading Accuracy</span>
                      </div>
                      <h3 className="text-lg font-black mb-2 text-white">Track where you lose marks</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        See your accuracy broken down by question type. Focus your practice on exactly what needs work.
                      </p>
                    </div>
                    {/* Mockup: Accuracy bars */}
                    <div className="w-full md:w-80 flex-shrink-0 space-y-3">
                      {[
                        { label: "True / False / NG", accuracy: 85, color: "bg-emerald-400" },
                        { label: "Matching Headings", accuracy: 70, color: "bg-blue-400" },
                        { label: "Sentence Completion", accuracy: 60, color: "bg-amber-400" },
                        { label: "Multiple Choice", accuracy: 90, color: "bg-violet-400" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-500 font-medium w-36 text-right flex-shrink-0">{item.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/5">
                            <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.accuracy}%` }}></div>
                          </div>
                          <span className="text-xs font-black text-white w-8">{item.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* --- 6B. WRITING FEEDBACK DEEP-DIVE --- */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-14">
                <h2 className="text-3xl md:text-5xl font-black mb-2 text-white">Pro-grade writing feedback.</h2>
                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">Zero guesswork.</h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Every essay gets the same careful check an IELTS examiner would give — instantly.
                </p>
              </motion.div>

              {/* Top Row: 3 columns */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {/* Card 1: Instant Band Scoring */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-colors cursor-default">
                  <h3 className="text-lg font-black text-white mb-1">Instant Scoring</h3>
                  <p className="text-xs text-slate-500 mb-5">Band score in under 30 seconds.</p>
                  {/* Mockup: Speed list */}
                  <div className="rounded-lg bg-[#0a0c12] border border-white/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Submit Essay</span>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">⚡ Instant</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">AI Analysis</span>
                      <span className="text-[10px] font-medium text-blue-400">~10 sec</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Full Report</span>
                      <span className="text-[10px] font-medium text-blue-400">~25 sec</span>
                    </div>
                    <div className="h-px bg-white/5 my-1"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Your Band Score</span>
                      <span className="text-lg font-black text-white">7.0</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Criterion Breakdown */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-colors cursor-default">
                  <h3 className="text-lg font-black text-white mb-1">Criterion Breakdown</h3>
                  <p className="text-xs text-slate-500 mb-5">4 official IELTS criteria, scored separately.</p>
                  {/* Mockup: Rubric card */}
                  <div className="rounded-lg bg-[#0a0c12] border border-white/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white">Writing Rubric</span>
                      <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Task 2</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: "Task Response", score: 7, dot: "bg-emerald-400" },
                        { label: "Coherence & Cohesion", score: 7, dot: "bg-blue-400" },
                        { label: "Lexical Resource", score: 6, dot: "bg-amber-400" },
                        { label: "Grammar Range", score: 6, dot: "bg-rose-400" },
                      ].map((c) => (
                        <div key={c.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
                            <span className="text-[11px] text-slate-400">{c.label}</span>
                          </div>
                          <span className="text-xs font-black text-white">{c.score}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">AI-generated</span>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Error Heatmap */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-rose-500/20 hover:shadow-xl hover:shadow-rose-500/5 transition-colors cursor-default">
                  <h3 className="text-lg font-black text-white mb-1">Error Highlights</h3>
                  <p className="text-xs text-slate-500 mb-5">See mistakes right in your text.</p>
                  {/* Mockup: Highlighted text */}
                  <div className="rounded-lg bg-[#0a0c12] border border-white/5 p-4">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      The graph <span className="bg-rose-500/20 text-rose-300 px-1 rounded border-b border-rose-500/40">illustrate</span> that the number of students{' '}
                      <span className="bg-amber-500/20 text-amber-300 px-1 rounded border-b border-amber-500/40">was increased</span>{' '}
                      significantly between 2010 and 2020. Furthermore,{' '}
                      <span className="bg-blue-500/20 text-blue-300 px-1 rounded border-b border-blue-500/40">the data shows a upward</span>{' '}
                      trend in enrollment rates.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Grammar</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Tense</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Article</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row: 2 columns */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Card 4: Band 8 Rewrites */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 transition-colors cursor-default">
                  <h3 className="text-lg font-black text-white mb-1">Band 8 Rewrites</h3>
                  <p className="text-xs text-slate-500 mb-5">See how an examiner-level version of your paragraph looks.</p>
                  {/* Mockup: Before/After */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-[#0a0c12] border border-white/5 p-3">
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                        <span className="text-[9px] font-bold text-rose-400 uppercase">Your Version</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed line-through decoration-slate-700">
                        Many people think technology is bad for society because it makes people lazy.
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-[9px] font-bold text-emerald-400 uppercase">Band 8</span>
                      </div>
                      <p className="text-[10px] text-emerald-300/80 leading-relaxed">
                        A significant proportion of the population contend that technological advancement has had a deleterious impact on society, primarily by fostering sedentary lifestyles.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 5: Vocabulary & Grammar Insights */}
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 transition-colors cursor-default">
                  <h3 className="text-lg font-black text-white mb-1">Vocabulary & Grammar Insights</h3>
                  <p className="text-xs text-slate-500 mb-5">Pinpoints exactly which grammar rules and vocabulary gaps cost you marks.</p>
                  {/* Mockup: Insight tags */}
                  <div className="rounded-lg bg-[#0a0c12] border border-white/5 p-4 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Frequent Errors</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/15">Subject-verb agreement</span>
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/15">Article usage</span>
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/15">Passive voice overuse</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Upgrade Suggestions</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">"important" → "paramount"</span>
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">"a lot of" → "a considerable number of"</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* --- 6C. COMPETITOR COMPARISON --- */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-14">
                <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">Generic AI is a tool.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">NewBand is a training system.</span></h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Generic AI platforms are not designed specifically for IELTS. NewBand is purpose-built to give you structured practice, examiner-aligned feedback, and a clear roadmap to your target band.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="rounded-xl bg-[#0f1118] border border-white/5 shadow-2xl shadow-blue-500/5 overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="p-4 md:p-5"></div>
                    <div className="p-4 md:p-5 text-center border-l border-white/5">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                          <Logo className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-black text-white">NewBand</span>
                      </div>
                    </div>
                    <div className="p-4 md:p-5 text-center border-l border-white/5">
                      <span className="text-sm font-bold text-slate-400">Generic AI (ChatGPT)</span>
                    </div>
                    <div className="p-4 md:p-5 text-center border-l border-white/5">
                      <span className="text-sm font-bold text-slate-400">Traditional Courses</span>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {[
                    { feature: "Writing band evaluation (TR, CC, LR, GRA)", newband: "full", ai: "no", tutor: "full" },
                    { feature: "Essay error highlighting", newband: "full", ai: "no", tutor: "partial" },
                    { feature: "Band 8 rewrite examples", newband: "full", ai: "partial", tutor: "partial" },
                    { feature: "Reading answer explanation", newband: "✔ Passage-based", ai: "❌ Often vague", tutor: "full" },
                    { feature: "Mistake tracking by question type", newband: "full", ai: "no", tutor: "partial" },
                    { feature: "Personalized IELTS study roadmap", newband: "full", ai: "no", tutor: "partial" },
                    { feature: "Band progress tracking", newband: "full", ai: "no", tutor: "partial" },
                    { feature: "Unlimited essay evaluation", newband: "full", ai: "full", tutor: "no" },
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-4 ${i < 7 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
                      <div className="p-4 md:p-5 flex items-center">
                        <span className="text-xs md:text-sm text-slate-300 font-medium">{row.feature}</span>
                      </div>
                      {["newband", "ai", "tutor"].map((col) => {
                        const val = row[col as keyof typeof row];
                        return (
                          <div key={col} className="p-4 md:p-5 flex items-center justify-center border-l border-white/5 text-center">
                            {val === "full" ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              </div>
                            ) : val === "partial" ? (
                              <div className="w-5 h-0.5 rounded-full bg-amber-400/60"></div>
                            ) : val === "no" ? (
                              <span className="text-sm text-slate-600">✕</span>
                            ) : val.startsWith("✔") ? (
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 tracking-tight">{val.replace("✔ ", "")}</span>
                              </div>
                            ) : val.startsWith("❌") ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-sm text-slate-600 leading-none">✕</span>
                                <span className="text-[10px] sm:text-xs font-medium text-slate-500 tracking-tight">{val.replace("❌ ", "")}</span>
                              </div>
                            ) : (
                              <span className={`text-xs font-black ${col === "newband" ? "text-emerald-400" : "text-slate-400"}`}>{val}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.p variants={fadeInUp} className="text-center mt-6 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Full support</span>
                <span className="mx-3">·</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 rounded-full bg-amber-400/60 inline-block"></span> Limited</span>
                <span className="mx-3">·</span>
                <span className="inline-flex items-center gap-1.5"><span className="text-slate-600">✕</span> Not available</span>
              </motion.p>
            </motion.div>
          </section>

          {/* --- 7. TRUST & TESTIMONIALS --- */}
          <section id="testimonials" className="py-20 px-4 scroll-mt-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-14">
                <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">Students See Real Results</h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Hear from students who improved their bands with NewBand.
                </p>
              </motion.div>

              {/* Testimonial Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-14">
                <motion.div variants={fadeInUp} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    "I was stuck at Band 6 for months. NewBand's writing feedback showed me exactly where I was losing marks. Got 7.0 in just 5 weeks."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black">AK</div>
                    <div>
                      <p className="text-white text-sm font-bold">Aisha K.</p>
                      <p className="text-emerald-400 text-xs font-bold">Band 6.0 → 7.0</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    "The AI reading explanations are incredible. Instead of just 'wrong answer,' it teaches you the logic. My Reading jumped from 6.5 to 8.0."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-black">MR</div>
                    <div>
                      <p className="text-white text-sm font-bold">Marco R.</p>
                      <p className="text-blue-400 text-xs font-bold">Band 6.5 → 8.0</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="p-6 rounded-xl bg-[#0f1118] border border-white/5 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    "I used to spend hours deciding what to study. The daily roadmap removed all that stress. I just open the app and follow the plan."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-black">SL</div>
                    <div>
                      <p className="text-white text-sm font-bold">Sara L.</p>
                      <p className="text-amber-400 text-xs font-bold">Band 5.5 → 7.0</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Trust Badges Row */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-8 py-6 border-t border-b border-white/5">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-400 font-medium">Trained on official Band Descriptors</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-400 font-medium">Built for 6.5–7.5+ goals</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-400 font-medium">Academic & General Training</span>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* --- 8. PRICING SECTION --- */}
          <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl xl:max-w-[1400px] mx-auto relative scroll-mt-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-14"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4 text-white">Simple, Honest Pricing</motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-xl mx-auto">
                Start for free. Upgrade when you need more.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
            >
              {/* Free Tier */}
              <motion.div variants={fadeInUp} className="p-7 rounded-xl bg-[#0f1118] border border-white/5 flex flex-col hover:border-white/10 transition-colors">
                <h3 className="text-xl font-black mb-1 text-white">Free</h3>
                <p className="text-sm text-slate-500 mb-6">Get a taste of AI-powered IELTS prep.</p>
                <div className="mb-6 flex items-baseline">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-sm font-medium ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" /> 2 writing analyze</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" /> 10 reading messages</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" /> 2 video lessons</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" /> Access to all reading & listening tests</li>
                </ul>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 text-white rounded-lg h-12 font-bold hover:bg-white/10 transition-all"
                    onClick={() => navigate('/register')}
                  >
                    Get Started Free
                  </Button>
                </div>
              </motion.div>

              {/* Basic Tier */}
              <motion.div variants={fadeInUp} className="p-7 rounded-xl bg-[#0f1118] border border-white/5 flex flex-col hover:border-white/10 transition-colors">
                <h3 className="text-xl font-black mb-1 text-white">Basic</h3>
                <p className="text-sm text-slate-500 mb-6">See if the system works for you.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">79,000</span>
                  <span className="text-slate-500 text-sm font-medium"> UZS/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Personalized IELTS roadmap</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> 15 essay evaluations</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> 300 reading agent credits (1 credit = 1 message)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> All reading tests</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> All listening tests</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Limited podcast exercises</li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 text-white rounded-lg h-12 font-bold hover:bg-white/10 transition-all"
                  onClick={() => navigate('/register')}
                >
                  Start Basic
                </Button>
              </motion.div>

              {/* Pro Tier (Highlighted) */}
              <motion.div variants={fadeInUp} className="p-7 rounded-xl bg-[#0f1118] border-2 border-blue-500/40 flex flex-col relative ring-1 ring-blue-500/20 ring-offset-0 transform md:-translate-y-2 shadow-2xl shadow-blue-500/10 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md text-xs font-black uppercase tracking-wider">Most Popular</div>
                <h3 className="text-xl font-black mb-1 text-blue-400">Pro</h3>
                <p className="text-sm text-slate-400 mb-6">Serious prep for an upcoming test.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">149,000</span>
                  <span className="text-slate-500 text-sm font-medium"> UZS/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-white font-medium"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> Everything in Basic</li>
                  <li className="flex items-center gap-2 text-sm text-white font-medium"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> 40 essay evaluations</li>
                  <li className="flex items-center gap-2 text-sm text-white font-medium"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> 800 reading agent credits (1 credit = 1 message)</li>
                  <li className="flex items-center gap-2 text-sm text-white font-medium"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> Full podcast library</li>
                  <li className="flex items-center gap-2 text-sm text-white font-medium"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> Detailed band score breakdown</li>
                  <li className="flex items-center gap-2 text-sm text-white font-medium"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> Weak-area training</li>
                </ul>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg h-12 font-black shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] border-none"
                  onClick={() => navigate('/register')}
                >
                  Get Pro Now
                </Button>
              </motion.div>

              {/* Pro+ Tier */}
              <motion.div variants={fadeInUp} className="p-7 rounded-xl bg-[#0f1118] border border-white/5 flex flex-col hover:border-white/10 transition-colors">
                <h3 className="text-xl font-black mb-1 text-white">Pro+</h3>
                <p className="text-sm text-slate-500 mb-6">The ultimate unlimited system.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">249,000</span>
                  <span className="text-slate-500 text-sm font-medium"> UZS/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" /> Everything in Pro</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" /> 80 essay evaluations</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" /> Unlimited reading agent credits</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" /> Advanced feedback</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" /> Priority AI evaluation</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" /> Full mock exam simulation</li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 text-white rounded-lg h-12 font-bold hover:bg-white/10 transition-all"
                  onClick={() => navigate('/register')}
                >
                  Get Pro+
                </Button>
              </motion.div>
            </motion.div>
          </section>

          {/* --- 9. FAQ SECTION --- */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black mb-4 text-white">Frequently Asked Questions</motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-3"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="border border-white/5 bg-[#0f1118] rounded-lg overflow-hidden transition-colors hover:border-white/10"
                >
                  <button
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className={`text-sm font-bold transition-colors ${openFaq === index ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180 text-blue-400' : ''}`} />
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-5">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <p className="text-sm text-slate-500">Still have questions? <a href="mailto:support@newband.app" className="text-blue-400 hover:text-blue-300 font-medium">Get in touch</a></p>
            </motion.div>
          </section>

          {/* --- 10. FINAL CONVERSION SECTION --- */}
          <section className="py-24 px-4 relative overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center relative z-10"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-6 leading-tight text-white">
                Start Preparing Smarter.<br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Today.</span>
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                Join 500+ students who stopped guessing and started improving with a clear, data-driven study plan.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 rounded-lg px-10 h-14 text-lg font-black shadow-xl shadow-white/10 transition-all hover:scale-[1.03] group border-none"
                >
                  Take Your Free Diagnostic
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </section>
        </GridBackground>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-4 border-t border-white/5 bg-[#06080e] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-600">
              <Logo className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">NewBand</span>
          </div>
          <p className="mb-4 text-slate-500 text-sm">The AI-Powered IELTS Study System.</p>
          <p className="text-xs tracking-wider text-slate-600">© {new Date().getFullYear()} NewBand. All rights reserved.</p>
        </motion.div>
      </footer>
    </div>
  );
}
