<script>
    import { page, session } from  "$app/stores";
    import { goto } from "$app/navigation";


    if (!$session) goto("/auth");
</script>
<h1 class="text-4xl text-center mb-8 uppercase dark:text-white font-medium">@{$page.params.username}</h1>