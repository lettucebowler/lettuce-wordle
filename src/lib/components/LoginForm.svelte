<script lang="ts">
    import { fetcher } from 'itty-fetcher';
    import { PUBLIC_APP_HOST } from '$env/static/public';
    import { enhance } from '$app/forms';
	import type { SubmitFunction } from '$app/forms';
    let token: string;

    let form;

    const loginEnhancer: SubmitFunction = async (event) => {
        const { csrfToken } = (await fetcher().get('/auth/csrf')) as { csrfToken: string };
        token = csrfToken;

        event.data.set('csrfToken', token);
    }
</script>

<form bind:this={form} action="/auth/signin/github" method="POST" on:submit={(e) => {
    e.preventDefault();
    console.log(e)
    console.log([...new FormData(form).entries()]);
}}>
    <input type="hidden" name="callbackUrl" value={`${PUBLIC_APP_HOST}/auth/callback/github`} />
    <input type="hidden" name="csrfToken" value={token} />
    <button type="submit" class="button">
        <slot>Sign in</slot>
    </button>
</form>