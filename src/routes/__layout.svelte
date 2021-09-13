<script>
    import "../app.postcss";
    import { session } from "$app/stores";
    import supabase from "$lib/db";
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import Nav from "../components/nav.svelte";
    if (browser) {
        $session = supabase.auth.session();
        supabase.auth.onAuthStateChange((event, sesh) => {
            $session = sesh;
        });
    }


</script>

<svelte:head>
    <style>
        body {
            @apply bg-primary-blue;
            @apply dark:bg-primary-black;
        }
        html,
        body {
            @apply h-full;
        }
    </style>
</svelte:head>

<Nav />

<main>
    <div class="p-8 max-w-6xl mx-auto">
        <slot />
        <!-- <pre
            class="p-4 dark:text-white overflow-x-scroll">{JSON.stringify($session, null, 4)}</pre> -->
    </div>
</main>
