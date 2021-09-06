<script>
  export let tag;
  let pulsing = false;
</script>

<a
  href="/tag/{tag.id}"
  class="p-6 bg-gray-900 text-white dark:bg-white dark:text-black text-center rounded-md shadow-sm hover:shadow-md flex flex-col items-center transition-transform transform transform-gpu motion-safe:hover:scale-105"
  on:click={() => pulsing = true}
>
<h4 class="text-xl md:line-clamp-1 font-bold {pulsing ? "animate-pulse" : ""}">{tag.title}</h4>
<p class="md:line-clamp-1 {pulsing ? "animate-pulse" : ""}">{tag.arranger ?? "Unknown Arranger"}</p>
<p class="md:line-clamp-1 {pulsing ? "animate-pulse" : ""}">{tag.type}{tag.parts ? " - " + tag.parts + " parts": ""}</p>
<p class="md:line-clamp-1 {pulsing ? "animate-pulse" : ""}">{tag.key ?? "Unknown Key"} {tag.tonality ?? ""}</p>
{#if tag.rating}
<p class="md:line-clamp-1 {pulsing ? "animate-pulse" : ""}">
{#each [...Array(Math.round(tag.rating)).keys()] as star}
⭐️
{/each}
 ({tag.ratingCount})</p>
{:else}
<p class="md:line-clamp-1 {pulsing ? "animate-pulse" : ""}">Unknown Rating</p>
{/if}
</a>
