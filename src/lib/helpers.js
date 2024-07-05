import { supabase } from '$lib/supabaseClient.js';

export default async function addPlayer(userMetadata, playerId, playerName, playerSkills, isGoalie, isLeftHanded, playerTeams) {
    isGoalie ? isGoalie = true : isGoalie = false;
    isLeftHanded ? isLeftHanded = true : isLeftHanded = false;
    
    const playerData = {
        id: playerId,
        name: playerName,
        skills: playerSkills,
        goalie: isGoalie,
        leftHanded: isLeftHanded,
        teams: playerTeams,
        update: (property, value) => {
            if (property != 'id') {
                playerData[property] = value;
            } else {
                console.log('Cannot update value of id.')
            }
        },
        addTeam: team => {
            playerData.teams.push(team);
        },
        removeTeam: team => {
            playerData.teams = playerData.teams.filter(t => t != team);
        }
    };
    console.log(playerData);
    const { data, error } = await supabase.auth.updateUser({
        data: { players: [...userMetadata.players, playerData] }
    });
    if (error) {
        console.log(error);
    }
}