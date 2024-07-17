import { supabase } from '$lib/supabaseClient.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies }) {
     // Check if user is already set in locals
     if (locals.user) {
        return {
            user: locals.user
        };
    }

    // If not, try to get the session from the cookie
    const sessionToken = cookies.get('session');

    if (sessionToken) {
        // Verify the session with Supabase
        const { data, error } = await supabase.auth.getUser(sessionToken);

        if (error) {
            // If there's an error (e.g., expired token), clear the cookie
            cookies.delete('session', { path: '/' });
            return {
                user: null
            };
        }

        if (data?.user) {
            // Valid session, set user in locals for future requests
            locals.user = data.user;
            const userName = data.user.user_metadata.first_name;
            const { players, teams } = data.user.user_metadata;
            return { displayName: userName, players: players, teams: teams };
        }
    }

    // No valid session
    throw redirect(303, '/login');
}

