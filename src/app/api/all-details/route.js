import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(){

try{

/* ================= GET STORE FROM TOKEN ================= */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

let storeId = null;

if(token){
const decoded = jwt.verify(token,process.env.JWT_SECRET);
storeId = decoded.store_id;
}

/* ================= COUNTS ================= */

const [[customers]] = await db.query(
`SELECT COUNT(*) as total FROM customers 
WHERE store_id=? OR store_id IS NULL`,
[storeId]
);

const [[salesUsers]] = await db.query(
`SELECT COUNT(*) as total FROM users 
WHERE role='sales' AND (store_id=? OR store_id IS NULL)`,
[storeId]
);

const [[sold]] = await db.query(
`SELECT COUNT(*) as total FROM requirements 
WHERE status='sold' AND (store_id=? OR store_id IS NULL)`,
[storeId]
);

const [[cancelled]] = await db.query(
`SELECT COUNT(*) as total FROM requirements 
WHERE status='cancelled' AND (store_id=? OR store_id IS NULL)`,
[storeId]
);

const [[assigned]] = await db.query(
`SELECT COUNT(*) as total FROM requirements 
WHERE status='assigned' AND (store_id=? OR store_id IS NULL)`,
[storeId]
);

const [[waiting]] = await db.query(
`SELECT COUNT(*) as total FROM requirements 
WHERE status='waiting' AND (store_id=? OR store_id IS NULL)`,
[storeId]
);

/* ================= RETURN ================= */

return Response.json({
customers: customers.total,
salesUsers: salesUsers.total,
sold: sold.total,
cancelled: cancelled.total,
assigned: assigned.total,
waiting: waiting.total
});

}catch(err){

console.log("All Details Error:",err);

return Response.json({error:"server error"});

}

}