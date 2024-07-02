import { supabase } from "$lib/supabaseClient";
import { userSession } from "../../lib/sessionStore.svelte.js";
import { fail, redirect } from "@sveltejs/kit";

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
            throw redirect(303, '/dashboard');
        }
    }

    // No valid session
    return {
        user: null
    };
}
export const actions = {
    login: async ({ request, cookies }) => {
        const submission = await request.formData();
        const email = submission.get('email');
        const password = submission.get('password');
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error?.message === "Invalid login credentials") {
            return fail(400, { email, incorrect: true });
        } else if (error?.message === "Email not confirmed") {
            return fail(400, { email, unconfirmed: true});
        } else if (error?.message) {
            console.log(error);
            return fail(400, { email, genericError: true, returnedError: error });
        }

        if (data.session) {
            cookies.set('session', data.session.access_token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 * 4, // 4 weeks
            });

            userSession.setSession(data.user);

            throw redirect(302, '/dashboard');
        } else {
            return fail(400, { email, genericError: true, returnedError: 'No session data returned' });
        }
    }
}