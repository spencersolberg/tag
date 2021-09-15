<script context="module">
    import supabase from "$lib/db";
    export async function load({ page }) {
        const { data, error } = await supabase
            .from("profiles")
            .select()
            .eq("username", page.params.username);
        return { props: { profile: data[0] } };
    }
</script>

<script>
    import { page, session } from "$app/stores";
    import { goto } from "$app/navigation";
    // import supabase from "$lib/db";
    import { browser } from "$app/env";
    // import supabase from "$lib/db";
    import Auth from "./auth.svelte";

    export let profile;
    let pfp = true;

    if (!$session) goto("/auth");

    // if (browser) {
    //     supabase
    //         .from("profiles")
    //         .select()
    //         .eq("username", $page.params.username)
    //         .then(({ data, error }) => {
    //             console.log(data);
    //             if (error || !data[0]) goto("/");
    //             displayName = data[0].display_name;
    //             bio = data[0].bio;
    //         });
    // }
</script>

<div class="flex flex-col ">
    <div class="flex max-w-lg">
        {#if pfp}
            <img
                src="https://thispersondoesnotexist.com/image"
                alt
                class="rounded-md h-40 mr-6"
            />
        {/if}
        {#if profile?.display_name}
            <div>
                <h1
                    class="text-4xl  mt-2 uppercase dark:text-primary-white text-primary-black font-medium"
                >
                    {profile.display_name}
                </h1>
                <h1
                    class="text-2xl  mb-4 dark:text-primary-white text-primary-black font-medium"
                >
                    @{profile.username}
                </h1>
            </div>
        {:else if profile.display_name === null}
            <h1
                class="text-4xl  my-4 uppercase dark:text-primary-white text-primary-black font-medium"
            >
                @{profile.username}
            </h1>
        {/if}
    </div>
    {#if profile?.bio}
        <div
            class="p-6 my-4 bg-primary-red text-primary-white rounded-md shadow-sm hover:shadow-md flex text-xl flex-col"
        >
            <h2 class="text-xl text-center mb-4 uppercase font-medium">
                About Me
            </h2>
            <p class="md:px-6">{profile.bio}</p>
        </div>
    {/if}

    {#if profile?.user_id == supabase.auth.user().id}
        <a href="/editprofile">
            <div
                class="border-2 p-4 my-2 rounded-md bg-primary-black text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-white dark:text-primary-black dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white text-center"
                >Edit profile ✏️</div
            ></a
        >
    {/if}
</div>
