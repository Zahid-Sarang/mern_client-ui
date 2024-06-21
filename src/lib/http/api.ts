import axios from "axios";
import { CouponCodeData } from "../types";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

const ORDER_SERVICE_PREFIX = "/api/order";

export const getCustomer = () => api.get(`${ORDER_SERVICE_PREFIX}/customers`);
export const addAddress = (customerId: string, address: string) =>
	api.patch(`${ORDER_SERVICE_PREFIX}/customers/addresses/${customerId}`, {
		address,
	});

export const verifyCoupon = (data: CouponCodeData) => api.post(`${ORDER_SERVICE_PREFIX}/coupons/verify`, data);
