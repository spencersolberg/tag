<script>
  export let tag;
</script>

<a
  href="/"
  class="p-6 bg-gray-100 text-gray-800 text-center rounded-md shadow-sm hover:shadow-md flex flex-col items-center"
>
<h4 class="text-xl md:line-clamp-1">{tag.title}</h4>
<p class="md:line-clamp-1">{tag.arranger}</p>
<p class="md:line-clamp-1">{tag.type}{tag.parts ? " - " + tag.parts + " parts": ""}</p>
<p class="md:line-clamp-1">{tag.key} {tag.tonality}</p>
</a>
