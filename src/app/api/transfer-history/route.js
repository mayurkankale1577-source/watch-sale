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
s1.name as from_store,
s2.name as to_store,
wt.status

FROM watch_transfers wt
JOIN watches w ON wt.watch_id=w.id
JOIN models m ON w.model_id=m.id
JOIN stores s1 ON wt.from_store = s1.id
JOIN stores s2 ON wt.to_store = s2.id

WHERE wt.from_store=? 
OR wt.to_store=?`,

[storeId,storeId]

);

return Response.json(rows);

}