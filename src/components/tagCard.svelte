<script>
  export let tag;
</script>

<a
  href="/tag/{tag.id}"
  class="p-6 bg-black text-white dark:bg-white dark:text-black text-center rounded-md shadow-sm hover:shadow-md flex flex-col items-center"
>
<h4 class="text-xl md:line-clamp-1 font-bold">{tag.title}</h4>
<p class="md:line-clamp-1">{tag.arranger ?? "Unknown Arranger"}</p>
<p class="md:line-clamp-1">{tag.type}{tag.parts ? " - " + tag.parts + " parts": ""}</p>
<p class="md:line-clamp-1">{tag.key ?? "Unknown Key"} {tag.tonality ?? ""}</p>
{#if tag.rating}
<p class="md:line-clamp-1">
{#each [...Array(Math.round(tag.rating)).keys()] as star}
⭐️
{/each}
 ({tag.ratingCount})</p>
{:else}
<p class="md:line-clamp-1">Unknown Rating</p>
{/if}
</a>
