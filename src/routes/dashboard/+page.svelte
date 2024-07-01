<script>
    let { form } = $props();
</script>

<p>Welcome to the dashboard</p>
<form method="post" action="?/signOut">
    <input type="submit" value='Sign out'>
</form>
{#if form?.isError}
    <p>An error has occured. Please try again later.</p>
{/if}