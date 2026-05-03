import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';
import { useThemeStore } from '../store/themeStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['buyer', 'seller', 'admin'] as const),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const { login, isLoading, authError } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'buyer' },
  });
  const selectedRole = useWatch({ control, name: 'role' });

  const onSubmit = async (formData: LoginFormData) => {
    setSubmitError('');
    try {
      const loggedInUser = await login(formData.email, formData.password, formData.role as UserRole);
      const destination =
        loggedInUser.role === 'admin' ? '/admin' : loggedInUser.role === 'seller' ? '/dashboard' : '/buyer';
      navigate(destination);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setSubmitError(message.replace(/^Firebase:\s*/i, ''));
    }
  };

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const leftPanelBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const accentText = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const mutedText = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const strongText = isLight ? 'text-[#111827]' : 'text-white';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const inputBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5] text-[#111827] placeholder:text-[#9ca3af]' : 'bg-[#131313] border-[#2a2a2a] text-white placeholder:text-[#444]';
  const softBlock = isLight ? 'bg-[#eef0f4] border-[#d9dde5]' : 'bg-[#222] border-[#2a2a2a]';
  const sellerCard = isLight ? 'bg-[#e6f9ee] border-[#00b851]' : 'bg-[#0c1f14] border-[#00ff7a]';
  const ctaBg = isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]';

  return (
    <div className={`relative min-h-screen overflow-hidden ${shellBg}`}>
      <div className={`absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden lg:block ${leftPanelBg}`}>
        <div className={`absolute -left-[120px] top-[180px] h-[420px] w-[420px] rounded-full ${isLight ? 'bg-[#d7f5e2]' : 'bg-[#004026]'} opacity-45`} />
        <div className={`absolute left-[300px] top-[520px] h-[320px] w-[320px] rounded-full ${isLight ? 'bg-[#8be3b0]' : 'bg-[#1a804d]'} opacity-35`} />

        <div className="relative z-10 px-16 pt-14 text-white">
          <p className={`text-[38px] font-bold ${accentText}`}>BazaarPK</p>
          <p className={`mt-1 text-[13px] ${mutedText}`}>Pakistan ka apna trusted marketplace</p>

          <h1 className={`mt-28 max-w-[512px] text-[40px] font-bold leading-tight ${strongText}`}>
            Honouring Pakistan&apos;s craftsmanship.
          </h1>
          <p className={`mt-5 max-w-[512px] text-[16px] leading-7 ${mutedText}`}>
            Shop verified artisans, pay securely via JazzCash/EasyPaisa, and track every order
            end-to-end.
          </p>

          <div className="mt-8 grid max-w-[516px] grid-cols-3 gap-3">
            {[
              { title: 'Escrow Protected', subtitle: 'Funds held until delivery' },
              { title: 'Verified Sellers', subtitle: 'CNIC + NADRA check' },
              { title: '7-Day Returns', subtitle: 'No-questions guarantee' },
            ].map((feature) => (
              <div key={feature.title} className={`rounded-[10px] border p-3 ${softBlock}`}>
                <div className={`h-2 w-2 rounded ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'}`} />
                <p className={`mt-3 text-[12px] font-semibold ${strongText}`}>{feature.title}</p>
                <p className={`mt-1 text-[10px] ${mutedText}`}>{feature.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid max-w-[516px] grid-cols-3 gap-3">
            {[
              { value: '24k+', label: 'Active buyers' },
              { value: '500+', label: 'Verified sellers' },
              { value: '4.8', label: 'Avg rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`text-[40px] font-bold leading-none ${accentText}`}>{stat.value}</p>
                <p className={`mt-1 text-[11px] ${mutedText}`}>{stat.label}</p>
              </div>
            ))}
          </div>

          <p className={`mt-16 max-w-[512px] text-[26px] font-medium ${strongText}`}>
            &ldquo;BazaarPK brought my grandmother&apos;s embroidery work to 30 cities.&rdquo;
          </p>
          <p className={`mt-3 text-[12px] ${mutedText}`}>- Zainab Fatima, Lahore Fashion Co.</p>
        </div>
      </div>

      <div className="relative z-10 ml-auto w-full px-4 pb-8 pt-6 sm:px-8 lg:w-1/2 lg:px-20">
        <div className="flex items-center justify-end gap-3 text-[12px]">
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${isLight ? 'border-[#d9dde5] bg-[#eef0f4] text-[#00b851]' : 'border-[#2a2a2a] bg-[#222] text-[#00ff7a]'}`}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <span className={mutedText}>New to BazaarPK?</span>
          <Link to="/register" className={`font-semibold hover:underline ${accentText}`}>
            Create Account
          </Link>
        </div>

        <div className={`mx-auto mt-8 w-full max-w-[448px] rounded-2xl border p-8 ${cardBg}`}>
          <h2 className={`text-[42px] font-bold leading-none ${strongText}`}>Welcome back</h2>
          <p className={`mt-2 text-[13px] ${mutedText}`}>Sign in to continue your BazaarPK journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <p className={`mb-2 text-[10px] font-bold uppercase tracking-wide ${mutedText}`}>I am signing in as</p>
              <div className="grid grid-cols-3 gap-0">
                {(['buyer', 'seller', 'admin'] as const).map((role) => {
                  const active = selectedRole === role;
                  return (
                    <label key={role} className="cursor-pointer">
                      <input type="radio" value={role} {...register('role')} className="sr-only" />
                      <div
                        className={`h-11 border text-center text-[13px] ${active ? `${isLight ? 'border-2 border-[#00b851] bg-[#eef0f4] text-[#111827]' : 'border-2 border-[#00ff7a] bg-[#222] text-white'} font-semibold` : `${isLight ? 'border-[#d9dde5] text-[#6b7280]' : 'border-[#2a2a2a] text-[#9a9a9a]'} font-medium`} ${role === 'buyer' ? 'rounded-l-[8px]' : ''} ${role === 'admin' ? 'rounded-r-[8px]' : ''} flex items-center justify-center`}
                      >
                        {role[0].toUpperCase() + role.slice(1)}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="email" className={`mb-2 block text-[10px] font-bold uppercase tracking-wide ${mutedText}`}>
                Email or phone
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`h-12 w-full rounded-[8px] border px-4 text-[14px] outline-none transition ${inputBg} ${isLight ? 'focus:border-[#00b851]' : 'focus:border-[#00ff7a]'}`}
                placeholder="sara@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className={`text-[10px] font-bold uppercase tracking-wide ${mutedText}`}>
                  Password
                </label>
                <button type="button" className={`text-[11px] font-semibold ${accentText}`}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`h-12 w-full rounded-[8px] border px-4 pr-12 text-[14px] font-bold tracking-widest outline-none transition ${inputBg} ${isLight ? 'focus:border-[#00b851]' : 'focus:border-[#00ff7a]'}`}
                  placeholder="************"
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

            <label className={`flex cursor-pointer items-center gap-2 text-[12px] ${strongText}`}>
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(event) => setKeepSignedIn(event.target.checked)}
                className="h-4 w-4 rounded bg-[#00ff7a] accent-[#00ff7a]"
              />
              Keep me signed in for 30 days
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex h-[52px] w-full items-center justify-center rounded-[8px] text-[15px] font-bold transition hover:brightness-95 disabled:opacity-60 ${ctaBg}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className={`h-px flex-1 ${isLight ? 'bg-[#d9dde5]' : 'bg-[#2a2a2a]'}`} />
              <p className={`text-[11px] ${mutedText}`}>or continue with</p>
              <div className={`h-px flex-1 ${isLight ? 'bg-[#d9dde5]' : 'bg-[#2a2a2a]'}`} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'JazzCash', badge: 'J', bg: '#ff4033' },
                { label: 'EasyPaisa', badge: 'E', bg: '#33994d' },
                { label: 'Google', badge: 'G', bg: '#9a9a9a' },
              ].map((sso) => (
                <button
                  key={sso.label}
                  type="button"
                  className={`flex h-12 items-center justify-center gap-2 rounded-[8px] border text-[12px] font-semibold ${isLight ? 'border-[#d9dde5] bg-[#eef0f4] text-[#111827]' : 'border-[#2a2a2a] bg-[#222] text-white'}`}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: sso.bg }}>
                    {sso.badge}
                  </span>
                  {sso.label}
                </button>
              ))}
            </div>

            <div className={`rounded-[10px] border p-4 ${sellerCard}`}>
              <p className={`text-[13px] font-semibold ${strongText}`}>Are you an artisan or brand?</p>
              <p className={`mt-1 text-[12px] ${mutedText}`}>Open a verified seller store in 3 minutes.</p>
              <Link
                to="/register"
                className={`mt-3 flex h-8 items-center justify-center rounded-[6px] border text-[12px] font-semibold ${isLight ? 'border-[#00b851] text-[#00b851]' : 'border-[#00ff7a] text-[#00ff7a]'}`}
              >
                Become a Seller →
              </Link>
            </div>
          </form>

          {(submitError || authError) && (
            <p className="mt-3 text-center text-xs text-red-400">{submitError || authError}</p>
          )}
        </div>

        <p className={`mt-8 text-center text-[11px] ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>
          Privacy · Terms · Help · © 2026 BazaarPK
        </p>
      </div>
    </div>
  );
}
