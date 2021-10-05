<script>
    import TagCard from "../components/tagCard.svelte";
    import { fetchTags } from "../fetchTags";
    import { fade } from "svelte/transition";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";
    import { onMount } from "svelte";

    let q = "";
    // let q = $page.query.get("q") ?? "";
    // console.log($page.query.get("q"));
    // setTimeout(() => console.log($page.query.get("q")), 5000)
    let typing = false;
    let loading = false;
    let tags = [];
    let first = true;

    const updateSearchTerm = () => {
        let currentSearchTerm = String(q);
        // console.log(q);
        typing = true;
        setTimeout(() => {
            // console.log(`Is ${currentSearchTerm} == ${q}`);
            if (currentSearchTerm == q) {
                typing = false;
                if (q != "") {
                    loading = true;
                    fetchTags(q)
                        .then((t) => {
                            loading = false;
                            if (browser) {
                                goto(
                                    q ? "/?q=" + encodeURIComponent(q) : "/",
                                    true,
                                    true,
                                    true
                                );
                            }

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
    page.subscribe(({ query }) => {
        if (first) {
            q = query.get("q");
            first = false;
            if(q) updateSearchTerm();
        }
    });
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

<div class="flex justify-center" in:fade>
    <img
        src="/logoTitleWhite.svg"
        alt="Tags.Twn"
        class="hidden dark:block h-20 mb-4"
    />
    <img src="/logoTitle.svg" alt="Tags.Town" class=" dark:hidden h-20 mb-4" />
</div>

<input
    class="w-full rounded-md text-lg text-primary-black p-4 border-2 border-primary-black"
    type="text"
    bind:value={q}
    on:input={updateSearchTerm}
    placeholder="Search tags"
    in:fade
/>
<p class="hidden text-lg text-primary-black dark:text-primary-white">
    PQG: {$page.query.get("q")}
    Q: {q}
</p>
{#if loading || typing}
    <p
        class="py-2 text-lg text-primary-black dark:text-primary-white animate-pulse"
    >
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
