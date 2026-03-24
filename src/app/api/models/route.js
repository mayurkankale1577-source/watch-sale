import db from "@/db/db";

export async function GET(req){

const {searchParams} = new URL(req.url);

const brandId = searchParams.get("brand_id");

const [rows] = await db.query(

`SELECT id,name FROM models
WHERE brand_id = ?`,

[brandId]

);

return Response.json(rows);

}