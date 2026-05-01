import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  ShieldCheck,
  MessageCircle,
  Clock,
  CheckCircle2,
  Upload,
  Loader2,
  FileText,
  Scale,
} from 'lucide-react';
import { fetchDisputes } from '../services/firestoreService';
import { formatDate } from '../utils/helpers';
import type { Dispute } from '../types';

const disputeSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  reason: z.enum([
    'item_not_received',
    'item_not_as_described',
    'defective_item',
    'wrong_item',
    'seller_unresponsive',
    'other',
  ]),
  description: z.string().min(30, 'Please provide at least 30 characters of detail'),
  desiredResolution: z.enum(['full_refund', 'partial_refund', 'replacement', 'other']),
});

type DisputeFormData = z.infer<typeof disputeSchema>;

const reasonLabels: Record<string, string> = {
  item_not_received: 'Item Not Received',
  item_not_as_described: 'Item Not as Described',
  defective_item: 'Defective / Damaged Item',
  wrong_item: 'Wrong Item Received',
  seller_unresponsive: 'Seller Not Responding',
  other: 'Other',
};

const resolutionLabels: Record<string, string> = {
  full_refund: 'Full Refund',
  partial_refund: 'Partial Refund',
  replacement: 'Replacement',
  other: 'Other Resolution',
};

const statusSteps = [
  { label: 'Dispute Filed', icon: FileText, description: 'Your case has been opened' },
  { label: 'Under Review', icon: Scale, description: 'Admin is reviewing evidence' },
  { label: 'Resolution', icon: CheckCircle2, description: 'Decision made and enforced' },
];

export default function DisputePage() {
  const [activeTab, setActiveTab] = useState<'file' | 'history'>('file');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [caseCode, setCaseCode] = useState('');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisputes().then(setDisputes).catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DisputeFormData>({
    resolver: zodResolver(disputeSchema),
  });

  const onSubmit = async (data: DisputeFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setCaseCode(`DSP-${data.orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase() || '000001'}`);
    setSubmitted(true);
  };

  const statusColorMap: Record<string, string> = {
    open: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    investigating: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dispute Center</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          File a dispute or track existing cases
        </p>
      </div>

      {/* How it Works */}
      <div className="mb-8 rounded-xl border border-primary-200 bg-primary-50 p-6 dark:border-primary-800 dark:bg-primary-900/20">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-primary-800 dark:text-primary-300">
          <ShieldCheck className="h-4 w-4" />
          How Dispute Resolution Works
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statusSteps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">{step.label}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {(['file', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            {tab === 'file' ? 'File a Dispute' : 'Dispute History'}
          </button>
        ))}
      </div>

      {/* File Dispute Tab */}
      {activeTab === 'file' && !submitted && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-surface-dark">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Order ID
              </label>
              <input
                {...register('orderId')}
                className={inputClass}
                placeholder="e.g. BPK-20260328"
              />
              {errors.orderId && <p className="mt-1 text-xs text-red-500">{errors.orderId.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Dispute
              </label>
              <select {...register('reason')} className={inputClass}>
                <option value="">Select a reason</option>
                {Object.entries(reasonLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Describe the Issue
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className={inputClass}
                placeholder="Please provide details about the issue, including any communication with the seller..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Evidence (Photos / Screenshots)
              </label>
              <button
                type="button"
                onClick={() => setEvidenceCount((c) => c + 1)}
                className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary-400 dark:border-gray-600"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {evidenceCount > 0
                    ? `${evidenceCount} file(s) attached — click to add more`
                    : 'Click to upload evidence'}
                </span>
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Desired Resolution
              </label>
              <select {...register('desiredResolution')} className={inputClass}>
                <option value="">Select preferred resolution</option>
                {Object.entries(resolutionLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.desiredResolution && (
                <p className="mt-1 text-xs text-red-500">{errors.desiredResolution.message}</p>
              )}
            </div>

            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Before filing a dispute
                  </p>
                  <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                    We recommend contacting the seller first through the chat feature.
                    Most issues can be resolved directly. If the seller is unresponsive
                    for 48+ hours, filing a dispute is the right next step.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Submit Dispute
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Submitted Confirmation */}
      {activeTab === 'file' && submitted && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-surface-dark">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Dispute Filed Successfully
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Case #{caseCode} has been opened. Our team will review
            your case within 24-48 hours. You&apos;ll receive updates via notification.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => { setSubmitted(false); setActiveTab('history'); }}
              className="rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              View Dispute History
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Back to Orders
            </button>
          </div>
        </div>
      )}

      {/* Dispute History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {disputes.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-surface-dark">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500 dark:text-gray-400">No disputes filed yet</p>
            </div>
          ) : (
            disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-surface-dark"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {dispute.id}
                      </h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusColorMap[dispute.status]}`}>
                        {dispute.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Order: {dispute.orderId}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatDate(dispute.createdAt)}
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {dispute.reason}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Buyer: {dispute.buyerName}</span>
                  <span>Seller: {dispute.sellerName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
