import { supabase } from '$lib/supabaseClient.js';
import { randomUUID } from 'crypto';

export const actions = {
    newTeam: async({ request, cookies }) => {
        const submission = await request.formData();
        const teamList = JSON.parse(submission.get('teamlist'));
        const teamName = submission.get('teamname');
        const teamId = randomUUID();

        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        let { players, teams } = user.user_metadata;
        let teamPlayers = [];

        let teamListIds = teamList.map(player => player.id);
        for (let i = 0; i < players.length; i++) {
            // Check if the player's ID is in the teamListIds array
            if (teamListIds.includes(players[i].id)) {
                teamPlayers.push({id: players[i].id, name: players[i].name});
                players[i].teams.push(teamId);
                let updatedPlayer = players[i];
                
                const { data, error } = await supabase.auth.updateUser({
                    data: { players: players }
                });
                if (error) console.log(error);
            }
        }
        teams.push({name: teamName, id: teamId, players: teamPlayers});
        const { data, error } = await supabase.auth.updateUser({
            data: { teams: teams }
        });
        if (error) console.log(error);
        
        return {teams: teams, players: players}
    },
    deleteTeam: async({ request, cookies }) => {
        const submission = await request.formData();
        const teamId = submission.get("target");
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        let { players, teams } = user.user_metadata;

        teams = teams.filter(t => t.id !== teamId);
        players.forEach(player => {
            player.teams = player.teams.filter(team => team.id != teamId);
        });
        const { data, error } = await supabase.auth.updateUser({
            data: { players: players, teams: teams }
        });
        if (error) console.log(error);

    }
};