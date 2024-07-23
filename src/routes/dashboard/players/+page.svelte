<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
    let open = $state(false);
    let targetPlayer = $state();

    let secondModalOpen = $state(false);
    let playerEditInfo = $state({});
</script>
<button onclick={() => open = true}>Add players</button>

<dialog {open}>
    <h1>Add new player</h1>
    <form method="post" action="?/newPlayer" use:enhance>
        <label for="name">Player name:</label><input type="text" name="name">
        <br>
        <label for="name">Skill level:</label><input type="number" name="skills">
        <br>
        <label for="name">Goalie?</label><input type="checkbox" name='isGoalie'>
        <br>
        <label for="name">Left handed?</label><input type="checkbox" name='isLeftHanded'>
        <br>
        <input type="submit">
    </form>
    <button onclick={() => open = false}>Close dialog</button>
</dialog>

<dialog open={secondModalOpen}>
    <form method="post" action="?/editPlayer" use:enhance>
        <label for="name">Player name:</label><input type="text" name="name" bind:value={playerEditInfo.name}>
        <br>
        <label for="name">Skill level:</label><input type="number" name="skills" bind:value={playerEditInfo.skills}>
        <br>
        <label for="name">Goalie?</label><input type="checkbox" name='isGoalie' bind:checked={playerEditInfo.goalie}>
        <br>
        <label for="name">Left handed?</label><input type="checkbox" name='isLeftHanded' bind:checked={playerEditInfo.leftHanded}>
        <input type="text" name="playerid" hidden bind:value={playerEditInfo.id}>
        <br>
        <input type="submit">
    </form>
    <button onclick={() => secondModalOpen = false}>Close</button>
</dialog>

<form method="post" action="?/deletePlayer" id='delete-player' use:enhance>
    <input type="text" name="target" value={targetPlayer} hidden>
</form>


<p>Players:</p>
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