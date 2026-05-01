export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  lastActiveRole?: UserRole;
  avatar: string;
  phone: string;
  joinedAt: string;
  isVerified: boolean;
}

export interface SellerProfile extends User {
  role: 'seller';
  storeName: string;
  storeDescription: string;
  cnicVerified: boolean;
  ntnNumber: string;
  totalSales: number;
  rating: number;
  reviewCount: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: ProductCategory;
  seller: Pick<SellerProfile, 'id' | 'storeName' | 'rating' | 'avatar'>;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  createdAt: string;
  isFeatured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string;
  estimatedDelivery: string;
  statusHistory: OrderStatusEvent[];
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'disputed';

export type PaymentMethod =
  | 'cod'
  | 'jazzcash'
  | 'easypaisa'
  | 'card'
  | 'bank_transfer';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  revenueChange: number;
  ordersChange: number;
  monthlyRevenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  sortBy: SortOption;
}

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface ChatConversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: UserRole;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  productId: string;
  productTitle: string;
  productImage: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
}
