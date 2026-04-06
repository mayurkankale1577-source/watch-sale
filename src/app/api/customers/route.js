import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


/* ================= GET CUSTOMERS ================= */

export async function GET(){

const [rows] = await db.query(
"SELECT id,name FROM customers"
);

return Response.json(rows);

}


/* ================= ADD CUSTOMER ================= */

export async function POST(req){

const body = await req.json();

const {
name,
email,
phone,
address,
assigned_to,
created_by
} = body;


/* 🔐 GET STORE FROM TOKEN */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

let storeId = null;

if(token){

const decoded = jwt.verify(token,process.env.JWT_SECRET);
storeId = decoded.store_id;

}


/* 🔒 CHECK duplicate phone */

const [existing] = await db.query(
"SELECT id FROM customers WHERE phone=?",
[phone]
);

if(existing.length > 0){
return Response.json({
message:"Customer with this phone already exists"
});
}


/* INSERT CUSTOMER */

await db.query(
`INSERT INTO customers
(name,email,phone,address,assigned_to,created_by,store_id)
VALUES (?,?,?,?,?,?,?)`,
[
name,
email,
phone,
address,
assigned_to,
created_by,
storeId
]
);

return Response.json({
message:"Customer added"
});

}


/* ================= UPDATE CUSTOMER ================= */

export async function PUT(req){

const body = await req.json();

await db.query(`
UPDATE customers
SET name=?, email=?, phone=?, address=?, assigned_to=?
WHERE id=?
`,[
body.name,
body.email,
body.phone,
body.address,
body.assigned_to,
body.id
]);

return Response.json({
message:"Customer updated"
});

}