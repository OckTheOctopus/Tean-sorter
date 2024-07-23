<script>
    import {sortTeams} from '$lib/helpers.js'
    let { form, data } = $props();
    let open = $state(false);
    let playersList = $state([]);
    let currentIndex = $state(0);
    let name = $state();
    let skillLevel = $state(1);
    let isGoalie = $state();
    let numTeams = $state();

    let teams = $state([]);

    const updatePlayersList = () => {
        playersList.push({name: name, skillLevel: skillLevel, isGoalie: isGoalie});
        currentIndex++;
        name = '';
        skillLevel = 1;
        isGoalie = false;
    }

    const teamSorter = () => {
        teams = sortTeams(playersList, numTeams, 'quick');
        console.log(teams);
    }
</script>

<p>Welcome to the dashboard, {data.displayName}!</p>    
<button onclick={() => open = true}>Quick Match</button>
<br>
<a href="/dashboard/players">Players</a>
<br>
<a href="/dashboard/teams">Teams</a>
<br>
<form method="post" action="?/signOut">
    <input type="submit" value='Sign out'>
</form>

<dialog {open}>
    {#if !playersList.length || currentIndex >= playersList.length}
        <label for="name">Name:</label><input type="text" name="name" bind:value={name}>
        <br>
        <label for="skill">Skill level:</label><input type="range" name="skill" bind:value={skillLevel} min="1" max="10">
        <br>
        <label for="isgoalie">Goalie? </label><input type="checkbox" name="isgoalie" bind:checked={isGoalie}>
        <br>
        <button onclick={updatePlayersList}>Add player</button>
    {:else}
        <label for="name">Name:</label><input type="text" name="name" bind:value={playersList[currentIndex].name}>
        <br>
        <label for="skill">Skill level:</label><input type="range" name="skill" bind:value={playersList[currentIndex].skillLevel} min="1" max="10">
        <br>
        <label for="isgoalie">Goalie? </label><input type="checkbox" name="isgoalie" bind:checked={playersList[currentIndex].isGoalie}>
        <br>
        <button onclick={() => {playersList[currentIndex] = {name: playersList[currentIndex].name, skillLevel: playersList[currentIndex].skillLevel, isGoalie: playersList[currentIndex].isGoalie}; alert("Player updated successfully")}}>Update player</button>
        <button onclick={() => currentIndex = playersList.length}>Create new player</button>
    {/if}
    <label for="numTeams">Number of teams: {numTeams}</label><input type="range" name="numTeams" bind:value={numTeams} min="2" max="4">

    {#if currentIndex != playersList.length - 1}
        <button onclick={() => currentIndex++}>Next</button>
    {/if}
    {#if playersList.length && currentIndex != 0}
        <button onclick={() => currentIndex--}>Back</button>
    {/if}
    <button onclick={() => open = false}>Close</button> 
</dialog>

{#if playersList.length > 1}
    <button onclick={teamSorter}>Create teams</button>
{/if}

{#each teams as team, teamIndex}
    <h2>Team {teamIndex + 1}</h2>
    {#each team as player}
        <p>{player.name}</p>
    {/each}
{/each}