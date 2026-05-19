export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req){

const { searchParams } = new URL(req.url);

const page = parseInt(searchParams.get("page")) || 1;
const search = searchParams.get("search") || "";

const limit = 10;
const offset = (page - 1) * limit;

/* ================= GET STORE ================= */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

let storeId = null;

if(token){
const decoded = jwt.verify(token,process.env.JWT_SECRET);
storeId = decoded.store_id;
}

/* ================= TOTAL ================= */

const [countRows] = await db.query(`
SELECT COUNT(*) as total
FROM customers
WHERE store_id = ?
AND name LIKE ?
`,[
storeId,
`%${search}%`
]);

/* ================= DATA ================= */

const [rows] = await db.query(`

SELECT 
c.id,
c.name,
c.email,
c.phone,
c.address,
c.assigned_to,
u.name AS seller

FROM customers c
LEFT JOIN users u ON c.assigned_to = u.id

WHERE c.store_id = ?
AND c.name LIKE ?

ORDER BY c.id DESC
LIMIT ? OFFSET ?

`,[
storeId,
`%${search}%`,
limit,
offset
]);

return Response.json({
data: rows,
total: countRows[0].total,
page,
limit
});

}