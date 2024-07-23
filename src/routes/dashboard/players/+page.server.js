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
    editPlayer: async({ request, cookies }) => {
        const submission = await request.formData();
        const name = submission.get('name');
        const skills = submission.get('skills');
        const goalie = submission.get('isGoalie');
        const isLeftHanded = submission.get('isLeftHanded');
        const playerId = submission.get('playerid');

        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        let { players } = user.user_metadata;
        players.forEach(player => {
            if (player.id === playerId) {
                player.name = name;
                player.skills = skills;
                player.goalie = goalie;
                player.leftHanded = isLeftHanded;
            }
        });
        const { data, error } = await supabase.auth.updateUser({
            data: { players: players }
        });
        if (error) console.log(error);
        console.log(players);
    },
    deletePlayer: async({ request, cookies }) => {
        const submission = await request.formData();
        const playerId = submission.get('target');
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        let { players, teams } = user.user_metadata;

        // Remove player from players list
        players = players.filter(player => player.id !== playerId);

        // Remove player from each team
        teams.forEach(team => {
            team.players = team.players.filter(player => player.id !== playerId);
        });
        console.log(players[2]?.id);
        console.log(playerId);
        const { data, error } = await supabase.auth.updateUser({
            data: { players: players, teams: teams }
        });
        if (error) console.log(error);
    }
};