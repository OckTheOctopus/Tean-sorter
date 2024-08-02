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

    let targetPlayer = $state();

</script>

<div class="page">
    <h1>Your Players</h1>
    <div class="navlinks">
        <a href="/dashboard">Dashboard</a>
        <a href="/dashboard/teams">Teams</a>
    </div>
    
    <button onclick={() => open = true}>Create team</button>
    
    <dialog {open}>
        <div>
            {#if matchMaking}
                <h1>Number of teams:</h1>
                {#each numTeamsMatchMaking as teamNum (teamNum)}
                    <button onclick={() => {open = false; quickMatch(teamNum)}}>{teamNum}</button>
                {/each}
                <br>
            {:else}
                <label for="name">Team name: </label><input type="text" name="name" required bind:value={teamName}>
                <br>
                <p>Players</p>
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
        </div>
    </dialog>
    
    <form method="post" action="?/deleteTeam" id='delete-team' use:enhance>
        <input type="text" name="target" value={targetTeam} hidden>
    </form>
    
    <h2>Teams:</h2>
    <div class="teams-list">
        {#each data?.teams as team (team.id)}
            <h3>{team.name} 
                <button onclick={() => {
                    matchMaking = true;
                    open = true;
                    teamMatchMaking = team;
                }}>
                    Friendly match
                </button>
                <input name="deleteTeam" form="delete-team" type="submit" value="Delete team" onclick={() => targetTeam = team.id} >
            </h3>
            {#each team.players as player}
                <ul class="player">
                    <li>
                        {player.name}
                        <input name="deletePlayer" form="delete-player" type="submit" value="Delete player" onclick={() => targetPlayer = player.id} >
                    </li>
                </ul>
                {/each}
            {/each}
    </div>
    <dialog open={secondModalOpen}>
        <div>
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
                    <p>
                        {player?.name}
                        <input name="deletePlayer" form="delete-player" type="submit" value="Delete player" onclick={() => targetPlayer = player.id} >
                    </p>
                {/each}
            {/each}
            <button onclick={() => secondModalOpen = false}>Close</button>
        </div>
    </dialog>
    
    <form method="post" action="/dashboard/players?/deletePlayer" id='delete-player' use:enhance>
        <input type="text" name="target" value={targetPlayer} hidden>
    </form>
</div>

<style lang="scss">
    @use '$lib/styles/_base' as *;
    .page {
        h1 {
            text-align: center;
        }
        .navlinks {
            display: flex;
            justify-content: center;
            gap: 5%;
            a {
                font-size: 1.2em;
            }
        }
        button {
            margin-left: 2vw;
            height: 3em;
            width: 7em;
        }
        h2, h3 {
            margin-left: 2vw;
        }
        li {
            color: $primary;
            margin-left: 4vw;
        }
        .teams-list {
            h3 {
                display: flex;
                align-items: center;
                button, input {
                    margin-right: 2vw;
                    height: 3em;
                    width: 7em;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1em;
                    transition: all 350ms ease-in 50ms;
                }
                input:hover {
                    background-color: $tertiary;
                }
            }
            .player {
                input {
                    height: 3em;
                    width: 7em;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1em;
                    margin-left: 1vw;
                    transition: all 350ms ease-in 50ms;
                }
                input:hover {
                    background-color: $tertiary;
                }
            }
        }
    }
</style>