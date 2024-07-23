<script>
    import { enhance } from '$app/forms';
    import { sortTeams } from '$lib/helpers.js';
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

    let matchMaking = $state(false);
    let teamMatchMaking = $state();
    let numTeamsMatchMaking = $state([2, 3, 4]);
    let sortedTeams = $state([]);
    let secondModalOpen = $state(false);
    let sortedTeamsJSON = $state();
    const quickMatch = numTeams => {
        sortedTeams = [];
        let teamArr = [];
        teamMatchMaking.players.forEach(player => {
            let searchedPlayer = playerData.find(p => p.id === player.id);
            if (searchedPlayer) {
                teamArr.push(searchedPlayer);
            }
        });
        secondModalOpen = true;
        sortedTeams = sortTeams(teamArr, numTeams, 'quick');
    }

    let saveTeamName = $state('');
    let saveTeamHiddens = $state([true, true, true]);

</script>

<button onclick={() => open = true}>Create team</button>

<dialog {open}>
    {#if matchMaking}
        <h1>Number of teams:</h1>
        {#each numTeamsMatchMaking as teamNum (teamNum)}
            <button onclick={() => {open = false; quickMatch(teamNum)}}>{teamNum}</button>
        {/each}
        <br>
    {:else}
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
        
        <p>Team members:</p>
        {#each teamList as player}
        <div>
            {player.name} <button onclick={() => {removePlayer(player)}}>Remove player</button>
        </div>
        {/each}
        
        <form method="post" action="?/newTeam" use:enhance>
            <input type="text" bind:value={teamListJSON} name="teamlist" hidden>
            <input type="text" bind:value={teamName} name="teamname" hidden>
            <input type="submit" value="Create Team" onclick={() => open = false}>
        </form>
        {/if}
    <button onclick={() => {matchMaking = false; open = false}}>Close</button>
        
</dialog>

<form method="post" action="?/deleteTeam" id='delete-team' use:enhance>
    <input type="text" name="target" value={targetTeam} hidden>
</form>

<p>Teams:</p>
{#each data?.teams as team (team.id)}
    <h2>{team.name} 
        <button onclick={() => {
            matchMaking = true;
            open = true;
            teamMatchMaking = team;
        }}>
            Friendly match
        </button>
        <input name="deleteTeam" form="delete-team" type="submit" value="Delete team" onclick={() => targetTeam = team.id} >
    </h2>
    {#each team.players as player}
        <p>{player.name}</p>
        {/each}
    {/each}
<dialog open={secondModalOpen}>
    <h1>Friendly match teams:</h1>
    {#each sortedTeams as team, i}
        <h2>
            Team {i + 1}
            <button onclick={() => saveTeamHiddens[i] = false}>Save team</button>
            <form method='post' action='?/newTeam' use:enhance>
                <input type="text" bind:value={sortedTeamsJSON} name="teamlist" hidden>
                <input type="text" bind:value={saveTeamName} name="teamname" hidden={saveTeamHiddens[i]}>
                <input type="submit" value="Create Team" hidden={saveTeamHiddens[i]} onclick={() => {
                    sortedTeamsJSON = JSON.stringify(sortedTeams[i]);
                    saveTeamHiddens[i] = true;
                }}>
            </form>
        </h2>
        {#each team as player}
            <p>{player?.name}</p>
        {/each}
    {/each}
    <button onclick={() => secondModalOpen = false}>Close</button>
</dialog>