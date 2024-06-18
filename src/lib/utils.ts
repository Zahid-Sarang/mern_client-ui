import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "./store/features/cart/cartSlice";
import CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// hashing cart configurations
export function hashTheItem(payload: CartItem) {
	const jsonString = JSON.stringify({ ...payload, qty: undefined });
	const hash = CryptoJS.SHA256(jsonString).toString();
	return hash;
}
