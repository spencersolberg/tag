<script>
  import Nav from "../components/nav.svelte";
  import "../app.postcss";
</script>

<svelte:head>
  <style>
    body {
      @apply dark:bg-gray-900;
    }
  </style>
</svelte:head>

<Nav />

<main>
  <div class="p-8 max-w-6xl mx-auto">
    <slot />
  </div>
</main>
