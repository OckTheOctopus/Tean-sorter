import { supabase } from '$lib/supabaseClient.js';

export async function addPlayer(userMetadata, playerId, playerName, playerSkills, isGoalie, isLeftHanded, playerTeams) {
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
    const { data, error } = await supabase.auth.updateUser({
        data: { players: [...userMetadata.players, playerData] }
    });
    if (error) {
        console.log(error);
    }
}

export function sortTeams(teamsList, numTeams, sortType = "thorough") {
    function calcMeanSkills(teams) {
        let meanSkills = [];
            for (let i = 0; i < numTeams; i++) {
                meanSkills.push({teamSkill: teams[i].reduce((acc, curr) => acc + curr, 0) / teams[i].length, teamNum: i});
            }
        meanSkills.sort((a, b) => a.skillLevel - b.skillLevel);
        return meanSkills;
    }
    let teams = [];
    if (sortType === 'quick') {
        let unevens = [];
        teamsList.sort((a, b) => b.skillLevel - a.skillLevel);
        if (teamsList.length % numTeams != 0) {
            unevens = teamsList.slice(-1 * (teamsList.length % numTeams));
            teamsList = teamsList.slice(0, -1 * (teamsList.length % numTeams));
        }
        let playersPerTeam = Math.floor(teamsList.length / numTeams);
        for (let i = 0; i < numTeams; i++) {
            teams.push([]);
        }
        for (let i = 0; i < teamsList.length; i++) {
            let player = teamsList[i];
            let groups = [];
            let closestPlayer = null;
            let closestDiff = Infinity;
            groups.push(player);
            teamsList = teamsList.filter(p => p != player);
            for (let j = 0; j < numTeams - 1; j++) {
                for (let k = 0; k < teamsList.length; k++) {
                    if (i != k) {
                        let diff = Math.abs(player.skillLevel - teamsList[k].skillLevel);
                        if (diff < closestDiff) {
                            closestDiff = diff;
                            closestPlayer = teamsList[k];
                            groups.push(closestPlayer);
                            teamsList = teamsList.filter(player => player != teamsList[k]);
                        }
                    }
                }
            }
            let teamMean = calcMeanSkills(teams);
            for (let j = 0; j < teamMean.length; j++) {
                teams[teamMean[j].teamNum].push(groups[j]);
            }
        }
        if (unevens.length) {
            let unevenTeams = calcMeanSkills(teams);
            for (let i = 0; i < unevens.length; i++) {
                teams[unevenTeams[i].teamNum].push(unevens[i]);
            }
        }
        return teams;
    }
}
