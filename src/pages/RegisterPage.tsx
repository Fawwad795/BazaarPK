import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';
import { useThemeStore } from '../store/themeStore';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['buyer', 'seller'] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register: authRegister, isLoading, authError } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'buyer' },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setSubmitError('');
    try {
      await authRegister(
        formData.name,
        formData.email,
        formData.password,
        formData.role as UserRole
      );
      navigate(formData.role === 'seller' ? '/seller/onboarding' : '/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not create account.';
      setSubmitError(message.replace(/^Firebase:\s*/i, ''));
    }
  };

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const inputBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5] text-[#111827] placeholder:text-[#9ca3af]' : 'bg-[#131313] border-[#2a2a2a] text-white placeholder:text-[#444]';
  const mutedText = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const strongText = isLight ? 'text-[#111827]' : 'text-white';
  const accentText = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const ctaBg = isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]';
  const roleBase = isLight ? 'bg-[#eef0f4]' : 'bg-[#222]';

  return (
    <div className={`relative flex min-h-screen flex-col overflow-hidden ${shellBg}`}>
      <div className={`absolute -left-[150px] top-[-100px] h-[400px] w-[400px] rounded-full ${isLight ? 'bg-[#d7f5e2]' : 'bg-[#004026]'} opacity-35`} />

      <header className={`relative z-10 border ${topBarBg}`}>
        <div className="mx-auto flex h-[60px] max-w-[1280px] items-center px-8">
          <Link to="/" className={`text-[20px] font-bold ${accentText}`}>
            BazaarPK
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${isLight ? 'border-[#d9dde5] bg-[#eef0f4] text-[#00b851]' : 'border-[#2a2a2a] bg-[#222] text-[#00ff7a]'}`}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/login" className={`text-[13px] font-medium ${accentText}`}>
              Sign In →
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className={`w-full max-w-[480px] rounded-2xl border p-8 ${cardBg}`}>
          <h1 className={`text-[42px] font-bold leading-none ${strongText}`}>Create an Account</h1>
          <p className={`mt-2 text-[14px] ${mutedText}`}>Join BazaarPK - buy, sell and grow.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className={`grid h-[40px] grid-cols-2 overflow-hidden rounded-[8px] ${roleBase}`}>
              {(['buyer', 'seller'] as const).map((role) => (
                <label key={role} className="cursor-pointer">
                  <input type="radio" value={role} {...register('role')} className="peer sr-only" />
                  <div className={`flex h-full items-center justify-center text-[14px] font-medium transition ${mutedText} ${isLight ? 'peer-checked:bg-[#00b851] peer-checked:text-[#f7f8fa]' : 'peer-checked:bg-[#00ff7a] peer-checked:text-[#0d0d0d]'} peer-checked:font-semibold`}>
                    {role === 'buyer' ? 'Buyer' : 'Seller'}
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label htmlFor="name" className={`mb-2 block text-[11px] font-medium uppercase ${mutedText}`}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`h-[44px] w-full rounded-[8px] border px-4 text-[13px] outline-none ${inputBg} ${isLight ? 'focus:border-[#00b851]' : 'focus:border-[#00ff7a]'}`}
                placeholder="e.g. Sara Ahmed"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="register-email" className={`mb-2 block text-[11px] font-medium uppercase ${mutedText}`}>
                Email or Phone
              </label>
              <input
                id="register-email"
                type="email"
                {...register('email')}
                className={`h-[44px] w-full rounded-[8px] border px-4 text-[13px] outline-none ${inputBg} ${isLight ? 'focus:border-[#00b851]' : 'focus:border-[#00ff7a]'}`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="register-password" className={`mb-2 block text-[11px] font-medium uppercase ${mutedText}`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`h-[44px] w-full rounded-[8px] border px-4 pr-10 text-[13px] outline-none ${inputBg} ${isLight ? 'focus:border-[#00b851]' : 'focus:border-[#00ff7a]'}`}
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${mutedText}`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirm-password" className={`mb-2 block text-[11px] font-medium uppercase ${mutedText}`}>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                {...register('confirmPassword')}
                className={`h-[44px] w-full rounded-[8px] border px-4 text-[13px] outline-none ${inputBg} ${isLight ? 'focus:border-[#00b851]' : 'focus:border-[#00ff7a]'}`}
                placeholder="********"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 flex h-[48px] w-full items-center justify-center rounded-[8px] text-[15px] font-semibold transition hover:brightness-95 disabled:opacity-60 ${ctaBg}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account  →'
              )}
            </button>
          </form>

          {(submitError || authError) && (
            <p className="mt-3 text-center text-xs text-red-400">{submitError || authError}</p>
          )}

          <p className={`mt-5 text-center text-[13px] font-medium ${accentText}`}>
            Already have an account?{' '}
            <Link to="/login" className="underline-offset-2 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <footer className={`relative z-10 border ${topBarBg}`}>
        <p className={`py-4 text-center text-[12px] ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>
          © 2026 BazaarPK - Honouring Pakistan&apos;s Craftsmanship
        </p>
      </footer>
    </div>
  );
}
