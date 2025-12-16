import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";

/**
 * useCurrentUser Hook
 *
 * Fetches the currently authenticated user from Supabase.
 * Returns the user's ID or null if not authenticated.
 *
 * Usage:
 * const currentUserId = useCurrentUser();
 */
export function useCurrentUser() {
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				setUserId(user?.id || null);
			} catch (error) {
				console.error("Error fetching current user:", error);
				setUserId(null);
			}
		}

		fetchUser();
	}, []);

	return userId;
}
