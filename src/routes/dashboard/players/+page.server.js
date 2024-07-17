import { supabase } from '$lib/supabaseClient.js';
import {addPlayer} from '$lib/helpers.js';
import { randomUUID } from 'crypto';

export const actions = {
    newPlayer: async({ request, cookies }) => {
        const submission = await request.formData();
        const name = submission.get('name');
        const skills = submission.get('skills');
        const isGoalie = submission.get('isGoalie');
        const isLeftHanded = submission.get('isLeftHanded');

        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        addPlayer(user.user_metadata, randomUUID(), name, skills, isGoalie, isLeftHanded, []);
        return { success: true }
    },
    deletePlayer: async({ request, cookies }) => {
        const submission = await request.formData();
        const playerId = submission.get('target');
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        let { players } = user.user_metadata;
        players.forEach(player => {
            if (player.id === playerId) {
                players = players.filter(p => p.id !== playerId);
            }
        });
        const { data, error } = await supabase.auth.updateUser({
            data: { players: players }
        });
        if (error) console.log(error);
    }
};