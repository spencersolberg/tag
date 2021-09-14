<script>
    import { page, session } from "$app/stores";
    import { goto } from "$app/navigation";
    import supabase from "$lib/db";
    import { browser } from "$app/env";

    let pfp = true;
    let displayName;
    let bio;

    if (!$session) goto("/auth");

    if (browser) {
        supabase
            .from("profiles")
            .select()
            .eq("username", $page.params.username)
            .then(({ data, error }) => {
                console.log(data);
                if (error || !data[0]) goto("/");
                displayName = data[0].display_name;
                bio = data[0].bio;
            });
    }
</script>
<div class="flex flex-col ">
<div class="flex max-w-lg">
    {#if pfp}
        <img src="https://thispersondoesnotexist.com/image" alt class="rounded-md h-40 mr-6">
    {/if}
    {#if displayName}
        <div>
            <h1 class="text-4xl  mt-2 uppercase dark:text-primary-white text-primary-black font-medium">
                {displayName}
            </h1>
            <h1 class="text-2xl  mb-4 dark:text-primary-white text-primary-black font-medium">
                @{$page.params.username}
            </h1>
        </div>
    {:else if displayName === null}
        <h1 class="text-4xl  my-4 uppercase dark:text-primary-white text-primary-black font-medium">
            @{$page.params.username}
        </h1>
    {/if}
</div>
{#if bio}
    <div class="p-6 my-4 bg-primary-red text-primary-white rounded-md shadow-sm hover:shadow-md flex text-xl flex-col">
        <h2 class="text-xl text-center mb-4 uppercase font-medium">About Me</h2>
        <p class="md:px-6">{bio}</p>
    </div>
{/if}
</div>