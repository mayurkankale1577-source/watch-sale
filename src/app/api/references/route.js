import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(req){

const {searchParams} = new URL(req.url);
const modelId = searchParams.get("model_id");

const [rows] = await db.query(

`SELECT DISTINCT reference_number
FROM watches
WHERE model_id = ?`,

[modelId]

);

return Response.json(rows);

}