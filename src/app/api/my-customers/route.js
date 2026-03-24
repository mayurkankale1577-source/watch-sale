import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(req){

const userId = req.headers.get("userid");

const { searchParams } = new URL(req.url);

const page = parseInt(searchParams.get("page")) || 1;
const search = searchParams.get("search") || "";

const limit = 10;
const offset = (page-1)*limit;

/* customers count */

const [customersCount] = await db.query(
`SELECT COUNT(*) as total
FROM customers
WHERE assigned_to=? AND name LIKE ?`,
[userId, `%${search}%`]
);

/* customers list */

const [rows] = await db.query(`

SELECT 
c.id,
c.name,
c.email,
c.phone,
c.address,
COUNT(r.id) as total_requests

FROM customers c

LEFT JOIN requirements r
ON c.id = r.customer_id
AND r.sales_person_id=?

WHERE c.assigned_to=? 
AND c.name LIKE ?

GROUP BY c.id

LIMIT ? OFFSET ?

`,[userId,userId,`%${search}%`,limit,offset]);

/* stats */

const [requests] = await db.query(
"SELECT COUNT(*) as total FROM requirements WHERE sales_person_id=?",
[userId]
);

const [waiting] = await db.query(
"SELECT COUNT(*) as total FROM requirements WHERE sales_person_id=? AND status='waiting'",
[userId]
);

const [sold] = await db.query(
"SELECT COUNT(*) as total FROM requirements WHERE sales_person_id=? AND status='sold'",
[userId]
);

const [cancelled] = await db.query(
"SELECT COUNT(*) as total FROM requirements WHERE sales_person_id=? AND status='cancelled'",
[userId]
);

return Response.json({

customers: rows,

customersCount: customersCount[0].total,
requestsCount: requests[0].total,
waitingCount: waiting[0].total,
soldCount: sold[0].total,
cancelledCount: cancelled[0].total

});

}