import db from "@/db/db";

export async function POST(req){

const {transfer_id,watch_id,to_store} = await req.json();

/* move watch to new store */

await db.query(
`UPDATE watches
SET store_id=?
WHERE id=?`,
[to_store,watch_id]
);

/* update transfer status */

await db.query(
`UPDATE watch_transfers
SET status='transferred'
WHERE id=?`,
[transfer_id]
);

return Response.json({
message:"Transfer approved"
});

}