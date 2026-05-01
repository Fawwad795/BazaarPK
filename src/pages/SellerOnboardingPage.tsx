import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2,
  Upload,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  BadgeCheck,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { trackEvent } from '../lib/analytics';
import { useThemeStore } from '../store/themeStore';

const storeSchema = z.object({
  storeName: z.string().min(3, 'Store name must be at least 3 characters'),
  storeDescription: z.string().min(20, 'Description must be at least 20 characters'),
  phone: z.string().regex(/^\+92-?\d{3}-?\d{7}$/, 'Enter valid Pakistani phone (e.g. +92-300-1234567)'),
  city: z.string().min(2, 'City is required'),
  province: z.enum(['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'GB']),
});

const verificationSchema = z.object({
  cnicNumber: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, 'Enter valid CNIC (e.g. 35201-1234567-1)'),
  cnicFront: z.string().min(1, 'CNIC front image is required'),
  cnicBack: z.string().min(1, 'CNIC back image is required'),
  ntnNumber: z.string().optional(),
});

const bankSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountTitle: z.string().min(3, 'Account title is required'),
  accountNumber: z.string().min(10, 'Enter valid account/IBAN number'),
  branchCode: z.string().optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;
type BankFormData = z.infer<typeof bankSchema>;

const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'GB'] as const;
const banks = [
  'HBL', 'UBL', 'MCB', 'Allied Bank', 'Bank Alfalah', 'Meezan Bank',
  'Standard Chartered', 'Faysal Bank', 'Askari Bank', 'Bank of Punjab',
  'JazzCash', 'EasyPaisa', 'SadaPay', 'NayaPay',
];

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cnicFrontPreview, setCnicFrontPreview] = useState('https://api.dicebear.com/7.x/shapes/svg?seed=cnic-front-demo');
  const [cnicBackPreview, setCnicBackPreview] = useState('https://api.dicebear.com/7.x/shapes/svg?seed=cnic-back-demo');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const storeForm = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: 'Lahore Handicrafts Studio',
      storeDescription:
        'Premium handcrafted decor and textile products made by local artisans in Lahore.',
      phone: '+92-300-1234567',
      city: 'Lahore',
      province: 'Punjab',
    },
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      cnicNumber: '35201-1234567-1',
      cnicFront: 'https://api.dicebear.com/7.x/shapes/svg?seed=cnic-front-demo',
      cnicBack: 'https://api.dicebear.com/7.x/shapes/svg?seed=cnic-back-demo',
      ntnNumber: '1234567-8',
    },
  });

  const bankForm = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankName: 'Meezan Bank',
      accountTitle: 'Fawwad Ahmed',
      accountNumber: 'PK36SCBL0000001123456702',
      branchCode: '0001',
    },
  });

  const handleStoreSubmit = () => {
    storeForm.handleSubmit(() => {
      void trackEvent('seller_onboarding_step_completed', { step: 'store_details' });
      setCurrentStep(2);
    })();
  };

  const handleVerificationSubmit = () => {
    verificationForm.handleSubmit(() => {
      void trackEvent('seller_onboarding_step_completed', { step: 'identity_verification' });
      setCurrentStep(3);
    })();
  };

  const handleBankSubmit = () => {
    bankForm.handleSubmit(async () => {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      await trackEvent('seller_onboarding_completed', { seller_id: user?.id || 'unknown' });
      setCurrentStep(4);
    })();
  };

  const simulateFileUpload = (
    field: 'cnicFront' | 'cnicBack',
    setPreview: (val: string) => void
  ) => {
    const mockUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${field}-${Date.now()}`;
    verificationForm.setValue(field, mockUrl);
    setPreview(mockUrl);
  };

  const isLight = !isDarkMode;
  const inputClass = `w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
    isLight
      ? 'border-[#d9dde5] bg-[#f3f5f8] text-[#111827] focus:border-[#00b851] focus:ring-[#00b851]/20'
      : 'border-[#2a2a2a] bg-[#131313] text-white focus:border-[#00ff7a] focus:ring-[#00ff7a]/20'
  }`;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const barBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const stepLine = isLight ? 'bg-[#d9dde5]' : 'bg-[#2a2a2a]';

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${barBg}`}>
        <div className="mx-auto flex h-16 max-w-[1280px] items-center px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-3 text-[14px] ${titleColor}`}>Seller Setup</p>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${
                isLight ? 'border-[#d9dde5] bg-[#eef0f4] text-[#00b851]' : 'border-[#2a2a2a] bg-[#222] text-[#00ff7a]'
              }`}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className={`text-[13px] ${subColor}`}>
              Save & Exit
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className={`mt-2 text-5xl font-bold tracking-tight ${titleColor}`}>Open Your BazaarPK Store</h1>
          <p className={`mt-1 text-sm ${subColor}`}>
            Complete these 3 quick steps to start selling to buyers across Pakistan
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep < 4 && (
          <div className="mx-auto mb-10 max-w-[720px]">
            <div className="flex items-center justify-between">
              {[
                { id: 1, label: 'Store Details' },
                { id: 2, label: 'CNIC & Identity' },
                { id: 3, label: 'Payout Method' },
              ].map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                        currentStep === step.id
                          ? `${isLight ? 'border-[#00b851] bg-[#00b851] text-white' : 'border-[#00ff7a] bg-[#00ff7a] text-[#0d0d0d]'}`
                          : `${isLight ? 'border-[#d9dde5] bg-[#eef0f4] text-[#6b7280]' : 'border-[#2a2a2a] bg-[#222] text-[#9a9a9a]'}`
                      }`}
                    >
                      {step.id}
                    </div>
                    <span className={`mt-3 text-xs ${currentStep === step.id ? titleColor : subColor}`}>{step.label}</span>
                  </div>
                  {index < 2 && <div className={`mx-4 h-0.5 w-36 ${stepLine}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`mx-auto max-w-[960px] rounded-2xl border p-6 shadow-sm sm:p-8 ${cardBg}`}>
          {currentStep === 2 && (
            <p className={`mb-1 text-xs font-bold uppercase tracking-wider ${accent}`}>
              Step 2 of 3 - Verify Your Identity
            </p>
          )}
          {currentStep === 2 && (
            <h2 className={`mb-2 text-3xl font-bold ${titleColor}`}>Upload your CNIC</h2>
          )}
          {currentStep === 2 && (
            <p className={`mb-6 text-sm ${subColor}`}>
              We verify every seller through NADRA to keep BazaarPK safe. Documents are encrypted and never shared.
            </p>
          )}
          {currentStep === 2 && (
            <div
              className={`mb-5 rounded-lg border p-4 text-sm ${
                isLight ? 'border-[#00b851] bg-[#e6f9ee] text-[#111827]' : 'border-[#00ff7a] bg-[#0c1f14] text-white'
              }`}
            >
              Use a clear, unedited photo. Avoid glare. Both sides required.
            </div>
          )}
      
        {/* Step 1: Store Setup */}
        {currentStep === 1 && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Store Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Name
                </label>
                <input
                  {...storeForm.register('storeName')}
                  className={inputClass}
                  placeholder="e.g. Lahore Handicrafts"
                />
                {storeForm.formState.errors.storeName && (
                  <p className="mt-1 text-xs text-red-500">
                    {storeForm.formState.errors.storeName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Description
                </label>
                <textarea
                  {...storeForm.register('storeDescription')}
                  rows={4}
                  className={inputClass}
                  placeholder="Describe what you sell and what makes your store unique..."
                />
                {storeForm.formState.errors.storeDescription && (
                  <p className="mt-1 text-xs text-red-500">
                    {storeForm.formState.errors.storeDescription.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  {...storeForm.register('phone')}
                  className={inputClass}
                  placeholder="+92-300-1234567"
                />
                {storeForm.formState.errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {storeForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>
                  <input
                    {...storeForm.register('city')}
                    className={inputClass}
                    placeholder="e.g. Lahore"
                  />
                  {storeForm.formState.errors.city && (
                    <p className="mt-1 text-xs text-red-500">
                      {storeForm.formState.errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Province
                  </label>
                  <select {...storeForm.register('province')} className={inputClass}>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleStoreSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Verification */}
        {currentStep === 2 && (
          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Identity Verification
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Verify your identity with CNIC to build buyer trust and enable payouts
            </p>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CNIC Number
                </label>
                <input
                  {...verificationForm.register('cnicNumber')}
                  className={inputClass}
                  placeholder="35201-1234567-1"
                />
                {verificationForm.formState.errors.cnicNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {verificationForm.formState.errors.cnicNumber.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CNIC Front
                  </label>
                  <button
                    type="button"
                    onClick={() => simulateFileUpload('cnicFront', setCnicFrontPreview)}
                    className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      cnicFrontPreview
                        ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20'
                        : 'border-gray-300 hover:border-primary-400 dark:border-gray-600'
                    }`}
                  >
                    {cnicFrontPreview ? (
                      <CheckCircle2 className="h-8 w-8 text-primary-600" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {cnicFrontPreview ? 'Uploaded' : 'Click to upload'}
                    </span>
                  </button>
                  {verificationForm.formState.errors.cnicFront && (
                    <p className="mt-1 text-xs text-red-500">
                      {verificationForm.formState.errors.cnicFront.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CNIC Back
                  </label>
                  <button
                    type="button"
                    onClick={() => simulateFileUpload('cnicBack', setCnicBackPreview)}
                    className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      cnicBackPreview
                        ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20'
                        : 'border-gray-300 hover:border-primary-400 dark:border-gray-600'
                    }`}
                  >
                    {cnicBackPreview ? (
                      <CheckCircle2 className="h-8 w-8 text-primary-600" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {cnicBackPreview ? 'Uploaded' : 'Click to upload'}
                    </span>
                  </button>
                  {verificationForm.formState.errors.cnicBack && (
                    <p className="mt-1 text-xs text-red-500">
                      {verificationForm.formState.errors.cnicBack.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  NTN Number (Optional)
                </label>
                <input
                  {...verificationForm.register('ntnNumber')}
                  className={inputClass}
                  placeholder="For registered businesses"
                />
                <p className="mt-1 text-xs text-gray-400">
                  National Tax Number for FBR-registered businesses
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Your data is secure
                    </p>
                    <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                      CNIC information is encrypted and only used for identity verification.
                      It is never shared with buyers or third parties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={handleVerificationSubmit}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Bank Details */}
        {currentStep === 3 && (
          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Payout Information
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Add your bank account or mobile wallet for receiving payments
            </p>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bank / Wallet
                </label>
                <select {...bankForm.register('bankName')} className={inputClass}>
                  <option value="">Select bank or wallet</option>
                  {banks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {bankForm.formState.errors.bankName && (
                  <p className="mt-1 text-xs text-red-500">
                    {bankForm.formState.errors.bankName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Title
                </label>
                <input
                  {...bankForm.register('accountTitle')}
                  className={inputClass}
                  placeholder="As per bank records"
                />
                {bankForm.formState.errors.accountTitle && (
                  <p className="mt-1 text-xs text-red-500">
                    {bankForm.formState.errors.accountTitle.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Number / IBAN
                </label>
                <input
                  {...bankForm.register('accountNumber')}
                  className={inputClass}
                  placeholder="PK36SCBL0000001123456702"
                />
                {bankForm.formState.errors.accountNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {bankForm.formState.errors.accountNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Branch Code (Optional)
                </label>
                <input
                  {...bankForm.register('branchCode')}
                  className={inputClass}
                  placeholder="0001"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={handleBankSubmit}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <BadgeCheck className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Verification Submitted!
            </h2>
            <p className="mx-auto max-w-md text-sm text-gray-500 dark:text-gray-400">
              Your documents are under review. This typically takes 24-48 hours.
              You&apos;ll receive a notification once your account is verified.
            </p>
            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-left dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                What happens next?
              </h3>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Our team reviews your CNIC documents' },
                  { step: '2', text: 'Your bank details are verified for payouts' },
                  { step: '3', text: 'You get a verified seller badge on your store' },
                  { step: '4', text: 'Start listing products and making sales!' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                      {item.step}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/products')}
                className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>

        {user && !user.isVerified && currentStep < 4 && (
          <p className={`mt-4 text-center text-xs ${subColor}`}>
            Logged in as {user.name} ({user.email})
          </p>
        )}
      </div>
    </div>
  );
}
