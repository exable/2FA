<script>
    import "../app.pcss";
    export let data;
	/**@type {HTMLDialogElement}*/
	let dialog;
</script>
{#if !data.user} 
<form method="POST" action="?/login" class="flex flex-col w-full max-w-72">
	<h1 class="text-2xl font-bold">Login</h1>
	<label for="username">Username</label>
	<input class="w-full h-9 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" type="text" name="username" id="username">
	<label for="password">Password:</label>
	<input class="w-full h-9 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" type="password" name="password" id="password">
	<button class="p-2 w-max bg-blue-600 rounded mt-2">Log in</button>
</form>
{:else}
	<nav class="w-full h-10 border-b border-neutral-900 flex justify-between">
		<form action="">
			<button on:click={() => dialog.showModal()} class="p-2 bg-neutral-900 rounded">
				<svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
			</button>
		</form>
		<form method="POST" action="?/logout" class="w-max h-max">
			<button class="p-2 bg-neutral-900 rounded" type="submit">
				<svg class="w-5 h-5 text-red-600" viewBox="0 0 24 24"><path fill="currentColor" d="M14.08 15.59L16.67 13H7v-2h9.67l-2.59-2.59L15.5 7l5 5l-5 5zM19 3a2 2 0 0 1 2 2v4.67l-2-2V5H5v14h14v-2.67l2-2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2z"/></svg>
			</button>
		</form>
	</nav>
    <slot></slot>

	<dialog class="w-96 h-max bg-neutral-900 p-5 rounded text-white backdrop:bg-neutral-950/50" bind:this={dialog}>
		<form method="post" action="?/create">
			<h1 class="text-xl">Add account</h1>
			<label for="label">Name</label>
			<input class="w-full h-9 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" type="text" name="name" id="name">
			<label for="secret">Code</label>
			<input class="w-full h-9 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" type="text" name="secret" id="secret">
			<label for="notes">Notes</label>
			<textarea class="w-full h-24 px-2 rounded bg-neutral-900 border border-neutral-800 outline-none" name="notes" id="notes" rows="30"/>
			<div class="flex gap-2">
				<button class="bg-neutral-800 px-2 py-1.5 rounded" type="button" on:click={() => dialog.close()}>Cancel</button>
				<button class="bg-blue-600 px-2 py-1.5 rounded" type="submit">Create</button>
			</div>
		</form>
	</dialog>
{/if}
