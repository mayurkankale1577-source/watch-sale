export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import db from "@/db/db";

export async function GET(req){

const storeId = req.headers.get("storeid");

const [rows] = await db.query(`

SELECT 
b.name AS brand,
m.name AS model,
w.reference_number,
w.movement,
w.case_material,
w.case_diameter,
w.image,
COUNT(w.serial_number) AS stock

FROM watches w

JOIN models m
ON w.model_id = m.id

JOIN brands b
ON m.brand_id = b.id

WHERE w.store_id = ?

GROUP BY 
b.name,
m.name,
w.reference_number,
w.movement,
w.case_material,
w.case_diameter,
w.image

ORDER BY b.name

`,[storeId]);

return Response.json(rows);

}