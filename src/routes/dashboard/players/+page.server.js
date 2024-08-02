import { supabase } from '$lib/supabaseClient.js'; // Import Supabase client for database operations
import { addPlayer } from '$lib/helpers.js'; // Import helper function to add a new player
import { randomUUID } from 'crypto'; // Import function to generate a random UUID

// Define actions for handling player operations
export const actions = {
    // Action to handle new player creation
    newPlayer: async({ request, cookies }) => {
        // Extract form data from the request
        const submission = await request.formData();
        // Extract player details from the form data
        const name = submission.get('name');
        const skills = submission.get('skills');
        const isGoalie = submission.get('isGoalie');
        const isLeftHanded = submission.get('isLeftHanded');

        // Retrieve the current user from the session
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        // Add the new player to the user's metadata
        addPlayer(user.user_metadata, randomUUID(), name, skills, isGoalie, isLeftHanded, []);
        // Return success status
        return { success: true }
    },
    // Action to handle player editing
    editPlayer: async({ request, cookies }) => {
        // Extract form data from the request
        const submission = await request.formData();
        // Extract player details from the form data
        const name = submission.get('name');
        const skills = submission.get('skills');
        const goalie = submission.get('isGoalie');
        const isLeftHanded = submission.get('isLeftHanded');
        const playerId = submission.get('playerid');

        // Retrieve the current user from the session
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        // Update the player details in the user's metadata
        let { players } = user.user_metadata;
        players.forEach(player => {
            if (player.id === playerId) {
                player.name = name;
                player.skills = skills;
                player.goalie = goalie;
                player.leftHanded = isLeftHanded;
            }
        });
        // Update the user's metadata with the updated players list
        const { data, error } = await supabase.auth.updateUser({
            data: { players: players }
        });
        if (error) console.log(error);
        console.log(players);
    },
    // Action to handle player deletion
    deletePlayer: async({ request, cookies }) => {
        // Extract form data from the request
        const submission = await request.formData();
        // Extract the player ID to be deleted
        const playerId = submission.get('target');
        // Retrieve the current user from the session
        const { data: {user} } = await supabase.auth.getUser(cookies.get('session'));
        // Retrieve the user's metadata
        let { players, teams } = user.user_metadata;

        // Remove the player from the players list
        players = players.filter(player => player.id !== playerId);

        // Remove the player from each team
        teams.forEach(team => {
            team.players = team.players.filter(player => player.id !== playerId);
        });
        console.log(players[2]?.id);
        console.log(playerId);
        // Update the user's metadata with the updated players and teams lists
        const { data, error } = await supabase.auth.updateUser({
            data: { players: players, teams: teams }
        });
        if (error) console.log(error);
    }
};