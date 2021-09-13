<script>
    import { fade } from "svelte/transition";
</script>

<div
    in:fade
    class="mt-4 container rounded-md border-2 bg-red-200 border-red-500 text-primary-black"
>
    <h4 class=" pt-4 font-bold text-lg text-center">Uh oh!</h4>
    <slot />
</div>
