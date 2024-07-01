<script>
    let { form } = $props();
  </script>

 <form method="POST" action="?/login">
    <p>Log in</p>
    <label for="email">Email </label><input type="email" name="email" required value="{form?.email ?? ''}">
    <br>
    <label for="password">Password </label><input type="password" name="password" required>
    <br>
    <input type="submit">
</form>
{#if form?.success}
   <p>Logged in</p>
{/if}
{#if form?.incorrect}
    <p>Incorrect username or password</p>
{/if}
{#if form?.unconfirmed}
    <p>Please verify your email before you log in.</p>
{/if}
{#if form?.genericError}
    <p>An error has occured:</p>
    <p>{form?.returnedError}</p>
{/if}