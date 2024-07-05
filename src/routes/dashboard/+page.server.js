import { supabase } from '$lib/supabaseClient.js';
import { fail, redirect } from '@sveltejs/kit';
import { userSession } from '$lib/sessionStore.svelte.js';


export const actions = {
    signOut: async ({ cookies, url }) => {
        let { error } = await supabase.auth.signOut()
        if (error) {
            console.log(error);
            return fail(300, { isError: true });
        }
        cookies = 'session=; Max-Age=0; path=/; domain=' + url;
        userSession.setSession(null);
        throw redirect(303, '/');
    }
};