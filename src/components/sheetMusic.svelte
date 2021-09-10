<script>
    export let sheetMusic;
    let height;
    let width;
    const loaded = async () => {
        const loadingTask = pdfjsLib.getDocument(sheetMusic.url);
        const pdf = await loadingTask.promise;
        console.log(pdf._pdfInfo.numPages)

        for(let i=1; i<=pdf._pdfInfo.numPages; i++) {
            const page = await pdf.getPage(i);
            const scale = 1.5;
            const viewport = page.getViewport({scale});

            const pagesDiv = document.getElementById("pages");
            const divHolder = document.createElement("div");
            const canvas = document.createElement("canvas");
            divHolder.className = (height > width) ? "aspect-w-3 aspect-h-4" : "aspect-w-3 aspect-h-4";
            canvas.className = "rounded-md";
            pagesDiv.appendChild(divHolder);
            divHolder.appendChild(canvas);

            const context = canvas.getContext("2d");
            height, canvas.height = viewport.height;
            width, canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            }

            page.render(renderContext);
        }

        // const page = await pdf.getPage(1);
        // const scale = 1.5;
        // const viewport = page.getViewport({ scale: scale });


        // const canvas = document.getElementById("pdf");
        // const context = canvas.getContext("2d");
        // height, canvas.height = viewport.height;
        // width, canvas.width = viewport.width;

        // const renderContext = {
        //     canvasContext: context,
        //     viewport: viewport,
        // };
        // page.render(renderContext);
    };
</script>

<svelte:head>
    {#if sheetMusic.type == "pdf"}
        <script
            src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/build/pdf.min.js"
            on:load={loaded}></script>
    {/if}
</svelte:head>

{#if sheetMusic.type != "pdf"}
    <img class="object-contain" src={sheetMusic.url} alt="Sheet music" />
{:else}
    <!-- <PdfPage src={sheetMusic.url} page="{1}"/> -->
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2" id="pages">
    <!-- <canvas class="rounded-md" id="pdf" /> -->
    </div>
    <!-- <div class="w-full h-full">
        <iframe
            src={sheetMusic.url}
            height="1000"
            frameborder="0"
            scrolling="auto"
            title="Sheet Music"
            class="w-full"
        /> -->
    <!-- <embed class="w-full h-full" src={sheetMusic.url + "#view=fitH"} type="application/pdf" /> -->
    <!-- <object title="Sheet Music" data={sheetMusic.url} type="application/pdf">
            <embed src={sheetMusic.url} type="application/pdf" />
          </object> -->
    <!-- </div> -->
{/if}
