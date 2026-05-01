import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { DashboardStats, Dispute, Order, Product, Review, User, UserRole } from '../types';
import { auth, db } from '../lib/firebase';
import { categories, dashboardStats, mockDisputes, mockOrders, products, reviews } from '../utils/mockData';

const productsCollection = collection(db, 'products');
const usersCollection = collection(db, 'users');
const ordersCollection = collection(db, 'orders');
const disputesCollection = collection(db, 'disputes');
const reviewsCollection = collection(db, 'reviews');

function mapDoc<T>(snapshot: QueryDocumentSnapshot): T {
  return { id: snapshot.id, ...(snapshot.data() as Omit<T, 'id'>) } as T;
}

export async function upsertUserProfile(user: User) {
  await setDoc(
    doc(usersCollection, user.id),
    {
      ...user,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const currentUser = auth.currentUser;
  if (currentUser?.uid === userId) {
    await currentUser.getIdToken();
  }
  const userSnapshot = await getDoc(doc(usersCollection, userId));
  if (!userSnapshot.exists()) return null;
  return {
    id: userSnapshot.id,
    ...(userSnapshot.data() as Omit<User, 'id'>),
  };
}

export async function getUserProfileByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const snapshot = await getDocs(
    query(usersCollection, where('email', '==', normalizedEmail), limit(1))
  );
  if (snapshot.empty) return null;
  const legacyDoc = snapshot.docs[0];
  return {
    id: legacyDoc.id,
    ...(legacyDoc.data() as Omit<User, 'id'>),
  };
}

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsCollection, orderBy('createdAt', 'desc'), limit(120)));
  if (snapshot.empty) return products;
  return snapshot.docs.map((docItem) => mapDoc<Product>(docItem));
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  const snapshot = await getDocs(query(reviewsCollection, where('productId', '==', productId), limit(20)));
  if (snapshot.empty) {
    return reviews.filter((review) => review.productId === productId);
  }
  return snapshot.docs.map((docItem) => mapDoc<Review>(docItem));
}

export async function fetchBuyerOrders(buyerId: string): Promise<Order[]> {
  const snapshot = await getDocs(query(ordersCollection, where('buyerId', '==', buyerId), limit(100)));
  if (snapshot.empty) return mockOrders.filter((order) => order.buyerId === buyerId);
  return snapshot.docs.map((docItem) => mapDoc<Order>(docItem));
}

export async function fetchSellerOrders(sellerId: string): Promise<Order[]> {
  const snapshot = await getDocs(query(ordersCollection, where('sellerId', '==', sellerId), limit(100)));
  if (snapshot.empty) return mockOrders.filter((order) => order.sellerId === sellerId);
  return snapshot.docs.map((docItem) => mapDoc<Order>(docItem));
}

export async function fetchDisputes(): Promise<Dispute[]> {
  const snapshot = await getDocs(query(disputesCollection, limit(100)));
  if (snapshot.empty) return mockDisputes;
  return snapshot.docs.map((docItem) => mapDoc<Dispute>(docItem));
}

export async function fetchSellerDashboardStats(sellerId: string): Promise<DashboardStats> {
  const sellerOrders = await fetchSellerOrders(sellerId);
  if (sellerOrders.length === 0) return dashboardStats;

  const delivered = sellerOrders.filter((order) => order.status === 'delivered');
  const totalRevenue = delivered.reduce((sum, order) => sum + order.totalAmount, 0);
  return {
    ...dashboardStats,
    totalRevenue,
    totalOrders: sellerOrders.length,
  };
}

export async function ensureSeedData() {
  const sampleProduct = await getDocs(query(productsCollection, limit(1)));
  if (!sampleProduct.empty) return;

  await Promise.all(
    products.slice(0, 15).map((product) =>
      setDoc(doc(productsCollection, product.id), {
        ...product,
        createdAt: product.createdAt,
      })
    )
  );

  await Promise.all(
    mockOrders.slice(0, 15).map((order) =>
      setDoc(doc(ordersCollection, order.id), {
        ...order,
        createdAt: order.createdAt,
      })
    )
  );

  await Promise.all(
    mockDisputes.map((dispute) =>
      setDoc(doc(disputesCollection, dispute.id), {
        ...dispute,
      })
    )
  );
}

export const appCategories = categories;
export const defaultRole: UserRole = 'buyer';
