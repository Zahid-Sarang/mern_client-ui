"use client";
import React, { Suspense, startTransition, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart } from "lucide-react";
import { Label } from "@/components/ui/label";
import ToppingList from "./topping-list";
import { Product, Topping } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CartItem, addToCart } from "@/lib/store/features/cart/cartSlice";
import { hashTheItem } from "@/lib/utils";

type ChosenConfig = {
	[key: string]: string;
};
const ProductModal = ({ product }: { product: Product }) => {
	const [dialogOpen, setDailogOpen] = useState(false);
	const dispatch = useAppDispatch();
	const cartItems = useAppSelector((state) => state.cart.cartItems);

	const defaultConfiguration = Object.entries(product.category.priceConfiguration)
		.map(([key, value]) => {
			return { [key]: value.availableOptions[0] };
		})
		.reduce((acc, curr) => ({ ...acc, ...curr }), {});

	const [chosenConfig, setChosenConfig] = useState<ChosenConfig>(defaultConfiguration as unknown as ChosenConfig);

	const [selectedToppings, setSelectedToppings] = React.useState<Topping[]>([]);

	const totalPrice = React.useMemo(() => {
		const toppingsTotalPrice = selectedToppings.reduce((acc, curr) => acc + curr.price, 0);

		const configPricing = Object.entries(chosenConfig).reduce((acc, [key, value]: [string, string]) => {
			const price = product.priceConfiguration[key].availableOptions[value];
			return acc + price;
		}, 0);
		return configPricing + toppingsTotalPrice;
	}, [chosenConfig, product.priceConfiguration, selectedToppings]);

	const alreadyHasInCart = React.useMemo(() => {
		const currentConfiguration = {
			_id: product._id,
			name: product.name,
			image: product.image,
			priceConfiguration: product.priceConfiguration,
			chosenConfiguration: {
				priceConfiguration: { ...chosenConfig },
				selectedToppings: selectedToppings,
			},
			qty: 1,
		};
		const hash = hashTheItem(currentConfiguration);
		return cartItems.some((items) => items.hash === hash);
	}, [product, chosenConfig, selectedToppings, cartItems]);

	const handleCheckBoxCheck = (topping: Topping) => {
		const isAlreadyExists = selectedToppings.some((element: Topping) => element._id === topping._id);

		startTransition(() => {
			if (isAlreadyExists) {
				setSelectedToppings((prev) => prev.filter((elm: Topping) => elm._id !== topping._id));
				return;
			}

			setSelectedToppings((prev: Topping[]) => [...prev, topping]);
		});
	};

	const handleRadioChange = (key: string, data: string) => {
		startTransition(() => {
			setChosenConfig((prev) => {
				return { ...prev, [key]: data };
			});
		});
	};

	const handleAddToCart = (product: Product) => {
		const itemToAdd: CartItem = {
			_id: product._id,
			name: product.name,
			image: product.image,
			priceConfiguration: product.priceConfiguration,
			chosenConfiguration: {
				priceConfiguration: chosenConfig!,
				selectedToppings: selectedToppings,
			},
			qty: 1,
		};

		dispatch(addToCart(itemToAdd));
		setSelectedToppings([]);
		setDailogOpen(false);
	};
	return (
		<>
			<Dialog open={dialogOpen} onOpenChange={setDailogOpen}>
				<DialogTrigger className="bg-orange-200 hover:bg-orange-300 text-orange-500 px-6 py-2 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-liner transition-all duration-150">
					Choose
				</DialogTrigger>
				<DialogContent className="max-w-3xl p-0">
					<div className="flex">
						<div className="w-1/3 bg-white rounded p-8 flex items-center justify-center">
							<Image src={product.image} width={450} height={450} alt={product.name} />
						</div>
						<div className="w-2/3 p-8">
							<h3 className="text-xl font-bold">{product.name}</h3>
							<p className="mt-1">{product.description}</p>
							{Object.entries(product.category.priceConfiguration).map(([key, value]) => {
								return (
									<div key={key}>
										<h4 className="mt-6">Choose the {key}</h4>
										<RadioGroup
											onValueChange={(data) => {
												handleRadioChange(key, data);
											}}
											defaultValue={value.availableOptions[0]}
											className="grid grid-cols-3 gap-4 mt-2"
										>
											{value.availableOptions.map((option) => {
												return (
													<div key={option}>
														<RadioGroupItem value={option} id={option} className="peer sr-only" aria-label={option} />
														<Label
															htmlFor={option}
															className="flex flex-col items-center justify-between rounded-md border-2 bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
														>
															{option}
														</Label>
													</div>
												);
											})}
										</RadioGroup>
									</div>
								);
							})}

							{/* todo: make this condition dynamic display toppings based on the product */}

							{product.category.name !== "pizza" && (
								<Suspense fallback={"Toppings Loading...."}>
									<ToppingList selectedToppings={selectedToppings} handleCheckBoxCheck={handleCheckBoxCheck} />
								</Suspense>
							)}

							<div className="flex items-center justify-between mt-12">
								<span className="font-bold">₹{totalPrice}</span>

								<Button
									className={alreadyHasInCart ? "bg-gray-700 " : "bg-primary"}
									disabled={alreadyHasInCart}
									onClick={() => handleAddToCart(product)}
								>
									<ShoppingCart size={20} />
									<span className="ml-2">{alreadyHasInCart ? "Already in cart" : "Add to cart"}</span>
								</Button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProductModal;
