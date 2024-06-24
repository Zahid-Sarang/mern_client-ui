import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verifyCoupon } from "@/lib/http/api";
import { useAppSelector } from "@/lib/store/hooks";
import { CouponCodeData } from "@/lib/types";
import { getItemTotal } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const TAXES_PERCENTAGE = 18;
const DELIVERY_CHARGES = 50;
// TODO: move this to the server and calculate accordingly

const OrderSummary = ({
	handleCouponCodeChange,
	isPlaceOrderPending,
}: {
	isPlaceOrderPending: boolean;
	handleCouponCodeChange: (code: string) => void;
}) => {
	const cart = useAppSelector((state) => state.cart.cartItems);

	const searchParams = useSearchParams();

	const [discountPercentage, setDiscountPercentage] = useState(0);

	const [discountError, setDiscountError] = useState("");

	const couponCodeRef = React.useRef<HTMLInputElement>(null);

	const subTotal = React.useMemo(() => {
		return cart.reduce((acc, curr) => {
			return acc + curr.qty * getItemTotal(curr);
		}, 0);
	}, [cart]);

	const discountAmount = React.useMemo(() => {
		return Math.round((subTotal * discountPercentage) / 100);
	}, [subTotal, discountPercentage]);

	const texesAmount = React.useMemo(() => {
		const amountAfterDiscount = subTotal - discountAmount;

		return Math.round((amountAfterDiscount * TAXES_PERCENTAGE) / 100);
	}, [discountAmount, subTotal]);

	const grandWithDiscountTotal = React.useMemo(() => {
		return subTotal - discountAmount + texesAmount + DELIVERY_CHARGES;
	}, [subTotal, discountAmount, texesAmount]);

	const grandWithoutDiscountTotal = React.useMemo(() => {
		return subTotal + texesAmount + DELIVERY_CHARGES;
	}, [subTotal, texesAmount]);

	// todo:display request error
	const { mutate } = useMutation({
		mutationKey: ["couponCode"],
		mutationFn: async () => {
			const restaurantId = searchParams.get("restaurantId");

			if (!couponCodeRef.current) {
				return;
			}

			if (!restaurantId) {
				return;
			}
			const data: CouponCodeData = {
				code: couponCodeRef.current.value,
				tenantId: restaurantId,
			};
			return await verifyCoupon(data).then((res) => res.data);
		},
		onSuccess: (data) => {
			console.log("data recived", data);
			if (data.valid) {
				setDiscountError("");
				handleCouponCodeChange(couponCodeRef.current ? couponCodeRef.current.value : "");
				setDiscountPercentage(data.discount);
				return;
			}
			setDiscountError("Coupon is expired");
			handleCouponCodeChange("");
			setDiscountPercentage(0);
		},
	});

	const handleCouponValidation = (e: React.MouseEvent) => {
		e.preventDefault();
		mutate();
	};

	// todo: handle error properly when user enter coupon code

	return (
		<Card className="w-2/5 border-none h-auto self-start">
			<CardHeader>
				<CardTitle>Order summary</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4 pt-6">
				<div className="flex items-center justify-between">
					<span>Subtotal</span>
					<span className="font-bold">₹{subTotal}</span>
				</div>
				<div className="flex items-center justify-between">
					<span>Taxes</span>
					<span className="font-bold">₹{texesAmount}</span>
				</div>
				<div className="flex items-center justify-between">
					<span>Delivery charges</span>
					<span className="font-bold">₹{DELIVERY_CHARGES}</span>
				</div>
				<div className="flex items-center justify-between">
					<span>Discount</span>
					<span className="font-bold">₹{discountAmount}</span>
				</div>
				<hr />
				<div className="flex items-center justify-between">
					<span className="font-bold">Order total</span>
					<span className="font-bold flex flex-col items-end">
						<span className={discountPercentage ? "line-through text-gray-400" : "text-green-600"}>
							₹{grandWithoutDiscountTotal}
						</span>
						{discountPercentage ? <span className="text-green-600">₹{grandWithDiscountTotal}</span> : null}
					</span>
				</div>
				{discountError && <div className="text-red-500">{discountError}</div>}

				<div className="flex items-center gap-4">
					<Input id="coupon" name="code" type="text" className="w-full" placeholder="Coupon code" ref={couponCodeRef} />

					{/* todo: add loading.. */}
					<Button onClick={handleCouponValidation} variant={"outline"}>
						Apply
					</Button>
				</div>

				<div className="text-right mt-6">
					<Button disabled={isPlaceOrderPending}>
						{isPlaceOrderPending ? (
							<span className="flex items-center gap-2">
								<LoaderCircle className="animate-spin" />
								<span>Please wait...</span>
							</span>
						) : (
							<span>Place order</span>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default OrderSummary;
