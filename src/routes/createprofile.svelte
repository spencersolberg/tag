<script>
    import { session } from "$app/stores";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";
    import supabase from "$lib/db";
    import ErrorCard from "../components/errorCard.svelte";
    import SuccessCard from "../components/successCard.svelte";

    let username;
    let bio;
    let displayName;
    let displayForm = true;
    let error;
    let newAvatar;
    let newAvatarURL;
    let noAvatar = true;
    let success = false;
    let fileValue;

    if (browser && !$session) goto("/auth");

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

    if ($session && browser) {
        const profileRequest = supabase
            .from("profiles")
            .select()
            .eq("user_id", supabase.auth.user().id);

        profileRequest.then(({ data, error }) => {
            if (error) console.error(error);
            if (data[0]) {
                setTimeout(() => goto("/@" + data[0].username), 300);
            }
        });
    }

    const createProfile = async () => {
        error = null;
        if (!username) {
            error = { message: "You need to provide a username." };
            return;
        }
        const { data, error: err } = await supabase
            .from("profiles")
            .select()
            .eq("username", username);

        if (err) console.error(err);
        if (data[0]) {
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
                .insert({
                    user_id: supabase.auth.user().id,
                    username,
                    bio: bio == "" ? null : bio,
                    display_name: displayName == "" ? null : displayName,
                    avatar: noAvatar
                        ? null
                        : avatarUpload?.file ?? profile.avatar,
                });
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
            noAvatar = false;
        };
    };
</script>

<h1
    class="text-4xl mb-8 text-center uppercase text-primary-black dark:text-primary-white font-medium"
>
    Create Profile
</h1>
<div class="container max-w-md flex flex-col justify-center mx-auto">
    <div class={displayForm ? "" : "hidden"}>
        {#if noAvatar}
            <p class="text-xl text-primary-black dark:text-primary-white">
                No avatar
            </p>
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
            bind:value={username}
            on:keyup={() => (username = username.replace(/[^a-z0-9]/, ""))}
            required
            type="text"
            placeholder="Username (required)"
            maxlength="16"
            spellcheck="false"
        />
        <input
            bind:value={displayName}
            type="text"
            class="w-full rounded-md text-lg-border-gray p-4 border-2 border-primary-black mx-auto my-2"
            placeholder="Display name"
            maxlength="64"
        />

        <textarea
            placeholder="Tell us a little about yourself!"
            bind:value={bio}
            cols="30"
            rows="6"
            class="w-full rounded-md text-lg border-gray p-4 border-2 border-primary-black mx-auto my-2"
            maxlength="256"
        />
        <div class="container flex justify-center mx-auto w-full">
            <button
                class="border-2 p-4 my-2 mx-4 rounded-md bg-primary-black text-primary-white border-primary-black hover:bg-primary-white hover:text-primary-black dark:bg-primary-white dark:text-primary-black dark:border-primary-white dark:hover:bg-primary-black dark:hover:text-primary-white"
                on:click={createProfile}>Create Profile</button
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
            <h4 class=" pt-4 font-bold text-lg text-center">Hip hip hooray!</h4>
            <p class="p-4 text-center">Your profile has been created!</p>
        </SuccessCard>
    {/if}
</div>
