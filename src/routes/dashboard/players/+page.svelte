<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
    let open = $state(false);
    let targetPlayer = $state();
    let sliderValue = $state(1);

    let secondModalOpen = $state(false);
    let playerEditInfo = $state({});
</script>
<div class="page">
    <h1>Your Players</h1>
    <div class="navlinks">
        <a href="/dashboard">Dashboard</a>
        <a href="/dashboard/teams">Teams</a>
    </div>
    <button onclick={() => open = true}>Add players</button>
    
    <dialog {open}>
        <div>
            <h1>Add new player</h1>
            <form method="post" action="?/newPlayer" use:enhance>
                <label for="name">Player name:</label><input type="text" name="name" required>
                <br>
                <label for="name">Skill level: {sliderValue}</label><input type="range" min="1" max="10" name="skills" bind:value={sliderValue}>
                <br>
                <label for="name">Goalie?</label><input type="checkbox" name='isGoalie'>
                <br>
                <label for="name">Left handed?</label><input type="checkbox" name='isLeftHanded'>
                <br>
                <input type="submit">
            </form>
            <button onclick={() => open = false}>Close dialog</button>
        </div>
    </dialog>
    
    <dialog open={secondModalOpen}>
        <div>
            <form method="post" action="?/editPlayer" use:enhance>
                <label for="name">Player name:</label><input type="text" name="name" bind:value={playerEditInfo.name} required>
                <br>
                <label for="name">Skill level: {playerEditInfo.skills}</label><input type="range" min="1" max="10" name="skills" bind:value={playerEditInfo.skills}>
                <br>
                <label for="name">Goalie?</label><input type="checkbox" name='isGoalie' bind:checked={playerEditInfo.goalie}>
                <br>
                <label for="name">Left handed?</label><input type="checkbox" name='isLeftHanded' bind:checked={playerEditInfo.leftHanded}>
                <input type="text" name="playerid" hidden bind:value={playerEditInfo.id}>
                <br>
                <input type="submit">
            </form>
            <button onclick={() => secondModalOpen = false}>Close</button>
        </div>
    </dialog>
    
    <form method="post" action="?/deletePlayer" id='delete-player' use:enhance>
        <input type="text" name="target" value={targetPlayer} hidden>
    </form>
    
    
    <h2>Players list:</h2>
    <div class="players-list">
        {#each data.players as player (player.id)}
            <p>{player.name}: {player.skills}, Goalie: {player.goalie} 
                <button onclick={() => {
                    playerEditInfo = player;
                    secondModalOpen = true;
                }}>
                    Edit player
                </button>
                <input name="deletePlayer" form="delete-player" type="submit" value="Delete player" onclick={() => targetPlayer = player.id} >
            </p>
        {/each}
    </div>
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
        h2 {
            margin-left: 2vw;
        }
        .players-list {
            margin-left: 2vw;
            p {
                input {
                    height: 3em;
                    width: 7em;
                    margin-left: 2vw;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1em;
                    transition: all 350ms ease-in 50ms;
                }
                input:hover {
                    background-color: $tertiary;
                }
            }
        }
    }
</style>