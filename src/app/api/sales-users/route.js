import db from "@/db/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(){

/* get token */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json([]);
}

/* decode token */

const decoded = jwt.verify(token,process.env.JWT_SECRET);
const storeId = decoded.store_id;

/* fetch only same store sellers */

const [rows] = await db.query(
"SELECT id,name FROM users WHERE role='sales' AND store_id=?",
[storeId]
);

return Response.json(rows);

}