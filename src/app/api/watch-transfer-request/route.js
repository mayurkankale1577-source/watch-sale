import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req){

const body = await req.json();

const {model_id,reference} = body;

const token = cookies().get("token")?.value;

const decoded = jwt.verify(token,process.env.JWT_SECRET);

const to_store = decoded.store_id;
const requested_by = decoded.id;

const [watch] = await db.query(

`SELECT id,store_id
FROM watches
WHERE model_id=?
AND status='available'
AND store_id != ?
AND (reference_number=? OR ? IS NULL)
LIMIT 1`,

[model_id,to_store,reference,reference]

);

if(watch.length === 0){

return Response.json({
message:"No watch available in other stores"
});

}

await db.query(

`INSERT INTO watch_transfers
(watch_id,from_store,to_store,requested_by,status)
VALUES (?,?,?,?,?)`,

[
watch[0].id,
watch[0].store_id,
to_store,
requested_by,
"pending"
]

);

return Response.json({message:"Transfer request sent"});

}