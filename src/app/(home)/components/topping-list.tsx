import React, { useEffect, useState } from "react";
import ToppingCard from "./topping-card";
import { Topping } from "@/lib/types";

const ToppingList = () => {
	const [toppings, setToppings] = useState<Topping[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			// todo: make tenant dymanic
			const toppingResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalog/toppings?page=1&limit=2`);
			const toppings: { data: Topping[] } = await toppingResponse.json();
			console.log(toppings);
			setToppings(toppings.data);
		};
		fetchData();
	}, []);

	const [selectedToppings, setSelectedToppings] = React.useState<Topping[]>([]);

	const handleCheckBoxCheck = (topping: Topping) => {
		const isAlreadyChecked = selectedToppings.some((element: Topping) => element.id === topping.id);
		if (isAlreadyChecked) {
			setSelectedToppings((prev) => prev.filter((elem: Topping) => elem.id !== topping.id));
			return;
		}
		setSelectedToppings((prev: Topping[]) => [...prev, topping]);
	};
	return (
		<section className="mt-6">
			<h3>Extra toppings</h3>
			<div className="grid grid-cols-3 gap-4 mt-2">
				{toppings.map((topping) => {
					return (
						<ToppingCard
							topping={topping}
							key={topping.id}
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
