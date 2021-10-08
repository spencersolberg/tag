<script context="module">
    import supabase from "$lib/db";
    export async function load({ page }) {
        const id = page.params.id;
        const url = `https://api.tags.town/tag/${id}`;
        // const url = `https://tags-api.deno.dev/tag${id}`;
        const res = await fetch(url);
        const tag = await res.json();

        if (supabase.auth?.user()) {
            const { data, error } = await supabase
                .from("profiles")
                .select()
                .eq("user_id", supabase.auth.user().id);
            return { props: { tag, profile: data[0] } };
        } else {
            // if (browser) goto("/auth");
            return { props: { tag, profile: null } };
        }
    }
</script>

<script>
    import SheetMusic from "../../components/sheetMusic.svelte";
    export let tag;
    export let profile;
    import { fade } from "svelte/transition";
    let favorited = profile?.favorites?.includes(tag.id);

    const addToFavorites = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .update({
                favorites: [...profile.favorites, tag.id],
            })
            .eq("user_id", supabase.auth.user().id);

        if (error) {
            console.error(error);
            return;
        }
        party.confetti(document.querySelector("#favorite-button"));
        favorited = true;
        return;
    };

    const removeFromFavorites = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .update({
                favorites: profile.favorites.filter(
                    (favorite) => favorite != tag.id
                ),
            })
            .eq("user_id", supabase.auth.user().id);

        if (error) {
            console.error(error);
            return;
        }
        favorited = false;
        return;
    };
</script>

<svelte:head>
    <title>Tags.Town - {tag.title}</title>
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@TagsDotTown" />
    <meta name="twitter:title" content={tag.title} />
    <meta
        name="twitter:description"
        content={'Check out "' + tag.title + '" on Tags.Town'}
    />
    <script
        src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>
    <!-- <meta name="twitter:image" content="https://html.sammy-codes.com/images/large-profile.jpg" /> -->
