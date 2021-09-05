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
        console.log(searchTerm);
        typing = true;
        setTimeout(() => {
            console.log(`Is ${currentSearchTerm} == ${searchTerm}`);
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
    <title>Tag</title>
</svelte:head>

<h1 class="text-4xl text-center my-8 uppercase dark:text-white">Tag</h1>

<input
    class="w-full rounded-md text-lg p-4 border-2 border-gray-200"
    type="text"
    bind:value={searchTerm}
    on:input={updateSearchTerm}
    placeholder="Search tags"
/>

{#if loading || typing}
    <p class="py-2 text-lg text-gray-400 dark:text-white animate-pulse">loading...</p>
{/if}

{#if !loading && !typing}

        <p in:fade class="py-2 text-lg text-gray-400 dark:text-white">{tags.length} tag{tags.length == 1 ? "" : "s"}</p>

    <div class="py-4 grid gap-4 md:grid-cols-2 grid-cols-1">
        {#each tags as tag}
            <div in:fade>
                <TagCard {tag} />
            </div>
        {/each}
    </div>
{/if}
