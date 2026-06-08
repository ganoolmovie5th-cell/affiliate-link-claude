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
import type { Product } from "@/types";

const COLLECTION = "products";

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    let q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    if (category) {
      q = query(
        collection(db, COLLECTION),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(collection(db, COLLECTION), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as Product;
  } catch {
    return null;
  }
}

export async function searchProducts(term: string): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
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
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
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
