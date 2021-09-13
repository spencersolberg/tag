<script>
    import { fade } from "svelte/transition";
</script>

<div
    in:fade
    class="mt-4 container rounded-md border-2 bg-green-200 border-green-500 text-primary-black"
>
    <slot />
</div>
