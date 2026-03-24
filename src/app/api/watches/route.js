import db from "@/db/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req){

const {searchParams} = new URL(req.url);

const modelId = searchParams.get("model_id");
const reference = searchParams.get("reference");

/* Allocation page */

if(modelId){

let query = `
SELECT id, reference_number, serial_number
FROM watches
WHERE model_id = ?
AND status='available'
`;

let params = [modelId];

if(reference && reference !== "null"){
query += " AND reference_number=?";
params.push(reference);
}

const [rows] = await db.query(query,params);

return Response.json(rows);
}

/* Seller stock page */

const [rows] = await db.query(`

SELECT 
b.name AS brand,
m.name AS model,
w.reference_number,
w.movement,
w.case_material,
w.case_diameter,
COUNT(*) AS stock

FROM watches w

JOIN brands b ON w.brand_id = b.id
JOIN models m ON w.model_id = m.id

WHERE w.status='available'

GROUP BY 
b.name,
m.name,
w.reference_number,
w.movement,
w.case_material,
w.case_diameter

ORDER BY b.name

`);

return Response.json(rows);

}