import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertTriangle,
  MapPin,
  CreditCard,
  Search,
  ShoppingBag,
} from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { formatPrice, formatDate } from '../utils/helpers';
import { fetchBuyerOrders } from '../services/firestoreService';
import { useAuthStore } from '../store/authStore';

type TabFilter = 'all' | OrderStatus;

const tabs: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

const statusConfig: Record<OrderStatus, { icon: typeof Package; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
  confirmed: { icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  processing: { icon: Package, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  shipped: { icon: Truck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  delivered: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  cancelled: { icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  disputed: { icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
};

export default function BuyerOrdersPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const buyerId = user?.id || 'user-1';
    fetchBuyerOrders(buyerId).then(setOrders).catch(console.error);
  }, [user?.id]);

  const buyerOrders = orders
    .filter((order) => {
      if (activeTab !== 'all' && order.status !== activeTab) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          order.id.toLowerCase().includes(q) ||
          order.items.some((item) => item.product.title.toLowerCase().includes(q)) ||
          order.trackingNumber.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage your purchases
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID, product name, or tracking number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm dark:bg-surface-dark dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {buyerOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            No orders found
          </h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            {activeTab === 'all'
              ? "You haven't placed any orders yet."
              : `No ${activeTab} orders found.`}
          </p>
          <Link
            to="/products"
            className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {buyerOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrder === order.id}
              onToggle={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  isExpanded,
  onToggle,
}: {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  // Determine the progress step index for the tracker
  const progressSteps: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = isCancelled ? -1 : progressSteps.indexOf(order.status);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-surface-dark">
      {/* Order Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left sm:p-6"
      >
        <div className="flex flex-1 flex-wrap items-start gap-4 sm:items-center">
          {/* Product Thumbnails */}
          <div className="flex -space-x-3">
            {order.items.slice(0, 3).map((item, idx) => (
              <img
                key={idx}
                src={item.product.images[0]}
                alt={item.product.title}
                className="h-12 w-12 rounded-lg border-2 border-white bg-gray-100 object-cover dark:border-gray-800"
              />
            ))}
            {order.items.length > 3 && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white bg-gray-100 text-xs font-bold text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{order.items.length - 3}
              </div>
            )}
          </div>

          {/* Order Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {order.id}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${config.bg} ${config.color}`}>
                <StatusIcon className="h-3 w-3" />
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''} &middot;{' '}
              {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Total */}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(order.totalAmount)}
            </p>
            <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
              {order.paymentMethod.replace('_', ' ')}
            </p>
          </div>
        </div>

        <ChevronRight
          className={`ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Progress Tracker */}
          {!isCancelled && (
            <div className="px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                {progressSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = statusConfig[step].icon;
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                            isCompleted
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          } ${isCurrent ? 'ring-4 ring-primary-100 dark:ring-primary-900/50' : ''}`}
                        >
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <span
                          className={`mt-2 text-xs font-medium capitalize ${
                            isCompleted
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {idx < progressSteps.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 flex-1 rounded ${
                            idx < currentStepIndex
                              ? 'bg-primary-600'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="mx-4 my-4 flex items-center gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20 sm:mx-6">
              <XCircle className="h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Order Cancelled
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {order.statusHistory[order.statusHistory.length - 1]?.note}
                </p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Items
            </h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-white"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity} &times; {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:grid-cols-3 sm:px-6">
            {/* Shipping */}
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Delivery Address
                </p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Payment
                </p>
                <p className="mt-1 text-sm capitalize text-gray-900 dark:text-white">
                  {order.paymentMethod.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total: {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>

            {/* Tracking */}
            <div className="flex gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Tracking
                </p>
                {order.trackingNumber ? (
                  <>
                    <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                      {order.trackingNumber}
                    </p>
                    {order.estimatedDelivery && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Est. delivery: {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                    Not yet shipped
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Order Timeline
            </h4>
            <div className="space-y-0">
              {[...order.statusHistory].reverse().map((event, idx) => {
                const eventConfig = statusConfig[event.status];
                const EventIcon = eventConfig.icon;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${eventConfig.bg}`}>
                        <EventIcon className={`h-3.5 w-3.5 ${eventConfig.color}`} />
                      </div>
                      {idx < order.statusHistory.length - 1 && (
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                        {event.status}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.note} &middot; {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
