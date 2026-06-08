import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { MOCK_PRODUCTS } from "./mockData";
import type { Product } from "@/types";

const COLLECTION = "products";

const isFirebaseReady = () => db !== null;

export async function getProducts(category?: string): Promise<Product[]> {
  if (!isFirebaseReady()) {
    if (category) return MOCK_PRODUCTS.filter((p) => p.category === category);
    return MOCK_PRODUCTS;
  }
  try {
    let q = query(collection(db!, COLLECTION), orderBy("createdAt", "desc"));
    if (category) {
      q = query(
        collection(db!, COLLECTION),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  if (!isFirebaseReady()) {
    return MOCK_PRODUCTS.filter((p) => p.featured).slice(0, count);
  }
  try {
    const q = query(
      collection(db!, COLLECTION),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.featured).slice(0, count);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isFirebaseReady()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
  try {
    const q = query(collection(db!, COLLECTION), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as Product;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function searchProducts(term: string): Promise<Product[]> {
  if (!isFirebaseReady()) {
    const lower = term.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower))
    );
  }
  try {
    const snapshot = await getDocs(collection(db!, COLLECTION));
    const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    const lower = term.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower))
    );
  } catch {
    return [];
  }
}

export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  if (!isFirebaseReady()) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db!, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  if (!isFirebaseReady()) throw new Error("Firebase not configured");
  await updateDoc(doc(db!, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseReady()) throw new Error("Firebase not configured");
  await deleteDoc(doc(db!, COLLECTION, id));
}

export function getCheapestPrice(product: Product) {
  if (!product.prices?.length) return null;
  const inStock = product.prices.filter((p) => p.inStock);
  if (!inStock.length) return null;
  return inStock.reduce((min, p) => (p.price < min.price ? p : min));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
