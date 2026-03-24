import db from "@/db/db";

export async function GET(){

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
ON w.brand_id = b.id

GROUP BY w.reference_number

ORDER BY b.name

`);

return Response.json(rows);

}