</svelte:head>
<div class="flex flex-col lg:flex-row lg:justify-between mb-2">
    <div>
        <h1
            in:fade
            class="text-4xl uppercase text-center lg:text-left text-primary-black dark:text-primary-white font-medium"
        >
            {tag.title}
        </h1>
        {#if tag.version}
            <h2
                in:fade
                class="text-xl text-center lg:text-left mb-2 text-primary-black dark:text-primary-white"
            >
                {tag.version}
            </h2>
        {/if}
    </div>
    <div class="flex justify-center lg:justify-around flex-row">
        <button
            id="favorite-button"
            on:click={favorited ? removeFromFavorites : addToFavorites}
            class="transition-transform transform transform-gpu motion-safe:hover:scale-110"
        >
            {#if !favorited}
                <svg
                    class="w-12 h-12 text-primary-black dark:text-primary-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    /></svg
                >
            {:else if favorited}
                <svg
                    class="w-12 h-12 text-primary-red hidden dark:block"
                    fill="currentColor"
                    stroke="white"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    onmousedown="party.confetti(this)"
                    ><path
                        fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd"
                    /></svg
                >
                <svg
                    class="w-12 h-12 text-primary-red dark:hidden"
                    fill="currentColor"
                    stroke="black"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    onmousedown="party.confetti(this)"
                    ><path
                        fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd"
                    /></svg
                >
            {/if}
        </button>
        <!-- <button on:click={favorited ? removeFromFavorites : addToFavorites}
            >{favorited ? "-" : "+"}
        </button> -->
    </div>
</div>

<div in:fade class="flex flex-wrap flex-row-reverse justify-between">
    {#if tag.rating}
        <h2 class="text-center mb-2 text-primary-black dark:text-primary-white">
            {#each [...Array(Math.round(tag.rating)).keys()] as star}
                ⭐️
            {/each}
            ({tag.ratingCount})
        </h2>
    {/if}
    {#if tag.altTitle}
        <h2 class="text-center mb-2 text-primary-black dark:text-primary-white">
            ({tag.altTitle})
        </h2>
    {/if}
</div>
<div in:fade class="flex flex-wrap flex-row-reverse justify-between">
    {#if tag.key || tag.tonality}
        <h2 class="text-center mb-2 text-primary-black dark:text-primary-white">
            {tag.key ? tag.key : ""}
            {tag.tonality ? tag.tonality : ""}
        </h2>
    {/if}
    {#if tag.parts || tag.type}
        <h2 class="text-center mb-2 text-primary-black dark:text-primary-white">
            {tag.type ? tag.type + (tag.parts ? " - " : "") : ""}{tag.parts
                ? tag.parts + " parts "
                : ""}
        </h2>
    {/if}
</div>

<div
    in:fade
    class="p-6 bg-primary-red text-primary-white border-2 border-primary-black dark:border-primary-red rounded-md shadow-sm hover:shadow-md flex flex-col"
>
    {#if tag.arranger || tag.sungBy || tag.lyrics}
        <h2 class="text-xl text-center mb-4 uppercase font-medium">Tag Info</h2>
    {/if}
    {#if tag.arranger}
        <p class="md:px-6">
            Arranger: <strong>{tag.arranger} </strong>{tag.arranged
                ? "(" + tag.arranged + ") "
                : ""}{#if tag.arrangerWebsite}<a href={tag.arrangerWebsite}
                    >🔗</a
                >{/if}
        </p>
    {/if}
    {#if tag.sungBy}
        <p class="md:px-6">
            Made famous by: <strong>{tag.sungBy} </strong>{tag.sungYear
                ? "(" + tag.sungYear + ") "
                : ""}{#if tag.sungWebsite}<a href={tag.sungWebsite}>🔗</a>{/if}
        </p>
    {/if}
    {#if tag.lyrics}
        <p class="md:px-6">Lyrics:</p>
        <div class="px-4">
            <p class="whitespace-pre-wrap text-center">
                <strong>{tag.lyrics}</strong>
            </p>
        </div>
    {/if}
    {#if tag.arranger || tag.sungBy || tag.lyrics}
        <hr class="mt-4" />
    {/if}
    {#if tag.allParts || tag.bass || tag.lead || tag.bari || tag.tenor || tag.other1 || tag.other2 || tag.other3 || tag.other4}
        <h2 class="text-xl text-center my-4 uppercase font-medium">
            Voice Tracks
        </h2>
    {/if}
    {#if tag.quartet}
        <p class="md:px-6">
            Performed by: <strong
                >{tag.quartet}
                {#if tag.quartetWebsite}<a href={tag.quartetWebsite}>🔗</a
                    >{/if}</strong
            >
        </p>
    {/if}
    {#if tag.allParts}
        <p class="md:px-6 text-center my-2">Full:</p>
        <audio class="mx-auto" controls preload="none">
            <source src={tag.allParts.url} />
        </audio>
    {/if}
    <div class="grid md:grid-cols-2 xl:grid-cols-4">
        <div>
            {#if tag.bass}
                <p class="md:px-6 mt-4 text-center mb-2">Bass:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.bass.url} />
                </audio>
            {/if}
        </div>
        <div>
            {#if tag.lead}
                <p class="md:px-6 mt-4 text-center mb-2">Lead:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.lead.url} />
                </audio>
            {/if}
        </div>
        <div>
            {#if tag.bari}
                <p class="md:px-6 mt-4 text-center mb-2">Bari:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.bari.url} />
                </audio>
            {/if}
        </div>
        <div>
            {#if tag.tenor}
                <p class="md:px-6 mt-4 text-center mb-2">Tenor:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.tenor.url} />
                </audio>
            {/if}
        </div>
    </div>
    <div class="grid md:grid-cols-2 xl:grid-cols-4">
        <div>
            {#if tag.other1}
                <p class="md:px-6 mt-4 text-center mb-2">Other 1:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.bass.url} />
                </audio>
            {/if}
        </div>
        <div>
            {#if tag.other2}
                <p class="md:px-6 mt-4 text-center mb-2">Other 2:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.lead.url} />
                </audio>
            {/if}
        </div>
        <div>
            {#if tag.other3}
                <p class="md:px-6 mt-4 text-center mb-2">Other 3:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.bari.url} />
                </audio>
            {/if}
        </div>
        <div>
            {#if tag.other4}
                <p class="md:px-6 mt-4 text-center mb-2">Other 4:</p>
                <audio class="mx-auto" controls preload="none">
                    <source src={tag.tenor.url} />
                </audio>
            {/if}
        </div>
    </div>
    {#if tag.allParts || tag.bass || tag.lead || tag.tenor || tag.bari || tag.other1 || tag.other2 || tag.other3 || tag.other4}
        <hr class="mt-4" />
    {/if}
    {#if tag.sheetMusic}
        <h2 class="text-xl text-center mt-4 uppercase font-medium">
            Sheet Music
        </h2>
        <h3 class="text-lg text-center mt-2 mb-4">
            <a href={tag.sheetMusic.url} download={`${tag.title} (${tag.id})`}
                >Download ⬇️</a
            >
        </h3>
        <!-- <pre>{JSON.stringify(tag.sheetMusic, null, 4)}</pre> -->
        <SheetMusic sheetMusic={tag.sheetMusic} />
    {/if}
</div>

<!-- <p class="text-white p-4">{tag.quartet ?? tag.teacher ?? tag.provider ?? ""}</p> -->
