<script>
    import { enhance } from '$app/forms'
    let { data } = $props();
    let open = $state(false);
    let targetPlayer = $state();
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

<form method="post" action="?/deletePlayer" id='delete-player' use:enhance>
    <input type="text" name="target" value={targetPlayer} hidden>
</form>

<p>Players:</p>
{#each data.players as player (player.id)}
    <p>{player.name}: {player.skills}, Goalie: {player.goalie} <input name="deletePlayer" form="delete-player" type="submit" value="Delete player" onclick={() => {targetPlayer = player.id; confirm(`Are you sure you want to delete ${player.name}?`)}} ></p>
{/each}