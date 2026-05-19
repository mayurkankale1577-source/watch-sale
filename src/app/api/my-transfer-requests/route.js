import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(){

const token = cookies().get("token")?.value;

const decoded = jwt.verify(token,process.env.JWT_SECRET);

const storeId = decoded.store_id;

const [rows] = await db.query(

`SELECT wt.id,
m.name as model,
wt.status,
s.name as from_store

FROM watch_transfers wt
JOIN watches w ON wt.watch_id=w.id
JOIN models m ON w.model_id=m.id
JOIN stores s ON wt.from_store = s.id

WHERE wt.to_store=?`,

[storeId]

);

return Response.json(rows);

}