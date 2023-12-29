import { accounts } from '$lib/account.js';
import { getUser } from '$lib/utils.js';



/** @type {import('./$types').LayoutServerLoad} */
export async function load({cookies}) {
    const user = await getUser(cookies.get("sid")) 
    return {
        user: user,
    }
}

