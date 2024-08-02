import { supabase } from '$lib/supabaseClient'; // Importing the Supabase client

export async function handle({ event, resolve }) {
    // Extracting the session token from the event cookies
    const sessionToken = event.cookies.get('session');

    // If a session token is found, attempt to get the user details
    if (sessionToken) {
        // Using Supabase to get the user details based on the session token
        const { data, error } = await supabase.auth.getUser(sessionToken);
        // If the user data is found, assign it to the event.locals.user
        if (data?.user) {
            event.locals.user = data.user;
        }
    }

    // Resolve the event with the updated locals
    return resolve(event);
}