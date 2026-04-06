export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(){

/* ================= STORE FROM TOKEN ================= */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

let storeId = null;

if(token){
const decoded = jwt.verify(token,process.env.JWT_SECRET);
storeId = decoded.store_id;
}

/* ================= QUERY ================= */

let query = `

SELECT 
b.name AS brand,
m.name AS model,
w.reference_number,
w.movement,
w.case_material,
w.case_diameter,
w.image,
COUNT(w.serial_number) AS stock

FROM watches w

JOIN models m
ON w.model_id = m.id

JOIN brands b
ON m.brand_id = b.id

WHERE 1=1
`;

let params = [];

/* store filter */

if(storeId){
query += " AND w.store_id=?";
params.push(storeId);
}

query += `

GROUP BY 
b.name,
m.name,
w.reference_number,
w.movement,
w.case_material,
w.case_diameter,
w.image

ORDER BY b.name
`;

const [rows] = await db.query(query,params);

return Response.json(rows);

}