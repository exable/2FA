<script>
    import { onMount } from "svelte";
    import Account from "../components/Account.svelte";


    let accounts;
    onMount(() => fetchAccounts())
    async function fetchAccounts() {
        accounts = await fetch('/', {credentials:'include'}).then(res => {
            if(res.status == 200) {
                return res.json()
            } else {
                return {
                    error: 'unauthenticated'
                }
            }
        })
    }
</script>
<div class="w-full h-max flex flex-wrap gap-2 py-5">
{#if accounts}
{#each accounts as account}
    <Account id={account._id} name={account.name} code={account.code} notes={account.notes} 
        on:invalidate={()=>fetchAccounts()} />
{/each}
{/if}
</div>
