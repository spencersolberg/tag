<script context="module">
    export async function load({ page }) {
        const id = page.params.id;
        const url = `https://api.tags.town/tag/${id}`;
        // const url = `https://tags-api.deno.dev/tag${id}`;
        const res = await fetch(url);
        const tag = await res.json();
        return { props: { tag } };
    }
</script>

<script>
    import SheetMusic from "../../components/sheetMusic.svelte";
    export let tag;
    import { fade } from "svelte/transition";
</script>

<svelte:head>
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@TagsDotTown" />
    <meta name="twitter:title" content={tag.title} />
    <meta
        name="twitter:description"
        content={'Check out "' + tag.title + '" on Tags.Town'}
    />
    <!-- <meta name="twitter:image" content="https://html.sammy-codes.com/images/large-profile.jpg" /> -->
</svelte:head>
<h1 in:fade class="text-4xl text-center mb-2 uppercase text-primary-black dark:text-primary-white font-medium">
    {tag.title}
</h1>
{#if tag.version}
    <h2 in:fade class="text-2xl text-center mb-2 text-primary-black dark:text-primary-white">{tag.version}</h2>
{/if}
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
        <h2 class="text-center mb-2 text-primary-black dark:text-primary-white">({tag.altTitle})</h2>
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
    class="p-6 bg-primary-red text-primary-white rounded-md shadow-sm hover:shadow-md flex flex-col"
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
    <h3 class="text-lg text-center mt-2 mb-4"><a href={tag.sheetMusic.url} download={`${tag.title} (${tag.id})`}>Download ⬇️</a></h3>
    <!-- <pre>{JSON.stringify(tag.sheetMusic, null, 4)}</pre> -->
        <SheetMusic sheetMusic={tag.sheetMusic} />
    {/if}
</div>

<!-- <p class="text-white p-4">{tag.quartet ?? tag.teacher ?? tag.provider ?? ""}</p> -->
