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
            return { props: { profile: null } };
        }
    }
</script>

<script>
    import { session } from "$app/stores";
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import ErrorCard from "../components/errorCard.svelte";
    import SuccessCard from "../components/successCard.svelte";
    import SortableList from "svelte-sortable-list";

    if (browser && !session) goto("/auth");

    export let profile;
    let displayForm = true;
    let error;
    let success;
    let newAvatar;
    let newAvatarURL;
    let noAvatar = false;
    let showOldAvatar = true;
    let fileValue;
    let favorites = null;
    let source;

    const retrieveFavorites = async () => {
        if (!profile?.favorites) {
            return null;
        }
        const url = "https://api.tags.town/tags/";
        const res = await fetch(url + profile.favorites.join(","));
        const data = await res.json();
        console.log(data);
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
        const cached = data.map((t) => t.json);
        if (cached.length < profile.favorites.length) {
            return await retrieveFavorites();
        }
        return data.map((t) => t.json).sort((a, b) => profile.favorites.indexOf(a.id) - profile.favorites.indexOf(b.id));
    };

    const uploadAvatar = async () => {
        if (!noAvatar && newAvatar) {
            const url = "https://api.tags.town/avatar";
            const res = await fetch(url, {
                method: "POST",
                body: newAvatar,
            });
            const data = await res.json();
            return data;
        }
        return null;
    };

    const editProfile = async () => {
        error = null;
        if (!profile.username) {
            error = { message: "You need to provide a username." };
            return;
        }
        if (!profile.part) {
            error = { message: "You need to choose a voice part." };
            return;
        }
        const { data, error: err } = await supabase
            .from("profiles")
            .select()
            .eq("username", profile.username);

        if (err) console.error(err);
        if (data[0] && data[0].user_id != supabase.auth.user().id) {
            error = { message: "This username is already taken" };
            return;
        } else {
            const avatarUpload = await uploadAvatar();

            if (avatarUpload?.error) {
                error = avatarUpload.error;
                return;
            }

            const { data: data2, error: err2 } = await supabase
                .from("profiles")
                .update({
                    username: profile.username,
                    display_name:
                        profile.display_name == ""
                            ? null
                            : profile.display_name,
                    bio: profile.bio == "" ? null : profile.bio,
                    avatar: noAvatar
                        ? null
                        : avatarUpload?.file ?? profile.avatar,
                    part: profile.part,
                    favorites: favorites?.map(f => f.id) ?? []
                })
                .eq("user_id", supabase.auth.user().id);
            if (err2) {
                error = err2;
                return;
            }
            displayForm = false;
            success = true;
            setTimeout(() => window.location.assign("/"), 1500);
        }
    };
    const onFileSelected = (e) => {
        let image = e.target.files[0];
        newAvatar = image;
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            newAvatarURL = e.target.result;
            showOldAvatar = false;
            noAvatar = false;
        };
    };

    const sortList = (ev) => {
        favorites = ev.detail;
        console.log(favorites);
    };

    const removeFavorite = (id) => {
        favorites = favorites.filter(f => f.id != id);
    }

    getFavorites().then((favs) => (favorites = favs));
</script>

<h1
    class="text-4xl mb-8 text-center uppercase text-primary-black dark:text-primary-white font-medium"
>
    Edit Profile
</h1>
{#if browser}
    <div class="container max-w-md flex flex-col justify-center mx-auto">
        <div class={displayForm ? "" : "hidden"}>
            {#if (!profile.avatar && !newAvatarURL) || noAvatar}
                <p class="text-xl text-primary-black dark:text-primary-white">
                    No avatar
                </p>
            {:else if profile.avatar && showOldAvatar}
                <img
                    class="rounded-md h-40 w-40 object-cover mx-auto my-2 border-2 border-primary-black"
                    src={"https://file.coffee/u/" + profile.avatar}
                    alt={profile.display_name + " 's avatar"}
                />
            {:else}
                <img
                    src={newAvatarURL}
                    alt=""
                    class="rounded-md h-40 w-40 object-cover mx-auto my-2 border-2 border-primary-black"
                />
            {/if}
            <div class="mx-auto text-primary-black dark:text-primary-white">
                <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    on:change={(e) => onFileSelected(e)}
                    bind:value={fileValue}
                />
            </div>
            <div class="container flex justify-center mx-auto w-full">
                <button
                    class="border-2 p-2 my-2 mx-4 rounded-md bg-primary-red text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-red dark:text-primary-white dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white"
                    on:click={() => {
                        noAvatar = true;
                        fileValue = null;
                    }}>Delete Avatar</button
                >
            </div>
            <input
                class="w-full rounded-md text-lg border-gray p-4 border-2 border-primary-black mx-auto my-2"
                bind:value={profile.username}
                on:keyup={() =>
                    (profile.username = profile.username.replace(
                        /[^a-z0-9]/,
                        ""
                    ))}
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
            <p class="text-xl text-primary-black dark:text-primary-white">
                Choose your voice part
            </p>
            <select class="mx-auto" name="Voice Part" bind:value={profile.part}>
                <option value="Bass">Bass</option>
                <option value="Baritone">Baritone</option>
                <option value="Lead">Lead</option>
                <option value="Tenor">Tenor</option>
                <option value="Other">Other</option>
            </select>
            {#if favorites}
                <h2
                    class="text-xl mt-4 mb-2 text-primary-black dark:text-primary-white"
                >
                    Favorite Tags
                </h2>
                <SortableList
                    list={favorites}
                    key="id"
                    on:sort={sortList}
                    let:item
                >
                    <div
                        class="flex justify-between dark:bg-primary-white bg-primary-black w-full my-1 px-2 py-2 rounded-md"
                    >
                        <p
                            class=" dark:text-primary-black text-primary-white  select-none"
                        >
                            {item.title} - {item.id}
                        </p>
                        <button
                            class="transition-transform transform transform-gpu motion-safe:hover:scale-110 motion-safe:active:scale-95" on:click={() => removeFavorite(item.id)}
                        >
                            <svg
                                class="w-6 h-6 text-primary-red"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                /></svg
                            >
                        </button>
                    </div>
                </SortableList>
            {/if}
            <div class="container flex justify-center mx-auto w-full">
                <button
                    class="border-2 p-4 my-2 mx-4 rounded-md bg-primary-black text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-white dark:text-primary-black dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white"
                    on:click={editProfile}>Confirm Changes</button
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
                <p class="p-4 text-center">Your profile has been edited!</p>
            </SuccessCard>
        {/if}
    </div>
{/if}
