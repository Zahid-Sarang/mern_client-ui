import { Product, Topping } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
	product: Product;
	chosenConfiguration: {
		priceConfiguration: {
			[key: string]: string;
		};
		selectedToppings: Topping[];
	};
}

export interface CartState {
	cartItem: CartItem[];
}

const initialState: CartState = {
	cartItem: [],
};

export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<CartItem>) => {
			return {
				cartItem: [
					...state.cartItem,
					{
						product: action.payload.product,
						chosenConfiguration: action.payload.chosenConfiguration,
					},
				],
			};
		},
	},
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
