"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import React from "react";

const CartCounter = () => {
	const dispatch = useAppDispatch();

	return (
		<>
			<div className="relative">
				<Link href={"/cart"}>
					<ShoppingBasket className="hover:text-primary cursor-pointer" />
				</Link>
				<span className="absolute -top-4 -right-5 h-6 w-6 flex items-center justify-center rounded-full bg-primary font-bold text-white"></span>
			</div>
		</>
	);
};

export default CartCounter;
