import { Subscription } from '@/services/api';
import { Pause, Play, XCircle } from 'lucide-react';

const statusConfig = {
  ACTIVE: {
    icon: Play,
    text: 'Active',
    className: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
  },
  PAUSED: {
    icon: Pause,
    text: 'Paused',
    className: 'bg-gray-100 text-gray-600 ring-1 ring-gray-500/20',
  },
  CANCELLED: {
    icon: XCircle,
    text: 'Cancelled',
    className: 'bg-red-50 text-red-600 ring-1 ring-red-600/20',
  },
};

export function SubscriptionStatusBadge({ status }: { status: Subscription['status'] }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
    >
      <Icon className="w-4 h-4 mr-1.5" />
      {config.text}
    </span>
  );
}
