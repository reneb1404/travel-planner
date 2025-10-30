import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
	baseURL: "http://192.168.178.177:3000",
});
