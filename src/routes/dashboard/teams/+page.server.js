import { supabase } from '$lib/supabaseClient.js'; // Import Supabase client for database operations
import { randomUUID } from 'crypto'; // Import function to generate a random UUID

// Define actions for handling team operations
export const actions = {
    // Action to handle new team creation
    newTeam: async({ request, cookies }) => {
        // Extract form data from the request
        const submission = await request.formData();
        // Extract team list and team name from the form data
        let teamList = submission.get('teamlist');
        if (teamList) {
            teamList = JSON.parse(teamList);
        } else {
            return { error: "Invalid team data"}
        }
        const teamName = submission.get('teamname');
        
        // Generate a unique ID for the new team
        const teamId = randomUUID();

        // Retrieve the current user from the session
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        // Extract user metadata
        let { players, teams } = user.user_metadata;
        // Initialize an array to hold team players
        let teamPlayers = [];

        // Convert team list to IDs for easier comparison
        let teamListIds = teamList.map(player => player.id);
        // Iterate through the user's players to find those in the team list
        for (let i = 0; i < players.length; i++) {
            // Check if the player's ID is in the teamListIds array
            if (teamListIds.includes(players[i].id)) {
                // Add the player to the teamPlayers array
                teamPlayers.push({id: players[i].id, name: players[i].name});
                // Add the team ID to the player's teams array
                players[i].teams.push(teamId);
                // Update the player with the new team
                let updatedPlayer = players[i];
                
                // Update the user's players with the updated player
                const { data, error } = await supabase.auth.updateUser({
                    data: { players: players }
                });
                if (error) console.log(error);
            }
        }
        // Add the new team to the user's teams array
        teams.push({name: teamName, id: teamId, players: teamPlayers});
        // Update the user's teams with the new team
        const { data, error } = await supabase.auth.updateUser({
            data: { teams: teams }
        });
        if (error) console.log(error);
        
        // Return the updated teams and players
        return {teams: teams, players: players}
    },
    // Action to handle team deletion
    deleteTeam: async({ request, cookies }) => {
        // Extract form data from the request
        const submission = await request.formData();
        // Extract the ID of the team to be deleted
        const teamId = submission.get("target");
        // Retrieve the current user from the session
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        // Extract user metadata
        let { players, teams } = user.user_metadata;

        // Remove the team from the user's teams array
        teams = teams.filter(t => t.id !== teamId);
        // Remove the team from each player's teams array
        players.forEach(player => {
            player.teams = player.teams.filter(team => team.id != teamId);
        });
        // Update the user's metadata with the updated teams and players
        const { data, error } = await supabase.auth.updateUser({
            data: { players: players, teams: teams }
        });
        if (error) console.log(error);

    }
};