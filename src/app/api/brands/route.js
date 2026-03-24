import db from "@/db/db";

export async function GET(){

const [rows] = await db.query(
"SELECT id,name FROM brands"
);

return Response.json(rows);

}