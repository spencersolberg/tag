<script>
    // import { fade } from "svelte/transition";
    import { session } from "$app/stores";

    let email;
    let password;
    let confirmationMessage = false;
    let error;
    import supabase from "$lib/db";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";
    import ErrorCard from "../components/errorCard.svelte";
    import SuccessCard from "../components/successCard.svelte";
    if ($session && browser) goto("/");

    const signUp = async () => {
        const {
            user,
            session: sesh,
            error: err,
        } = await supabase.auth.signUp({
            email,
            password,
        });
        error = err;
        if (user && !sesh) {
            confirmationMessage = true;
        }
    };

    const signIn = async () => {
        const {
            user,
            session: sesh,
            error: err,
        } = await supabase.auth.signIn({
            email,
            password,
        });
        error = err;
        if (user && !sesh) {
            confirmationMessage = true;
        } else if (user && sesh) {
            setTimeout(() => goto("/"), 300)
            // goto("/");
        }
    };
</script>

<svelte:head>
    <title>Tags.Town - Auth</title>
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@TagsDotTown" />
    <meta name="twitter:title" content="Tags.Town" />
    <meta name="twitter:description" content="Barbershop Tag Platform" />
</svelte:head>
<h1
    class="text-4xl mb-8 text-center uppercase text-primary-black dark:text-primary-white font-medium"
>
    Auth
</h1>

<div class="container max-w-md flex flex-col justify-center mx-auto">
    <input
        class="w-full rounded-md text-lg border-gray p-4 border-2 border-primary-black mx-auto my-2"
        bind:value={email}
        type="email"
        placeholder="Email Address"
    />
    <input
        class="w-full rounded-md text-lg border-gray p-4 border-2 border-primary-black mx-auto my-2"
        bind:value={password}
        type="password"
        placeholder="Password"
    />
    <div class="container flex justify-center mx-auto w-full">
        <button
            class="border-2 p-4 my-2 mx-4 rounded-md bg-primary-black text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-white dark:text-primary-black dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white"
            on:click={signIn}>Sign In</button
        >
        <button
            class="border-2 p-4 my-2 mx-4 rounded-md bg-primary-black text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-white dark:text-primary-black dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white"
            on:click={signUp}>Sign Up</button
        >
    </div>
    {#if confirmationMessage}
        <SuccessCard>
            <h4 class=" pt-4 font-bold text-lg text-center">
                Check your Email!
            </h4>
            <p class="p-4 text-center">
                A link has been sent to {email?.toLowerCase()}
            </p>
        </SuccessCard>
    {/if}
    {#if error}
        <ErrorCard>
            <p class="pt-4 text-center">
                {error.message}
            </p>
            {#if error.message == "Invalid email or password"}
                <p
                    class="p-4 text-center hover:underline font-bold hover:cursor-pointer"
                    on:click={() => {
                        password = null;
                        signIn();
                        confirmationMessage = true;
                    }}
                >
                    Forgot password? Use a magic link!
                </p>
            {/if}
        </ErrorCard>
    {/if}
</div>
