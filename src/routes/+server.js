import { accounts } from '$lib/account.js';
import { getCode, getUser } from '$lib/utils.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({cookies}) {
    const user = await getUser(cookies.get("sid"));
    if(!user) return new Response(JSON.stringify({error:"unauthenticated"}),{status:401});
    let accs = [];
    let docs = await accounts.find({})
    for(let doc of docs) {
        doc = doc.toObject({flattenObjectIds: true});
        doc.code = getCode(doc.secret)
        delete doc.secret
        accs.push(doc)
    }


    return new Response(JSON.stringify(accs), {status:200});
}