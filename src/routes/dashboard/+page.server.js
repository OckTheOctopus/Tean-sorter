import { supabase } from '$lib/supabaseClient.js'; // Import Supabase client for authentication
import { fail, redirect } from '@sveltejs/kit'; // Import fail and redirect functions for error handling and redirection
import { userSession } from '$lib/sessionStore.svelte.js'; // Import userSession for managing user session

// Define actions for handling sign out functionality
export const actions = {
    signOut: async ({ cookies, url }) => {
        // Attempt to sign out the user from Supabase
        let { error } = await supabase.auth.signOut();
        // If there's an error during sign out, log the error and return a failure response
        if (error) {
            console.log(error);
            return fail(300, { isError: true });
        }
        // Clear the session cookie
        cookies.delete('session', { path: '/', domain: url });
        // Clear the session from the userSession store
        userSession.setSession(null);
        // Redirect the user to the root URL after successful sign out
        throw redirect(303, '/');
    }
};