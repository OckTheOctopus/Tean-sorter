<script>
    let { form } = $props();
</script>

<form method="POST" action='?/signup'>
    <p>Sign up</p>
    <label for="email">Email </label><input type="email" name="email" required value="{form?.email ?? ''}">
    <br>
    <label for="password">Password </label><input type="password" name="password" required>
    <br>
    <input type="submit">
</form>
{#if form?.genericError}
    <p>An error has occured: {form?.errorMsg}</p>
{/if}
