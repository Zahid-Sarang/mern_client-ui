import Link from "next/link";

const NotFound = ({ searchParams }: { searchParams: { restaurantId: string } }) => {
	return (
		<main className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<div className="bg-white p-10 rounded shadow-lg text-center">
				<h1 className="text-6xl font-bold text-red-500">404</h1>
				<h2 className="text-2xl mt-4">Oops! Page not found.</h2>

				<p className="mt-2 text-gray-600">Sorry, the page you're looking for doesn't exist.</p>

				<div className="mt-6">
					<Link
						href={`/?restaurantId=${searchParams.restaurantId}`}
						className="inline-block px-6 py-2 text-white bg-primary rounded hover:bg-primary-dark"
					>
						Go to Dashboard
					</Link>
				</div>
			</div>
		</main>
	);
};

export default NotFound;
