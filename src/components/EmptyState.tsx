import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionLink,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
