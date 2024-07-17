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
        teams.push({name: teamName, id: teamId});
        const { data, error } = await supabase.auth.updateUser({
            data: { teams: teams }
        });
        if (error) console.log(error);
        
        let teamListIds = teamList.map(player => player.id);
        for (let i = 0; i < players.length; i++) {
            if (players[i].id === teamListIds[i]) {
                players[i].teams.push(teamId);
                let updatedPlayer = players[i];

                const { data, error } = await supabase.auth.updateUser({
                    data: { players: players }
                });
                if (error) console.log(error);
            }
        }

        console.log(teams);
        
        return {teams: teams, players: players}
    }
};