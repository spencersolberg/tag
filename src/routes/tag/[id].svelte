<script context="module">
    export async function load({ page }) {
        const id = page.params.id;
        const url = `https://api.tags.town/tag/${id}`;
        const res = await fetch(url);
        const tag = await res.json();
        return { props: { tag } };
    }
</script>
<script>
    export let tag;
</script>
<h1 class="text-4xl text-center mb-8 uppercase dark:text-white font-medium">
    {tag.title}
</h1>