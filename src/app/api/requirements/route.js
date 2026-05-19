import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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


/* ================= STORE FROM TOKEN ================= */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

let storeId = null;

if(token){
const decoded = jwt.verify(token,process.env.JWT_SECRET);
storeId = decoded.store_id;
}


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

u.id AS sales_id,
u.name AS sales_name,

r.created_at,
r.status,

/* STOCK COUNT */
(SELECT COUNT(*) 
 FROM watches w 
 WHERE w.model_id = r.model_id 
 AND w.status = 'available'
 AND w.store_id = r.store_id
 AND (
   r.reference_number IS NULL 
   OR r.reference_number = '' 
   OR w.reference_number = r.reference_number
 )
) AS available_count
`;


/* ================= ASSIGNED EXTRA ================= */

query += `,
a.assigned_at,
a.hold_until,
w.serial_number
`;


/* ================= FROM ================= */

query += `
FROM requirements r

JOIN customers c ON r.customer_id = c.id
JOIN brands b ON r.brand_id = b.id
JOIN models m ON r.model_id = m.id
JOIN users u ON r.sales_person_id = u.id
LEFT JOIN assignments a ON r.id = a.requirement_id
LEFT JOIN watches w ON a.watch_id = w.id
`;


/* ================= CONDITIONS ================= */

let conditions = [];
let values = [];


/* STORE FILTER (SAFE) */

if(storeId){
conditions.push("(r.store_id = ? OR r.store_id IS NULL)");
values.push(storeId);
}


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


/* seller filter */

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


/* ================= POST ================= */

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


/* STORE FROM TOKEN */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

let storeId = null;

if(token){
const decoded = jwt.verify(token,process.env.JWT_SECRET);
storeId = decoded.store_id;
}


await db.query(
`INSERT INTO requirements
(customer_id, brand_id, model_id, reference_number, sales_person_id, status, store_id)
VALUES (?,?,?,?,?,?,?)`,
[
customer_id,
brand_id,
model_id,
reference_number || null,
sales_person_id,
"waiting",
storeId
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