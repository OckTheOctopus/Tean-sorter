import { supabase } from "$lib/supabaseClient";
import { fail, redirect } from "@sveltejs/kit";

export async function load() {
    const { data } = await supabase.from("countries").select();
    return {
      countries: data ?? [],
    };
}
export const actions = {
    signup: async ({ request }) => {
        const submission = await request.formData();
        console.log(submission)
        const email = submission.get('email');
        const password = submission.get('password');
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        if (!error) {
            return { success: true }
        } else {
            return fail(400, { email, genericError: true, errorMsg: error.message});
        }
    }
}