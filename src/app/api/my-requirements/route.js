import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(req){

const sellerId = req.headers.get("userid");

const { searchParams } = new URL(req.url);

const status = searchParams.get("status") || "all";
const search = searchParams.get("search") || "";
const page = parseInt(searchParams.get("page")) || 1;

const limit = 10;
const offset = (page - 1) * limit;

/* ================= STATUS FILTER ================= */

let statusCondition = "";
let params = [sellerId];

if(status !== "all"){
statusCondition = "AND r.status = ?";
params.push(status);
}

/* ================= TOTAL COUNT ================= */

const [countRows] = await db.query(

`SELECT COUNT(*) as total
FROM requirements r
JOIN customers c ON r.customer_id = c.id
WHERE r.sales_person_id = ?
${statusCondition}
AND c.name LIKE ?`

,[...params, `%${search}%`]);

/* ================= DATA ================= */

const [rows] = await db.query(`

SELECT 
r.id,
r.customer_id,
r.status,
c.name AS customer_name,
b.name AS brand,
m.name AS model,
w.reference_number,
w.serial_number,
a.watch_id

FROM requirements r

JOIN customers c ON r.customer_id = c.id
JOIN brands b ON r.brand_id = b.id
JOIN models m ON r.model_id = m.id

LEFT JOIN assignments a 
ON r.id = a.requirement_id

LEFT JOIN watches w 
ON a.watch_id = w.id

WHERE r.sales_person_id = ?
${statusCondition}
AND c.name LIKE ?

ORDER BY r.created_at DESC

LIMIT ? OFFSET ?

`,[...params, `%${search}%`, limit, offset]);

return Response.json({

data: rows,
total: countRows[0].total,
page,
limit

});

}