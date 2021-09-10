<script>
    import "../app.postcss";
    import { session } from "$app/stores";
    import supabase from "$lib/db";
    import { browser } from "$app/env";


    if (browser) {
        $session = supabase.auth.session()
        supabase.auth.onAuthStateChange((event, sesh) => {
            $session = sesh;
        });
    }

    const signOut = async () => {
      const { error: err } = await supabase.auth.signOut();
      if (err) alert(err);
    }
</script>

<svelte:head>
    <meta name="theme-color" content="rgba(17, 24, 39, 1)">
    <style>
        body {
            @apply dark:bg-gray-900;
        }
        html, body {
            @apply h-full;
        }
    </style>
</svelte:head>

<nav class="mt-2 flex justify-center w-full">
  <a class="mx-4 text-lg dark:text-white" href="/">Home</a>
  <a class="mx-4 text-lg dark:text-white" href="/about">About</a>
  {#if !$session}
  <a class="mx-4 text-lg dark:text-white" href="/auth">Sign In</a>
  <a class="mx-4 text-lg dark:text-white" href="/auth">Sign Up</a>
  {:else}
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a class="mx-4 text-lg dark:text-white" on:click={signOut} href="#">Sign Out</a>

  {/if}
</nav>

<main>
    <div class="p-8 max-w-6xl mx-auto">
        <slot />
        <!-- <pre
            class="p-4 dark:text-white overflow-x-scroll">{JSON.stringify($session, null, 4)}</pre> -->
    </div>
</main>
