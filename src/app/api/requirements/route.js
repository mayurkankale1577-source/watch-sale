import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


/* ================= GET ================= */

export async function GET(req){

try{

const {searchParams} = new URL(req.url);

const status = searchParams.get("status");
const search = searchParams.get("search");
const seller = searchParams.get("seller");

const page = parseInt(searchParams.get("page")) || 1;
const limit = 10;
const offset = (page - 1) * limit;

/* ================= BASE SELECT ================= */

let query = `
SELECT 

r.id,
c.name AS customer_name,
c.email,
c.phone,

b.name AS brand,
m.name AS model,

r.model_id,
r.reference_number,

u.id AS sales_id,          /* ✅ IMPORTANT */
u.name AS sales_name,

r.created_at,

/* STOCK COUNT */
(SELECT COUNT(*) 
 FROM watches w 
 WHERE w.model_id = r.model_id 
 AND w.status = 'available'
 AND (
   r.reference_number IS NULL 
   OR r.reference_number = '' 
   OR w.reference_number = r.reference_number
 )
) AS available_count
`;

/* ================= ASSIGNED EXTRA ================= */

if(status === "assigned"){
query += `,
a.assigned_at,
a.hold_until,
w.serial_number
`;
}

/* ================= FROM ================= */

query += `
FROM requirements r

JOIN customers c ON r.customer_id = c.id
JOIN brands b ON r.brand_id = b.id
JOIN models m ON r.model_id = m.id
JOIN users u ON r.sales_person_id = u.id
`;

/* ================= ONLY ASSIGNED ================= */

if(status === "assigned"){
query += `
JOIN assignments a ON r.id = a.requirement_id
JOIN watches w ON a.watch_id = w.id
`;
}

/* ================= CONDITIONS ================= */

let conditions = [];
let values = [];

/* status */
if(status){
conditions.push("r.status = ?");
values.push(status);
}

/* search */
if(search){
conditions.push(`(
c.name LIKE ? OR 
c.email LIKE ? OR 
c.phone LIKE ?
)`);
values.push(`%${search}%`,`%${search}%`,`%${search}%`);
}

/* ✅ seller filter (FIXED) */
if(seller){
conditions.push("u.id = ?");
values.push(seller);
}

if(conditions.length > 0){
query += " WHERE " + conditions.join(" AND ");
}

/* ================= SORT ================= */

if(status === "assigned"){
query += " ORDER BY a.assigned_at DESC";
}else{
query += " ORDER BY r.created_at ASC";
}

/* ================= EXECUTE ================= */

const [rows] = await db.query(
query + " LIMIT ? OFFSET ?",
[...values, limit, offset]
);

/* ================= TOTAL COUNT ================= */

const [[{total}]] = await db.query(
`
SELECT COUNT(*) as total 
FROM requirements r
JOIN customers c ON r.customer_id = c.id
JOIN users u ON r.sales_person_id = u.id
${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
`,
values
);

/* ================= RETURN ================= */

return Response.json({
data: rows,
total: total
});

}catch(err){

console.log("GET Requirement Error:",err);

return Response.json({
data: [],
total: 0
});

}
}

/* ================= POST (UNCHANGED) ================= */

export async function POST(req){

try{

const body = await req.json();

const {
customer_id,
brand_id,
model_id,
reference_number,
sales_person_id
} = body;

if(!customer_id || !brand_id || !model_id || !sales_person_id){
return Response.json({
success:false,
message:"Missing required fields"
});
}

await db.query(
`INSERT INTO requirements
(customer_id, brand_id, model_id, reference_number, sales_person_id, status)
VALUES (?,?,?,?,?,?)`,
[
customer_id,
brand_id,
model_id,
reference_number || null,
sales_person_id,
"waiting"
]
);

return Response.json({
success:true,
message:"Requirement added successfully"
});

}catch(err){

console.log("Requirement Error:",err);

return Response.json({
success:false,
message:"Error adding requirement"
});

}
}