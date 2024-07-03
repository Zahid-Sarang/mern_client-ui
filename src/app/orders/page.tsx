import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Order } from "@/lib/types";
import { cookies } from "next/headers";
import Link from "next/link";

const Orders = async ({
	searchParams,
}: {
	searchParams: { currentPage: number; perPage: number; restaurantId: string };
}) => {
	const currentPage = searchParams.currentPage ? searchParams.currentPage : 1;
	const perPage = searchParams.perPage ? searchParams.perPage : 8;
	const restaurantId = searchParams.restaurantId && searchParams.restaurantId;

	const response = await fetch(
		`${process.env.BACKEND_URL}/api/order/orders/mine?currentPage=${currentPage}&perPage=${perPage}`,
		{
			headers: {
				Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
			},
		}
	);
	if (!response.ok) {
		return (
			<h1 className="text-base font-bold text-red-500 flex justify-center items-center mt-5">
				Error while fetching your order
			</h1>
		);
	}

	const orders = (await response.json()) || [];
	const totalPages = Math.ceil(orders.total / Number(perPage));

	return (
		<div className="container mt-8">
			<Card>
				<CardHeader className="px-7">
					<CardTitle>Orders</CardTitle>
					<CardDescription>My complete order history.</CardDescription>
				</CardHeader>
				<CardContent>
					{orders.data.length === 0 ? (
						"No orders yet"
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">ID</TableHead>
									<TableHead>Payment Status</TableHead>
									<TableHead>Payment Method</TableHead>
									<TableHead>Date Time</TableHead>
									<TableHead>Order Status</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead className="text-right">Details</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{orders.data.map((order: Order) => {
									return (
										<TableRow key={order._id}>
											<TableCell className="font-medium">{order._id}</TableCell>
											<TableCell>{order.paymentStatus.toUpperCase()}</TableCell>
											<TableCell>{order.paymentMode}</TableCell>
											<TableCell>{order.createdAt}</TableCell>
											<TableCell>
												<Badge variant={"outline"}>{order.orderStatus.toUpperCase()}</Badge>
											</TableCell>
											{/* make sure total is grant total */}
											<TableCell>₹{order.total}</TableCell>
											<TableCell className="text-right">
												<Link href={`/order/${order._id}`} className="underline text-primary">
													More details
												</Link>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
			<Pagination className="mt-5">
				<PaginationContent>
					<PaginationItem hidden={currentPage <= 1}>
						<PaginationPrevious
							href={`/orders?restaurantId=${restaurantId}&currentPage=${Number(currentPage) - 1}&perPage=${perPage}`}
							className="text-primary hover:text-blue-700"
						/>
					</PaginationItem>
					{Array.from({ length: totalPages }, (_, index) => (
						<PaginationItem key={index}>
							<PaginationLink
								href={`/orders?restaurantId=${restaurantId}&currentPage=${index + 1}&perPage=${perPage}`}
								className={`${
									Number(currentPage) === index + 1 ? "bg-primary text-white" : "text-primary"
								} hover:bg-primary hover:text-white px-3 py-1 rounded`}
							>
								{index + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem hidden={currentPage >= totalPages}>
						<PaginationNext
							href={`/orders?restaurantId=${restaurantId}&currentPage=${Number(currentPage) + 1}&perPage=${perPage}`}
							className="text-primary hover:text-blue-700"
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};

export default Orders;
