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

<div class="page">
    <h1>Welcome to the dashboard, {data.displayName}!</h1> 
    <div class="buttons-wrapper">
        <div class="ui-buttons">
            <button onclick={() => open = true} class='dashboard-button top-button'>
                <img src="plus.png" alt="Quick Match">
                Quick Match
            </button>
            <a href="/dashboard/players" class='dashboard-button'>
                <img src="/user.png" alt="View Players">
                Players
            </a>
            <a href="/dashboard/teams" class='dashboard-button'>
                <img src="/users.png" alt="View Teams">
                Teams
            </a>
            <form method="post" action="?/signOut">
                <button type="submit" id='signout-button'>
                    <img src="/signout.png" alt="Sign Out">
                    Sign out
                </button>
            </form>
        </div>   
    </div>
    
    <dialog {open}>
        <div>
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
        </div>
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
</div>

<style lang="scss">
    @use '$lib/styles/_base' as *;

    .page {
        h1 {
            margin-top: 5vh;
            text-align: center;
        }
        .buttons-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            .ui-buttons {
                width: 50%;
                height: 50%;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: auto;
                column-gap: 1%;
                row-gap: 10%;
                justify-items: center;
                .dashboard-button, form {
                    font-size: 2vw;
                    display: flex;
                    align-self: center;
                    justify-self: center;
                    flex-direction: column;
                    background-color: $primary;
                    width: 75%;
                    height: 75%;
                    aspect-ratio: 1;
                    color: white;
                    font-weight: bold;
                    transition: all 350ms ease-in 50ms;
                    border-radius: 25px;
                }
                form {
                    button {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        background-color: $primary;
                        height: 100%;
                    }
                }
                .dashboard-button:hover, #signout-button:hover {
                    background-color: $tertiary;
                }
                a {
                    color: white;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .top-button {
                    display: flex;
                    flex-direction: column;
                    background-color: $secondary;
                    align-items: center;
                    justify-content: center;
                    transition: all 350ms ease-in 50ms;
                    img {
                        width: 80%;
                        height: 80%;
                    }
                }
            }
        }
    }
</style>