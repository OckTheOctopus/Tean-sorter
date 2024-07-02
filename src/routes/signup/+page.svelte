<script>
    let { form } = $props();
</script>

<form method="POST" action='?/signup'>
    <p>Sign up</p>
    <label for='fname'>First name:</label><input type="text" required name="fname">
    <br>
    <label for="lname">Last name: </label><input type="text" name="lname" required>
    <br>
    <label for="email">Email </label><input type="email" name="email" required value="{form?.email ?? ''}">
    <br>
    <label for="password">Password </label><input type="password" name="password" required>
    <br>
    <input type="submit">
</form>
{#if form?.genericError}
    <p>An error has occured: {form?.errorMsg}</p>
{/if}
