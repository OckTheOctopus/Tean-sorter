import { supabase } from '$lib/supabaseClient.js'; // Import Supabase client for authentication
import { redirect } from '@sveltejs/kit'; // Import redirect function for redirecting the user

export async function load({ locals, cookies }) {
    // Check if the user is already authenticated and stored in locals
    if (locals.user) {
        // If the user is already authenticated, return the user object
        return {
            user: locals.user
        };
    }

    // If the user is not authenticated, try to get the session token from the cookie
    const sessionToken = cookies.get('session');

    if (sessionToken) {
        // Attempt to verify the session token with Supabase
        const { data, error } = await supabase.auth.getUser(sessionToken);

        if (error) {
            // If there's an error (e.g., expired token), clear the session cookie
            cookies.delete('session', { path: '/' });
            // Redirect the user to the login page
            throw redirect(301, '/login');
        }

        if (data?.user) {
            // If the session is valid, set the user in locals for future requests
            locals.user = data.user;
            // Extract user's first name, players, and teams from the user metadata
            const userName = data.user.user_metadata.first_name;
            const { players, teams } = data.user.user_metadata;
            // Return the user's display name, players, and teams
            return { displayName: userName, players: players, teams: teams };
        }
    }

    // If no valid session is found, redirect the user to the login page
    throw redirect(303, '/login');
}
