import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(){

const token = cookies().get("token")?.value;

const decoded = jwt.verify(token,process.env.JWT_SECRET);

const storeId = decoded.store_id;

const [rows] = await db.query(

`SELECT wt.id,
wt.watch_id,
m.name as model,
wt.to_store

FROM watch_transfers wt
JOIN watches w ON wt.watch_id=w.id
JOIN models m ON w.model_id=m.id

WHERE wt.from_store=?
AND wt.status='pending'`,

[storeId]

);

return Response.json(rows);

}