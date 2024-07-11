import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ProductCard from "./product-card";
import { Category, Product } from "@/lib/types";

const ProductList = async ({ searchParams }: { searchParams: { restaurantId: string } }) => {
	// todo: do concurent request => Promise.all()
	const categoryResponse = await fetch(`${process.env.BACKEND_URL}/api/catalog/categories`, {
		next: {
			revalidate: 3600,
		},
	});

	if (!categoryResponse.ok) {
		return (
			<h1 className="text-base font-bold text-red-500 flex justify-center items-center mt-5">
				Failed to fetch categories
			</h1>
		);
	}
	const categories: Category[] = await categoryResponse.json();

	// todo: add pagination
	const productResponse = await fetch(
		`${process.env.BACKEND_URL}/api/catalog/products?tenantId=${searchParams.restaurantId}&isPublish=true&perPage=50`
	);

	const products: { data: Product[] } = await productResponse.json();
	return (
		<section>
			<div className="container py-12">
				<Tabs defaultValue={categories[0]._id}>
					<TabsList>
						{categories.map((category) => {
							return (
								<TabsTrigger key={category._id} value={category._id} className="text-md">
									{category.name}
								</TabsTrigger>
							);
						})}
					</TabsList>
					{categories.map((category) => {
						return (
							<TabsContent key={category._id} value={category._id}>
								<div className="grid grid-cols-4 gap-6 mt-6">
									{products.data
										.filter((product) => product.category._id === category._id)
										.map((product) => (
											<ProductCard product={product} key={product._id} />
										))}
								</div>
							</TabsContent>
						);
					})}
				</Tabs>
			</div>
		</section>
	);
};

export default ProductList;
