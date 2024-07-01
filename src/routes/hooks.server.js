import { supabase } from '$lib/supabaseClient';

export async function handle({ event, resolve }) {
    const sessionToken = event.cookies.get('session');

    if (sessionToken) {
        const { data, error } = await supabase.auth.getUser(sessionToken);
        if (data?.user) {
            event.locals.user = data.user;
        }
    }

    return resolve(event);
}