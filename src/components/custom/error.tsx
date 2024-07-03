import Link from "next/link";
import React from "react";

const ErrorComponent = ({ errorMessage }: { errorMessage: string }) => {
	return (
		<main className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<div className="bg-white p-10 rounded shadow-lg text-center">
				<h1 className="text-4xl font-bold text-red-500">Error</h1>
				<h2 className="text-2xl mt-4">Something went wrong</h2>
				<p className="mt-2 text-gray-600">
					{errorMessage || "An unexpected error has occurred. Please try again later."}
				</p>
				<p className="mt-2 text-gray-600">
					You can go back to the
					<Link className="text-primary ml-1" href={`/`}>
						Dashboard
					</Link>
				</p>
				<div className="mt-6">
					<Link href={`/`} className="inline-block px-6 py-2 text-white bg-primary rounded hover:bg-primary-dark">
						Go to Dashboard
					</Link>
				</div>
			</div>
		</main>
	);
};

export default ErrorComponent;
