import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/Logo";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { DotMap } from "./travel-connect-signin";

export const SignUpCard = () => {
  const { signUp } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return undefined;
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return undefined;
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const hasAllFields = email && password && confirmPassword;
    const hasNoErrors = !Object.values(errors).some(error => error !== undefined);
    const passwordsMatch = password === confirmPassword;
    const emailValid = emailRegex.test(email);
    const passwordValid = password.length >= 6;
    setIsFormValid(!!hasAllFields && hasNoErrors && passwordsMatch && emailValid && passwordValid);
  }, [email, password, confirmPassword, errors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "email" | "password" | "confirmPassword") => {
    const value = e.target.value;
    if (fieldName === "email") setEmail(value);
    if (fieldName === "password") setPassword(value);
    if (fieldName === "confirmPassword") setConfirmPassword(value);
    
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>, fieldName: "email" | "password" | "confirmPassword") => {
    const value = e.target.value;
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    newErrors.email = validateField('email', email);
    newErrors.password = validateField('password', password);
    newErrors.confirmPassword = validateField('confirmPassword', confirmPassword);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    setServerError(null);

    const { error } = await signUp(email, password);

    if (error) {
      setServerError(error);
      setIsSubmitting(false);
    } else {
      setSuccessMessage('Account created successfully! Redirecting...');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsSubmitting(false);
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl overflow-hidden rounded-2xl flex bg-white text-slate-900 shadow-2xl border border-slate-200"
      >
        {/* Left side - Map */}
        <div className="hidden md:block w-1/2 min-h-[650px] relative overflow-hidden border-r border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50">
            <DotMap />

            {/* Logo and text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-10 bg-white/30 backdrop-blur-[2px]">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-8"
              >
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Logo className="text-white h-10 w-10" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-4xl font-black mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight drop-shadow-sm"
              >
                NewBand
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-base text-center text-slate-600 max-w-xs font-medium leading-relaxed"
              >
                Create an account to start your IELTS preparation journey today
              </motion.p>
            </div>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-slate-900">Create Account</h1>
            <p className="text-slate-500 mb-8 text-lg">Join us and start your journey</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {successMessage}
                </div>
              )}
              {serverError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
                  {serverError}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-blue-600">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(e, "email")}
                  onBlur={(e) => handleInputBlur(e, "email")}
                  placeholder="Enter your email address"
                  required
                  className={`bg-slate-50 border-slate-200 placeholder:text-slate-400 text-slate-900 w-full h-12 px-4 shadow-sm focus-visible:ring-blue-500 ${errors.email ? 'border-rose-500' : ''}`}
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleInputChange(e, "password")}
                    onBlur={(e) => handleInputBlur(e, "password")}
                    placeholder="Min. 6 characters"
                    required
                    className={`bg-slate-50 border-slate-200 placeholder:text-slate-400 text-slate-900 w-full h-12 px-4 shadow-sm pr-12 focus-visible:ring-blue-500 ${errors.password ? 'border-rose-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(e, "confirmPassword")}
                    onBlur={(e) => handleInputBlur(e, "confirmPassword")}
                    placeholder="Repeat your password"
                    required
                    className={`bg-slate-50 border-slate-200 placeholder:text-slate-400 text-slate-900 w-full h-12 px-4 shadow-sm pr-12 focus-visible:ring-blue-500 ${errors.confirmPassword ? 'border-rose-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  >
                    {isConfirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={cn(
                    "w-full bg-gradient-to-r relative overflow-hidden from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-xl transition-all duration-300 h-12 shadow-md shadow-blue-500/20 border-none font-semibold text-base",
                    isHovered && isFormValid && !isSubmitting ? "shadow-lg shadow-blue-500/30" : "",
                    (!isFormValid || isSubmitting) ? "opacity-70 cursor-not-allowed" : ""
                  )}
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </span>
                  {isHovered && isFormValid && !isSubmitting && (
                    <motion.span
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ filter: "blur(8px)" }}
                    />
                  )}
                </Button>
              </motion.div>

              <div className="flex items-center justify-center mt-6">
                <span className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default function TravelConnectSignUp() {
  return (
    <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center bg-slate-100 p-4 sm:p-8 font-sans selection:bg-blue-500/30 overflow-y-auto">
      <SignUpCard />
    </div>
  );
}
