import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate individual field
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email обязателен для заполнения';
        if (!emailRegex.test(value)) return 'Введите корректный email адрес';
        return undefined;
      
      case 'password':
        if (!value) return 'Пароль обязателен для заполнения';
        if (value.length < 6) return 'Пароль должен содержать минимум 6 символов';
        return undefined;
      
      case 'confirmPassword':
        if (!value) return 'Подтверждение пароля обязательно';
        if (value !== formData.password) return 'Пароли не совпадают';
        return undefined;
      
      default:
        return undefined;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };

  // Handle input blur - validate field
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    const error = validateField(fieldName, value);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);

    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  // Check if form is valid whenever form data changes
  useEffect(() => {
    const hasAllFields = formData.email && formData.password && formData.confirmPassword;
    const hasNoErrors = !Object.values(errors).some(error => error !== undefined);
    const passwordsMatch = formData.password === formData.confirmPassword;
    const emailValid = emailRegex.test(formData.email);
    const passwordValid = formData.password.length >= 6;
    
    setIsFormValid(
      !!hasAllFields && 
      hasNoErrors && 
      passwordsMatch && 
      emailValid && 
      passwordValid
    );
  }, [formData, errors, emailRegex]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerMessage(null);
    setServerError(null);
    
    try {
      const resp = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await resp.json();

      if (data?.success) {
        setServerMessage('Регистрация успешна');
        console.log({ email: formData.email, password: formData.password });
        setFormData({ email: '', password: '', confirmPassword: '' });
      } else {
        const msg = typeof data?.message === 'string' ? data.message : '';
        const exists = msg.toLowerCase().includes('существу');
        setServerError(exists ? 'Такой аккаунт уже существует' : (msg || 'Произошла ошибка при регистрации'));
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setServerError('Произошла ошибка при регистрации');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Регистрация
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Создайте аккаунт, чтобы начать изучение IELTS
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                aria-invalid={!!errors.email}
                className={errors.email ? 'border-red-500 focus-visible:border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Пароль <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                aria-invalid={!!errors.password}
                className={errors.password ? 'border-red-500 focus-visible:border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Подтверждение пароля <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                aria-invalid={!!errors.confirmPassword}
                className={errors.confirmPassword ? 'border-red-500 focus-visible:border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={!isFormValid || isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>

          {/* Additional Info */}
          {serverMessage && (
            <div className="mt-4 text-green-600 text-sm">{serverMessage}</div>
          )}
          {serverError && (
            <div className="mt-4 text-red-600 text-sm">{serverError}</div>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Войти
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
