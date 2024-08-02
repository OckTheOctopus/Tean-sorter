import { supabase } from '$lib/supabaseClient.js'; // Import the Supabase client for database operations

// Function to add a player to a user's metadata
export async function addPlayer(userMetadata, playerId, playerName, playerSkills, isGoalie, isLeftHanded, playerTeams) {
    // Normalize boolean values for isGoalie and isLeftHanded
    isGoalie ? isGoalie = true : isGoalie = false;
    isLeftHanded ? isLeftHanded = true : isLeftHanded = false;
    
    // Define the player data object
    const playerData = {
        id: playerId,
        name: playerName,
        skills: playerSkills,
        goalie: isGoalie,
        leftHanded: isLeftHanded,
        teams: playerTeams,
        // Method to update player properties
        update: (property, value) => {
            if (property != 'id') {
                playerData[property] = value;
            } else {
                console.log('Cannot update value of id.')
            }
        },
        // Method to add a team to the player's teams list
        addTeam: team => {
            playerData.teams.push(team);
        },
        // Method to remove a team from the player's teams list
        removeTeam: team => {
            playerData.teams = playerData.teams.filter(t => t != team);
        }
    };
    // Update the user's metadata with the new player data
    const { data, error } = await supabase.auth.updateUser({
        data: { players: [...userMetadata.players, playerData] }
    });
    if (error) {
        console.log(error);
    }
}

// Function to sort teams based on player skills
export function sortTeams(teamsList, numTeams, sortType = "thorough") {
    // Function to calculate the mean skills of each team
    // Function to calculate the mean skills of each team
    function calcMeanSkills(teams) {
        let meanSkills = [];
        for (let i = 0; i < numTeams; i++) {
            meanSkills.push({teamSkill: teams[i].reduce((acc, curr) => acc + curr, 0) / teams[i].length, teamNum: i});
        }
        meanSkills.sort((a, b) => a.skills - b.skills);
        return meanSkills;
    }
    // Initialize an empty array for teams
    let teams = [];
    // Check the sort type
    if (sortType === 'quick') {
        // Initialize an empty array for uneven teams
        let unevens = [];
        // Sort the teams list by skills in descending order
        teamsList.sort((a, b) => b.skills - a.skills);
        // If the number of players is not divisible by the number of teams, store the uneven players
        if (teamsList.length % numTeams != 0) {
            unevens = teamsList.slice(-1 * (teamsList.length % numTeams));
            teamsList = teamsList.slice(0, -1 * (teamsList.length % numTeams));
        }
        // Calculate the number of players per team
        let playersPerTeam = Math.floor(teamsList.length / numTeams);
        // Initialize the teams array with empty arrays
        for (let i = 0; i < numTeams; i++) {
            teams.push([]);
        }
        // Distribute the players into teams
        for (let i = 0; i < teamsList.length; i++) {
            let player = teamsList[i];
            let groups = [player]; // Start with the current player
            // Remove the current player from the teams list to avoid re-selection
            teamsList = teamsList.filter(p => p != player);
            // Loop to find the closest players to the current player
            for (let j = 0; j < numTeams - 1; j++) {
                let closestPlayer = null; // Initialize the closest player
                let closestDiff = Infinity; // Initialize the closest difference
                // Loop through the remaining players to find the closest
                for (let k = 0; k < teamsList.length; k++) {
                    let diff = Math.abs(player.skills - teamsList[k].skills); // Calculate the skill difference
                    if (diff < closestDiff) { // If the difference is smaller than the current closest
                        closestDiff = diff; // Update the closest difference
                        closestPlayer = teamsList[k]; // Update the closest player
                    }
                }
                // If a closest player is found, add them to the group and remove from the teams list
                if (closestPlayer) {
                    groups.push(closestPlayer);
                    teamsList = teamsList.filter(p => p != closestPlayer);
                }
            }
            // Calculate the mean skills of each team
            let teamMean = calcMeanSkills(teams);
            for (let j = 0; j < teamMean.length; j++) {
                teams[teamMean[j].teamNum].push(groups[j]);
            }
        }
        // If there are uneven players, distribute them to the teams
        if (unevens.length) {
            let unevenTeams = calcMeanSkills(teams);
            for (let i = 0; i < unevens.length; i++) {
                teams[unevenTeams[i].teamNum].push(unevens[i]);
            }
        }
        // Return the sorted teams
        return teams;
    }
}