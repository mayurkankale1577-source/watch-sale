import db from "@/db/db";

export async function POST(req){

const {transfer_id} = await req.json();

await db.query(

`UPDATE watch_transfers
SET status='rejected'
WHERE id=?`,

[transfer_id]

);

return Response.json({message:"Transfer rejected"});

}