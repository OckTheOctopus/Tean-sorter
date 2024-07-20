<script>
    import { enhance } from '$app/forms';
    let { form, data } = $props();
    let playerData = $state(data?.players);
    let open = $state(false);
    let selected = $state();
    let teamList = $state([]);
    let teamName = $state('');
    let teamListJSON = $state([]);

    const appendPlayer = () => {
        if (!selected) return;
        teamList = [...teamList, selected];
        teamListJSON = JSON.stringify(teamList);
        playerData = playerData.filter(p => p.id != selected.id);
        selected = playerData[0] ?? '';
        console.log(teamList);
    }

    const removePlayer = player => {
        playerData = [...playerData, player];
        teamList = teamList.filter(p => p.id != player.id);
        teamListJSON = JSON.stringify(teamList) ?? [];
        selected = playerData[0] ?? '';
    }

    let targetTeam = $state();
</script>

<button onclick={() => open = true}>Create team</button>

<dialog {open}>
    <label for="name">Team name: </label><input type="text" name="name" required bind:value={teamName}>
    <br>
    <span>Players</span>
    <select bind:value={selected}>
        {#each playerData as player}
            <option value={player}>
                {player.name}
            </option>
        {/each}
    </select>
    <br>

    <button onclick={appendPlayer}>Add Player</button>
    
    <button onclick={() => open = false}>Close</button>
    <p>Team members:</p>
    {#each teamList as player}
        <div>
            {player.name} <button onclick={() => {removePlayer(player)}}>Remove player</button>
        </div>
    {/each}

    <form method="post" action="?/newTeam" use:enhance>
        <input type="text" bind:value={teamListJSON} name="teamlist" hidden>
        <input type="text" bind:value={teamName} name="teamname" hidden>
        <input type="submit" value="Create Team">
    </form>
    
</dialog>

<form method="post" action="?/deleteTeam" id='delete-team' use:enhance>
    <input type="text" name="target" value={targetTeam} hidden>
</form>

<p>Teams:</p>
{#each data?.teams as team (team.id)}
    <h2>{team.name} <input name="deleteTeam" form="delete-team" type="submit" value="Delete team" onclick={() => {targetTeam = team.id; confirm(`Are you sure you want to delete ${team.name}?`)}} ></h2>
    {#each team.players as player}
        <p>{player.name}</p>
    {/each}
{/each}