import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(){

const [rows] = await db.query(
"SELECT id,name FROM users WHERE role='sales'"
);

return Response.json(rows);

}