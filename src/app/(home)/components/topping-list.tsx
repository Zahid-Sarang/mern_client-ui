import React, { startTransition, useEffect, useState } from "react";
import ToppingCard from "./topping-card";
import { Topping } from "@/lib/types";

const ToppingList = async () => {
	const [toppings, setToppings] = useState<Topping[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const toppingResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalog/toppings?page=1&limit=2`);
			const toppings: { data: Topping[] } = await toppingResponse.json();
			setToppings(toppings.data);
		};
		fetchData();
	}, []);

	const [selectedToppings, setSelectedToppings] = React.useState<Topping[]>([]);

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

	return (
		<section className="mt-6">
			<h3>Extra toppings</h3>
			<div className="grid grid-cols-3 gap-4 mt-2">
				{toppings.map((topping) => {
					return (
						<ToppingCard
							topping={topping}
							key={topping._id}
							selectedToppings={selectedToppings}
							handleCheckBoxCheck={handleCheckBoxCheck}
						/>
					);
				})}
			</div>
		</section>
	);
};

export default ToppingList;
