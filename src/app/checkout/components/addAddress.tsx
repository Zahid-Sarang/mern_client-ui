"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddress } from "@/lib/http/api";

const FormSchema = z.object({
	address: z.string().min(2, {
		message: "Address must be at least 2 characters",
	}),
});

const AddAddress = ({ customerId }: { customerId: string }) => {
	const [isModelOpen, setIsModelOpen] = useState(false);
	const queryClient = useQueryClient();

	const addressForm = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const { mutate, isPending, isError, error } = useMutation({
		mutationKey: ["address", customerId],
		mutationFn: async (address: string) => {
			return await addAddress(customerId, address);
		},
		onSuccess: () => {
			addressForm.reset();
			setIsModelOpen(false);
			return queryClient.invalidateQueries({ queryKey: ["customer"] });
		},
	});

	const handleAddressAdd = (data: z.infer<typeof FormSchema>) => {
		console.log("data", data);
		mutate(data.address);
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
			<DialogTrigger asChild>
				<Button size={"sm"} variant={"link"}>
					<Plus size={"16"} />
					<span className="ml-2">Add New Address</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				{isError && (
					<div className="font-semibold text-red-500">
						<p>{error.message}</p>
					</div>
				)}
				<Form {...addressForm}>
					<form onSubmit={addressForm.handleSubmit(handleAddressAdd)}>
						<DialogHeader>
							<DialogTitle>Add Address</DialogTitle>
							<DialogDescription>We can save your address for next time order.</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div>
								<Label htmlFor="address">Address</Label>
								<FormField
									name="address"
									control={addressForm.control}
									render={({ field }) => {
										return (
											<FormItem>
												<FormControl>
													<Textarea className="mt-2" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">
								{isPending ? (
									<div className="flex items-center gap-2">
										<LoaderCircle className="animate-spin" />
										<span>Please wait</span>
									</div>
								) : (
									"Save Changes"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddAddress;
