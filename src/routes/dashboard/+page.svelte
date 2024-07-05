<script>
    let { form, data } = $props();
    
</script>

<p>Welcome to the dashboard, {data.displayName}!</p>
{#if form?.isError}
<p>An error has occured. Please try again later.</p>
{/if}

<button onclick={() => open = true}>Quick Match</button>
<br>
<a href="/dashboard/players">Players</a>
<br>
<a href="/dashboard/teams">Teams</a>
<br>
<form method="post" action="?/signOut">
    <input type="submit" value='Sign out'>
</form>


