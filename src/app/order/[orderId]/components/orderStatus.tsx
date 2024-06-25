"use client";

import { Step, StepItem, Stepper, useStepper } from "@/components/stepper";
import { getSingleOrder } from "@/lib/http/api";
import { Order } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { CheckCheck, FileCheck, Microwave, Package, PackageCheck } from "lucide-react";
import React from "react";

const steps = [
	{ label: "Recieved", icon: FileCheck, description: "We are confirming your order" },
	{ label: "Confirmed", icon: Package, description: "We have started preparing your order" },
	{ label: "Prepared", icon: Microwave, description: "Ready for the pickup" },
	{ label: "Out for delivery", icon: PackageCheck, description: "Driver is on the way" },
	{ label: "Delivery", icon: CheckCheck, description: "Order completed" },
] satisfies StepItem[];

const statusMapping = {
	received: 0,
	confirmed: 1,
	prepared: 2,
	out_for_delivery: 3,
	delivered: 4,
} as { [key: string]: number };

const StepperChanger = ({ orderId }: { orderId: string }) => {
	const { setStep, nextStep } = useStepper();

	const { data } = useQuery<Order>({
		queryKey: ["order-status"],
		queryFn: async () => {
			return await getSingleOrder(orderId).then((res) => res.data);
		},
		refetchInterval: 1000 * 30, // every 30 seconds
	});
	console.log(data);

	React.useEffect(() => {
		if (data) {
			const currentStep = statusMapping[data.orderStatus] || 0;
			setStep(currentStep + 1);
		}
	}, [data, setStep]);
	return <></>;
};

const OrderStatus = ({ orderId }: { orderId: string }) => {
	return (
		<Stepper initialStep={0} steps={steps} variant="circle-alt" className="py-8">
			{steps.map(({ label, icon }) => {
				return <Step key={label} label={label} checkIcon={icon} icon={icon}></Step>;
			})}

			<StepperChanger orderId={orderId} />
		</Stepper>
	);
};

export default OrderStatus;
