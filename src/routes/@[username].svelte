<script context="module">
    import supabase from "$lib/db";
    export async function load({ page }) {
        const { data, error } = await supabase
            .from("profiles")
            .select()
            .eq("username", page.params.username);
        const { data: data2, error: error2 } = await supabase
            .from("premiums")
            .select()
            .eq("user_id", data[0].user_id);
        return { props: { profile: data[0], premium: data2[0] } };
    }
</script>

<script>
    import { fade } from "svelte/transition";
    import { page, session } from "$app/stores";
    import { goto } from "$app/navigation";
    // import supabase from "$lib/db";
    import { browser } from "$app/env";
    // import supabase from "$lib/db";
    import Auth from "./auth.svelte";
    import TagCard from "../components/tagCard.svelte";
    import PlaceholderTagCard from "../components/placeholderTagCard.svelte";

    export let profile;
    export let premium;
    let pfp = true;
    let favorites;
    const retrieveFavorites = async () => {
        if (!profile.favorites) {
            return null;
        }
        const url = "https://api.tags.town/tags/";
        const res = await fetch(url + profile.favorites.join(","));
        const data = await res.json();
        return data;
    };

    const getFavorites = async () => {
        if (!profile.favorites) {
            return null;
        }
        const { data, error } = await supabase
            .from("tags_cache")
            .select()
            .in("id", profile.favorites);
        if (error) console.error(error);
        const cached = data.map(t => t.json);
        if (cached.length < profile.favorites.length) {
            return await retrieveFavorites();
        }
        return data.map(t => t.json).sort((a, b) => profile.favorites.indexOf(a.id) - profile.favorites.indexOf(b.id));
    };

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

    favorites = null;
    getFavorites().then((favs) => {
        favorites = favs;
        console.log(profile.favorites, favorites.map(f => f.id));
    });
</script>
<svelte:head>
    <title>Tags.Town - @{profile.username}</title>
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@TagsDotTown" />
    <meta name="twitter:title" content="Tags.Town - {profile.display_name}" />
    <meta name="twitter:description" content="@{profile.username} is on Tags.Town" />
</svelte:head>
<div class="flex flex-col ">
    <div class="flex max-w-lg">
        {#if profile?.avatar}
            <img
                src={"https://file.coffee/u/" + profile.avatar}
                alt
                class="rounded-md h-40 w-40 object-cover mr-6 border-2 border-primary-black"
                in:fade
            />
        {/if}
        {#if profile?.display_name}
            <div>
                <h1
                    class="text-4xl  mt-2 uppercase dark:text-primary-white text-primary-black font-medium"
                    in:fade
                >
                    {profile?.display_name}
                </h1>
                <h1
                    class="text-2xl  mb-4 dark:text-primary-white text-primary-black font-medium"
                    in:fade
                >
                    @{profile?.username}
                </h1>
            </div>
        {:else if profile?.display_name === null}
            <h1
                class="text-4xl  my-4 uppercase dark:text-primary-white text-primary-black font-medium"
                in:fade
            >
                @{profile?.username}
            </h1>
        {/if}
    </div>
    {#if profile?.bio || premium?.twitter}
        <div
            class="p-6 my-4 bg-primary-red text-primary-white border-2 border-primary-black dark:border-primary-red rounded-md shadow-sm hover:shadow-md flex text-xl flex-col"
            in:fade
        >
            {#if profile.bio}
                <h2 class="text-xl text-center mb-4 uppercase font-medium">
                    About Me
                </h2>
                <p class="md:px-6">
                    Voice part: <strong>{profile.part}</strong>
                </p>
                <br />
                <p class="md:px-6">{profile?.bio}</p>
            {/if}
            {#if profile.favorites}
                <div in:fade>
                    {#if profile.bio}
                        <hr class="mt-4" />
                    {/if}
                    <h2
                        class="text-xl text-center mb-4 {profile.bio
                            ? 'mt-4 '
                            : ''}uppercase font-medium"
                    >
                        Favorite Tags
                    </h2>
                    <div
                        class="py-4 grid gap-y-4 gap-x-5 md:grid-cols-2 grid-cols-1"
                    >
                        {#if favorites}
                            {#each favorites as tag}
                                <div in:fade>
                                    <TagCard {tag} bg="bg-primary-black" />
                                </div>
                            {/each}
                        {:else}
                            {#each Array.from(Array(profile.favorites.length).keys()) as placeholder}
                                <div in:fade>
                                    <PlaceholderTagCard bg="bg-primary-black" />
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            {/if}
            {#if premium?.twitter}
                {#if profile.bio || profile.favorites}
                    <hr class="mt-4" />
                {/if}
                <h2
                    class="text-xl text-center mb-4 {profile.bio ||
                    profile.favorites
                        ? 'mt-4 '
                        : ''}uppercase font-medium"
                >
                    Links
                </h2>
                {#if premium.twitter}
                    <div
                        class="cursor-pointer rounded-md p-2 mx-auto border-2 border-primary-black bg-blue-400 text-primary-white hover:bg-primary-white hover:text-primary-black  "
                    >
                        <a
                            class="text-center"
                            href={"https://twitter.com/" + premium.twitter}
                            ><strong>Twitter</strong> (@{premium.twitter})</a
                        >
                    </div>
                {/if}
            {/if}
        </div>
    {/if}

    {#if profile?.user_id == supabase.auth.user()?.id}
        <a href="/editprofile" in:fade>
            <div
                class="border-2 p-4 rounded-md bg-primary-black text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-white dark:text-primary-black dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white text-center"
            >
                Edit profile ✏️
            </div></a
        >
    {/if}
</div>
