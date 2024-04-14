import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import ProductCard, { Product } from "./components/product-card";

const products: Product[] = [
	{
		id: "1",
		name: "Margarita Pizza",
		description: "This is a very tasty pizza",
		image: "/pizza-main.png",
		price: 500,
	},
	{
		id: "2",
		name: "Chicken Pizza",
		description: "This is a very tasty pizza",
		image: "/pizza-main.png",
		price: 500,
	},
	{
		id: "3",
		name: "Cheesy Pizza",
		description: "This is a very tasty pizza",
		image: "/pizza-main.png",
		price: 400,
	},
	{
		id: "4",
		name: "tandoori chicken Pizza",
		description: "This is a very tasty pizza",
		image: "/pizza-main.png",
		price: 400,
	},
];

export default function Home() {
	return (
		<>
			<section className="bg-white">
				<div className="container flex items-center justify-between py-24">
					<div>
						<h1 className="text-7xl font-black font-sans leading-2">
							Super Delicious Pizza in <br />
							<span className="text-primary">Only 45 minutes</span>
						</h1>
						<p className="text-2xl mt-8 max-w-lg leading-snug">
							Enjoy a Free MEal if Your Order Takes More Than 45 Minutes!
						</p>
						<Button className="my-8 text-lg rounded-full py-7 px-6 font-bold">Get you pizza now</Button>
					</div>
					<div>
						<Image src={"/pizza-main.png"} alt="pizza-main" width={400} height={400} />
					</div>
				</div>
			</section>

			<section>
				<div className="container py-12">
					<Tabs defaultValue="pizza">
						<TabsList>
							<TabsTrigger value="pizza" className="text-md">
								Pizza
							</TabsTrigger>
							<TabsTrigger value="beverages" className="text-md">
								Beverages
							</TabsTrigger>
						</TabsList>
						<TabsContent value="pizza">
							<div className="grid grid-cols-4 gap-6 mt-6">
								{products.map((product) => (
									<ProductCard product={product} key={product.id} />
								))}
							</div>
						</TabsContent>
						<TabsContent value="beverages">
							<div className="grid grid-cols-4 gap-6 mt-6">
								{products.map((product) => (
									<ProductCard product={product} key={product.id} />
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>
		</>
	);
}
