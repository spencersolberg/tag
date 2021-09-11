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
    <style>
        body {
            @apply bg-primary-blue;
            @apply dark:bg-primary-black;
        }
        html, body {
            @apply h-full;
        }
    </style>
</svelte:head>

<nav class="pt-2 flex justify-center w-full bg-primary-red">
  <a class="mx-4 text-lg text-primary-white" href="/">Home</a>
  <a class="mx-4 text-lg text-primary-white" href="/about">About</a>
  {#if !$session}
  <a class="mx-4 text-lg text-primary-white" href="/auth">Sign In</a>
  <a class="mx-4 text-lg text-primary-white" href="/auth">Sign Up</a>
  {:else}
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a class="mx-4 text-lg text-primary-white" on:click={signOut} href="#">Sign Out</a>

  {/if}
</nav>

<main>
    <div class="p-8 max-w-6xl mx-auto">
        <slot />
        <!-- <pre
            class="p-4 dark:text-white overflow-x-scroll">{JSON.stringify($session, null, 4)}</pre> -->
    </div>
</main>
