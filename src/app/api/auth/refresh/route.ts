import { cookies } from "next/headers";
import cookie from "cookie";

export async function POST() {
	const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/refresh`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
			Cookie: `Bearer ${cookies().get("refreshToken")?.value}`,
		},
	});

	if (!response.ok) {
		console.log("refresh failed");
		return Response.json({ success: false });
	}

	const responseCookies = response.headers.getSetCookie();
	const accessToken = responseCookies.find((cookie) => cookie.includes("accessToken"));
	const refreshToken = responseCookies.find((cookie) => cookie.includes("refreshToken"));

	if (!accessToken || !refreshToken) {
		console.log("token could not found");
		return Response.json({ success: false });
	}
	const parsedAccessToken = cookie.parse(accessToken);
	const parsedRefreshToken = cookie.parse(refreshToken);

	cookies().set({
		name: "accessToken",
		value: parsedAccessToken.accessToken,
		expires: new Date(parsedAccessToken.expires),
		// todo:check auth service for httpOnly parameter
		httpOnly: (parsedAccessToken.httpOnly as unknown as boolean) || true,
		path: parsedAccessToken.path,
		domain: parsedAccessToken.domain,
		sameSite: parsedAccessToken.SameSite as "strict",
	});

	cookies().set({
		name: "refreshToken",
		value: parsedRefreshToken.refreshToken,
		expires: new Date(parsedRefreshToken.expires),
		// todo:check auth service for httpOnly parameter
		httpOnly: (parsedRefreshToken.httpOnly as unknown as boolean) || true,
		path: parsedRefreshToken.path,
		domain: parsedRefreshToken.domain,
		sameSite: parsedRefreshToken.SameSite as "strict",
	});

	return Response.json({ sucess: true });
}
