<script>
    import { session } from "$app/stores";
    import supabase from "$lib/db";
    import { browser } from "$app/env";
    export const signOut = async () => {
        const { error: err } = await supabase.auth.signOut();
        if (err) alert(err);
    };

    let profile = null;

    if($session && browser) {
        const profileRequest = supabase.from("profiles").select().eq("user_id", supabase.auth.user().id);

        profileRequest.then(({data, error}) => {
            if (error) console.error(error);
            // console.log(data);
            console.log(supabase.auth.user().id);
            profile = data[0];
        })
    }
</script>

<nav class="pt-2 flex justify-center w-full bg-primary-red">
    <a class="mx-4 text-lg text-primary-white" href="/">Home</a>
    <a class="mx-4 text-lg text-primary-white" href="/about">About</a>
    {#if !$session}
        <a class="mx-4 text-lg text-primary-white" href="/auth">Sign In</a>
        <a class="mx-4 text-lg text-primary-white" href="/auth">Sign Up</a>
    {:else}
        {#if profile}
            <a href={`/@${profile.username}`} class="mx-4 text-lg text-primary-white">Profile</a>
        {:else}
            <a href="/createprofile" class="mx-4 text-lg text-primary-white">Profile</a>
        {/if}
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a class="mx-4 text-lg text-primary-white" on:click={signOut} href="#"
            >Sign Out</a
        >
    {/if}
</nav>