<script context="module">
    import supabase from "$lib/db";

    export async function load() {
        if (supabase.auth?.user()) {
            const { data, error } = await supabase
                .from("profiles")
                .select()
                .eq("user_id", supabase.auth.user().id);
            return { props: { profile: data[0] } };
        } else {
            if (browser) goto("/auth");
            return;
        }
    }
</script>

<script>
    import { session } from "$app/stores";
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import ErrorCard from "../components/errorCard.svelte";
    import SuccessCard from "../components/successCard.svelte";

    if (browser && !session) goto("/auth");

    export let profile;
    let displayForm = true;
    let error;
    let success;
    const editProfile = async () => {
        error = null;
        if (!profile.username) {
            error = { message: "You need to provide a username." };
            return;
        }
        const { data, error: err } = await supabase
            .from("profiles")
            .select()
            .eq("username", profile.username);

        if (err) console.error(err);
        if (data[0] && (data[0].user_id != supabase.auth.user().id)) {
            error = { message: "This username is already taken" };
            return;
        } else {
            const { data: data2, error: err2 } = await supabase.from("profiles").update({
                username: profile.username,
                display_name: profile.display_name,
                bio: profile.bio
            }).eq("user_id", supabase.auth.user().id);
            if (err2) {
                error = err2;
                return;
            }
            displayForm = false;
            success = true;
            setTimeout(() => window.location.assign("/"), 1500);
        }
    }
</script>

<h1
    class="text-4xl mb-8 text-center uppercase text-primary-black dark:text-primary-white font-medium"
>
    Edit Profile
</h1>
<div class="container max-w-md flex flex-col justify-center mx-auto">
    <div class={displayForm ? "" : "hidden"}>
        <input
            class="w-full rounded-md text-lg border-gray p-4 border-2 border-primary-black mx-auto my-2"
            bind:value={profile.username}
            on:keyup={() => (profile.username = profile.username.replace(/[^a-z0-9]/, ""))}
            required
            type="text"
            placeholder="Username (required)"
            maxlength="16"
            spellcheck="false"
        />
        <input
            bind:value={profile.display_name}
            type="text"
            class="w-full rounded-md text-lg-border-gray p-4 border-2 border-primary-black mx-auto my-2"
            placeholder="Display name"
            maxlength="64"
        />

        <textarea
            placeholder="Tell us a little about yourself!"
            bind:value={profile.bio}
            cols="30"
            rows="6"
            class="w-full rounded-md text-lg border-gray p-4 border-2 border-primary-black mx-auto my-2"
            maxlength="256"
        />
        <div class="container flex justify-center mx-auto w-full">
            <button
                class="border-2 p-4 my-2 mx-4 rounded-md bg-primary-black text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-white dark:text-primary-black dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white"
                on:click={editProfile}>Edit Profile</button
            >
        </div>
    </div>

    {#if error}
        <ErrorCard>
            <p class="pt-4 text-center">
                {error.message}
            </p>
        </ErrorCard>
    {/if}
    {#if success}
        <SuccessCard>
            <h4 class=" pt-4 font-bold text-lg text-center">
                Hip hip hooray!
            </h4>
            <p class="p-4 text-center">
                Your profile has been edited!
            </p>
        </SuccessCard>
    {/if}
</div>