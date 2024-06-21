import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/custom/header";
import StoreProvider from "./storeProvider";
import { Toaster } from "@/components/ui/toaster";
import Refresher from "@/components/custom/refresh";
import QueryProvider from "./QueryProvider";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-,manrope" });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<StoreProvider>
				<body className={cn("min-h-screen bg-background font-manrope antialiased", manrope.variable)}>
					<QueryProvider>
						<Refresher>
							<Header />
							<main>{children}</main>
							<Toaster />
						</Refresher>
					</QueryProvider>
				</body>
			</StoreProvider>
		</html>
	);
}
