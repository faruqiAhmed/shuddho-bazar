import React from 'react';
import { OrderStatus } from '../../types';
import { CheckCircle2, Clock, Truck, XCircle, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showBengali?: boolean;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  showBengali,
  className = '',
}) => {
  // If showBengali not explicitly set, show on md and lg, keep sm super compact
  const shouldShowBengali = showBengali !== undefined ? showBengali : size !== 'sm';

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px] font-bold tracking-tight',
    md: 'px-3 py-1 text-xs font-bold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  const iconSizes = {
    sm: 'w-3 h-3 shrink-0',
    md: 'w-3.5 h-3.5 shrink-0',
    lg: 'w-4 h-4 shrink-0',
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'Delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/90',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className={`${iconSizes[size]} text-emerald-600`} />,
          labelBengali: 'ডেলিভার্ড',
        };
      case 'Processing':
        return {
          bg: 'bg-amber-50 text-amber-800 border border-amber-200/90',
          dot: 'bg-amber-500',
          icon: <Clock className={`${iconSizes[size]} text-amber-600`} />,
          labelBengali: 'প্রসেসিং',
        };
      case 'Shipped':
        return {
          bg: 'bg-blue-50 text-blue-800 border border-blue-200/90',
          dot: 'bg-blue-500',
          icon: <Truck className={`${iconSizes[size]} text-blue-600`} />,
          labelBengali: 'শিপ্ড',
        };
      case 'Confirmed':
        return {
          bg: 'bg-teal-50 text-teal-800 border border-teal-200/90',
          dot: 'bg-teal-500',
          icon: <CheckCircle2 className={`${iconSizes[size]} text-teal-600`} />,
          labelBengali: 'কনফার্মড',
        };
      case 'Pending':
        return {
          bg: 'bg-purple-50 text-purple-800 border border-purple-200/90',
          dot: 'bg-purple-500',
          icon: <AlertCircle className={`${iconSizes[size]} text-purple-600`} />,
          labelBengali: 'অপেক্ষমাণ',
        };
      case 'Cancelled':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border border-rose-200/90',
          dot: 'bg-rose-500',
          icon: <XCircle className={`${iconSizes[size]} text-rose-600`} />,
          labelBengali: 'বাতিল',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap select-none transition-all ${sizeClasses[size]} ${config.bg} ${className}`}
    >
      {showIcon && config.icon}
      <span>{status}</span>
      {shouldShowBengali && (
        <span className="opacity-75 font-normal text-[10px] whitespace-nowrap">
          ({config.labelBengali})
        </span>
      )}
    </span>
  );
};
