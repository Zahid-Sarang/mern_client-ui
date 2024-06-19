"use client";

import React, { useCallback, useEffect, useRef } from "react";
import * as jose from "jose";

const Refresher = ({ children }: { children: React.ReactNode }) => {
	const timeoutId = useRef<NodeJS.Timeout>();

	const getAccessToken = async () => {
		const res = await fetch("/api/auth/accessToken");

		if (!res.ok) {
			return;
		}

		const accessToken = await res.json();
		return accessToken.token;
	};

	const startRefreshing = useCallback(async () => {
		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}
		try {
			const accessToken = await getAccessToken();
			if (!accessToken) {
				return;
			}
			const token = await jose.decodeJwt(accessToken);

			const exp = token.exp! * 1000; // convert to milliseconds

			const currentTime = Date.now();

			const refreshTime = exp - currentTime - 5000;

			console.log(`Current time: ${new Date(currentTime).toISOString()}`);
			console.log(`Token expiry time: ${new Date(exp).toISOString()}`);
			console.log(`Scheduled refresh time: ${new Date(currentTime + refreshTime).toISOString()}`);

			timeoutId.current = setTimeout(() => {
				refreshAccessToken();
				console.log("Access token is refreshing...");
			}, refreshTime);
		} catch (err: any) {}
	}, []);

	const refreshAccessToken = async () => {
		try {
			const res = await fetch("/api/auth/refresh", { method: "POST" });

			if (!res.ok) {
				console.log("Failed to refresh access token");
			}
		} catch (err) {
			console.error("Error while refreshing the token", err);
		}
	};

	startRefreshing();

	useEffect(() => {
		startRefreshing();
		return () => {
			clearTimeout(timeoutId.current);
		};
	}, [startRefreshing, timeoutId]);
	return <div>{children}</div>;
};

export default Refresher;
