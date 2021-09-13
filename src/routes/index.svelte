<script>
    import TagCard from "../components/tagCard.svelte";
    import { fetchTags } from "../fetchTags";
    import { fade } from "svelte/transition";
    let searchTerm = "";
    let typing = false;
    let loading = false;
    let tags = [];

    const updateSearchTerm = () => {
        let currentSearchTerm = String(searchTerm);
        // console.log(searchTerm);
        typing = true;
        setTimeout(() => {
            // console.log(`Is ${currentSearchTerm} == ${searchTerm}`);
            if (currentSearchTerm == searchTerm) {
                typing = false;
                if (searchTerm != "") {
                    loading = true;
                    fetchTags(searchTerm)
                        .then((t) => {
                            loading = false;
                            tags = t;
                        })
                        .catch((err) => {
                            console.error(err);
                            loading = false;
                        });
                }
            }
        }, 1500);
    };
</script>

<svelte:head>
    <title>Tags.Town</title>
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@TagsDotTown" />
    <meta name="twitter:title" content="Tags.Town" />
    <meta name="twitter:description" content="Barbershop Tag Platform" />
</svelte:head>
<!-- <div class="flex justify-center">
    <img class="h-9" src="/logo.svg" alt="" />

<h1 class="text-4xl text-center mb-8 uppercase dark:text-white font-medium">
    Tags.Town
</h1>
</div> -->

<div class="flex justify-center">
    <img src="/logoTitleWhite.svg" alt="Tags.TOwn" class="hidden dark:block h-20 mb-4">
    <img src="/logoTitle.svg" alt="Tags.Town" class=" dark:hidden h-20 mb-4">
</div>

<input
    class="w-full rounded-md text-lg text-primary-black p-4 border-2 border-primary-black"
    type="text"
    bind:value={searchTerm}
    on:input={updateSearchTerm}
    placeholder="Search tags"
/>

{#if loading || typing}
    <p class="py-2 text-lg text-primary-black dark:text-primary-white animate-pulse">
        loading...
    </p>
{/if}

{#if !loading && !typing}
    <p in:fade class="py-2 text-lg text-primary-black dark:text-primary-white">
        {tags.length} tag{tags.length == 1 ? "" : "s"}
    </p>

    <div class="py-4 grid gap-y-4 gap-x-5 md:grid-cols-2 grid-cols-1">
        {#each tags as tag}
            <div in:fade>
                <TagCard {tag} />
            </div>
        {/each}
    </div>
{/if}
