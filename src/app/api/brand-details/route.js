export const runtime = "nodejs";

import db from "@/db/db";

export async function GET(){

try{

const [rows] = await db.query(`
SELECT 
b.name AS brand,
m.name AS model,
w.reference_number,
w.movement,
w.case_material,
w.case_diameter,
COUNT(w.serial_number) AS stock
FROM watches w
JOIN models m ON w.model_id = m.id
JOIN brands b ON m.brand_id = b.id
GROUP BY 
b.name,m.name,w.reference_number,w.movement,
w.case_material,w.case_diameter
ORDER BY b.name
`);

let csv =
"Brand,Model,Reference,Movement,Material,Diameter,Stock\n";

rows.forEach(r=>{
csv += `${r.brand},${r.model},${r.reference_number},${r.movement},${r.case_material},${r.case_diameter},${r.stock}\n`;
});

return new Response(csv,{
headers:{
"Content-Type":"text/csv",
"Content-Disposition":"attachment; filename=catalog.csv"
}
});

}catch(err){

console.log(err);

return new Response("Server Error",{status:500});

}

}