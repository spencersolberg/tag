<script>
    import { fade } from "svelte/transition";
    import { session } from "$app/stores";

    let email;
    let password;
    let confirmationMessage = false;
    let error;
    import supabase from "$lib/db";
import { goto } from "$app/navigation";
    const signUp = async () => {
        const {
            user,
            session: sesh,
            error: err,
        } = await supabase.auth.signUp({
            email,
            password
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
            password
        });
        error = err;
        if(user && !sesh) {
            confirmationMessage = true;
        } else if (user && sesh) {
            goto("/");
        }
    }
    
</script>

<h1 class="text-4xl text-center my-8 uppercase dark:text-white">Auth</h1>

<div class="container max-w-md flex flex-col justify-center mx-auto">
    <input
        class="w-full rounded-md text-lg border-gray p-4 border-2 border-gray-200 mx-auto my-2"
        bind:value={email}
        type="email"
        placeholder="Email Address"
    />
    <input
        class="w-full rounded-md text-lg border-gray p-4 border-2 border-gray-200 mx-auto my-2"
        bind:value={password}
        type="password"
        placeholder="Password"
    />
    <div class="container flex justify-center mx-auto w-full">
        <button
            class="border-2 p-4 my-2 mx-4 rounded-md bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-900 dark:hover:text-white"
            on:click={signIn}
            >Sign In</button
        >
        <button
            class="border-2 p-4 my-2 mx-4 rounded-md bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-900 dark:hover:text-white"
            on:click={signUp}>Sign Up</button
        >
    </div>
    {#if confirmationMessage}
        <div
            in:fade
            class="mt-4 container rounded-md border-2 bg-green-200 border-green-500 text-black"
        >
            <h4 class=" pt-4 font-bold text-lg text-center">
                Check your Email!
            </h4>
            <p class="p-4 text-center">
                A link has been sent to {email?.toLowerCase()}
            </p>
        </div>
    {/if}
    {#if error}
        <div
            in:fade
            class="mt-4 container rounded-md border-2 bg-red-200 border-red-500 text-black"
        >
            <h4 class=" pt-4 font-bold text-lg text-center">
                Uh oh!
            </h4>
            <p class="pt-4 text-center">
                {error.message}
            </p>
            {#if error.message == "Invalid email or password"}
            <p class="p-4 text-center hover:underline font-bold hover:cursor-pointer" on:click={() => {
                password = null;
                signIn();
                confirmationMessage = true;
            }}>Forgot password? Use a magic link!</p>
            {/if}
        </div>
    {/if}
</div>
