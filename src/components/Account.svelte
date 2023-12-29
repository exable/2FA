<script>
    import {createEventDispatcher} from "svelte"
    import { onDestroy, onMount } from "svelte";
    const dispatcher = createEventDispatcher()
    export let id,label, code, notes;

    let notesView = false;
    /**@type {HTMLDialogElement}*/
    let deleteDialog;
    /**@type {HTMLDialogElement}*/
    let editDialog;

    let expires = (((code.expires*1000)-Date.now())/1000)/0.3
    onMount(() => {
        const interval = setInterval(() => {
            expires = (((code.expires*1000)-Date.now())/1000)/0.3
            if(expires <= 0) {
                expires=0
                dispatcher("invalidate")
                
            }
        }, 100)

        return () => {
            clearInterval(interval)
        }
    })
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="h-max bg-neutral-900 rounded border-neutral-800 p-5 w-72 relative">
    <div class="flex justify-between items-center cursor-pointer  z-20" on:click={() => notesView = !notesView}>
        <div>
            <h1 class="text-2xl">{label}</h1>
            <button on:click={() => navigator.clipboard.writeText(code.code)} 
                class="text-blue-600 font-code text-xl focus-visible:border-blue-600 border border-transparent outline-none rounded">
                {code.code}
            </button>
        </div>
        <svg viewBox="0 0 64 64" class="pie">
            <circle class="background" r="25%" cx="50%" cy="50%"></circle>
            <circle class="chart" r="25%" cx="50%" cy="50%" stroke-dasharray={`${expires} 100`}></circle>
        </svg>
    </div>
    {#if notesView}
    <div class="bg-neutral-900 px-5 pb-5 rounded absolute w-full top-[5.5rem] -left-0 z-10">
        {#if notes.length > 0}
            <hr class="w-full h-px bg-neutral-800 border-none mb-2">
            {#each notes.split("\n") as line}
                <p class="text-sm text-neutral-400 font-mono">{line}</p>
            {/each}
        {/if}
        <hr class="w-full h-px bg-neutral-800 border-none my-2">
        <button on:click={()=>editDialog.showModal()} class="bg-neutral-800 p-2 rounded border border-transparent hover:border-blue-600 hover:bg-blue-950/50">
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>
        </button>    
        <button on:click={()=>deleteDialog.showModal()} class="bg-neutral-800 p-2 rounded border border-transparent hover:border-red-600 hover:bg-red-950/50">
            <svg class="w-5 h-5 text-red-600" viewBox="0 0 24 24"><path fill="currentColor" d="M8.27 3L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3M8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41"/></svg>
        </button>    

        <dialog class="w-96 h-max bg-neutral-900 p-5 rounded text-white backdrop:bg-neutral-950/50" bind:this={deleteDialog}>
            <form method="post" action="?/delete">
                <h1 class="text-2xl">Delete <span class="underline">{label}</span></h1>
                <p class="font-mono">Are you sure you want to delete this item?</p>
                <input type="hidden" name="id" value={id}>
                <div class="flex gap-2 mt-5">
                    <button class="bg-neutral-800 px-2 py-1.5 rounded" type="button" on:click={() => deleteDialog.close()}>Cancel</button>
                    <button class="bg-red-600 px-2 py-1.5 rounded" type="submit">Delete</button>
                </div>
            </form>
        </dialog>

        <dialog class="w-96 h-max bg-neutral-900 p-5 rounded text-white backdrop:bg-neutral-950/50" bind:this={editDialog}>
            <form method="post" action="?/edit">
                <h1 class="text-xl">Edit account</h1>
                <input type="hidden" name="id" value={id}>
                <label for="label">Label</label>
                <input class="w-full h-9 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" type="text" name="label" id="label" value={label}>
                <label for="secret">Code</label>
                <input class="w-full h-9 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" type="text" name="secret" id="secret">
                <label for="notes">Notes</label>
                <textarea class="w-full h-24 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" name="notes" id="notes" rows="30" value={notes}/>
                <div class="flex gap-2">
                    <button class="bg-neutral-800 px-2 py-1.5 rounded" type="button" on:click={() => editDialog.close()}>Cancel</button>
                    <button class="bg-blue-600 px-2 py-1.5 rounded" type="submit">Edit</button>
                </div>
            </form>
        </dialog>
    </div>
    {/if}
    <!--  -->
</div>

<style>
    .pie{
        width: 50px;
        height: 50px;
        border-radius:50%;
        transform: rotate(-90deg);
    }
    .pie .background{
        fill:none;
        stroke:rgba(38 38 38);
        stroke-width:4;
        
    }
    .pie .chart{
        fill:none;
        stroke: rgba(37 99 235);
        stroke-width:4;
    }
</style>