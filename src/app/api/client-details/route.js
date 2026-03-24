export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import db from "@/db/db";

export async function GET(req){

const { searchParams } = new URL(req.url);

const page = parseInt(searchParams.get("page")) || 1;
const search = searchParams.get("search") || "";

const limit = 10;
const offset = (page - 1) * limit;

/* total */
const [countRows] = await db.query(`
SELECT COUNT(*) as total
FROM customers
WHERE name LIKE ?
`,[`%${search}%`]);

/* data */
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

WHERE c.name LIKE ?

ORDER BY c.id DESC
LIMIT ? OFFSET ?

`,[`%${search}%`, limit, offset]);

return Response.json({
data: rows,
total: countRows[0].total,
page,
limit
});

}