import { supabase } from "$lib/supabaseClient";
import { fail, redirect } from "@sveltejs/kit";

// This function is used to load the page
export async function load() {
}
// This object contains the actions for the page
export const actions = {
    // This action is used to sign up a new user
    signup: async ({ request }) => {
        const submission = await request.formData();
        const email = submission.get('email');
        const password = submission.get('password');
        const fname = submission.get('fname');
        const lname = submission.get('lname');
        // Sign up the user with Supabase
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: fname,
                    last_name: lname,
                    teams: [],
                    players: []
                }
            }
        });
        // If there is no error, redirect to the login page
        if (!error) {
            throw redirect(303, '/login')
        } else {
            // If there is an error, return a 400 status with the error message
            return fail(400, { email, genericError: true, errorMsg: error.message});
        }
    }
}